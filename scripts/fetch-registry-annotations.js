#!/usr/bin/env node

/**
 * Fetch Registry Annotations Script
 * 
 * This script fetches component and block metadata from all 90+ shadcn-compatible
 * registries and organizes them into structured annotation files.
 * 
 * Usage: npm run fetch:annotations
 * 
 * Output files:
 *   - scripts/annotations/registries-metadata.json
 *   - scripts/annotations/components-annotations.json
 *   - scripts/annotations/blocks-annotations.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SHADCN_REGISTRIES_URL = 'https://ui.shadcn.com/r/registries.json';
const ANNOTATIONS_DIR = path.join(__dirname, 'annotations');
const REQUEST_DELAY_MS = 100; // Delay between requests to avoid rate limiting
const REQUEST_TIMEOUT_MS = 10000; // 10 second timeout per request
const MAX_RETRIES = 2;

// Component types categorization
const COMPONENT_TYPES = ['registry:ui', 'registry:hook', 'registry:lib', 'registry:style'];
const BLOCK_TYPES = ['registry:block'];

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch with timeout and retry logic
 * @param {string} url - URL to fetch
 * @param {number} retries - Number of retries remaining
 * @returns {Promise<Response>}
 */
async function fetchWithRetry(url, retries = MAX_RETRIES) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (retries > 0 && error.name !== 'AbortError') {
      await sleep(500); // Wait before retry
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}

/**
 * Fetch the master registry list from shadcn
 * @returns {Promise<Object>} Registry name to URL mapping
 */
async function fetchRegistryList() {
  console.log('📋 Fetching registry list from shadcn...');
  
  try {
    const response = await fetchWithRetry(SHADCN_REGISTRIES_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const registries = await response.json();
    console.log(`   Found ${Object.keys(registries).length} registries\n`);
    return registries;
  } catch (error) {
    throw new Error(`Failed to fetch registry list: ${error.message}`);
  }
}

/**
 * Get possible index URLs for a registry
 * Different registries use different URL structures
 * @param {string} registryUrl - Registry URL pattern
 * @returns {string[]} Array of possible index URLs to try
 */
function getIndexUrls(registryUrl) {
  // Remove the {name} pattern variations
  const baseUrl = registryUrl
    .replace('/{name}.json', '')
    .replace('{name}.json', '')
    .replace('/{name}', '')
    .replace('{name}', '')
    .replace(/\/$/, ''); // Remove trailing slash
  
  // Try multiple possible index URL patterns
  return [
    `${baseUrl}/index.json`,
    `${baseUrl.replace('/r', '')}/r/index.json`,
    `${baseUrl}/styles/index.json`,
    `${baseUrl.replace('/registry', '')}/registry/index.json`,
    `${baseUrl.replace('/c', '')}/c/index.json`,
  ];
}

/**
 * Fetch components from a registry's index
 * @param {string} registryName - Registry name (e.g., "@magicui")
 * @param {string} registryUrl - Registry URL pattern
 * @returns {Promise<{items: Array|null, indexUrl: string}>} Array of components or null if failed
 */
async function fetchRegistryIndex(registryName, registryUrl) {
  const indexUrls = getIndexUrls(registryUrl);
  
  for (const indexUrl of indexUrls) {
    try {
      const response = await fetchWithRetry(indexUrl);
      
      if (!response.ok) {
        continue; // Try next URL
      }
      
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json') && !contentType.includes('text/')) {
        continue; // Not JSON, try next URL
      }
      
      const text = await response.text();
      if (!text || text.includes('<!DOCTYPE') || text.includes('<html')) {
        continue; // HTML response, try next URL
      }
      
      const data = JSON.parse(text);
      
      // Handle different response formats
      let items = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data && Array.isArray(data.items)) {
        items = data.items;
      } else if (data && typeof data === 'object') {
        // Some registries return a single item or object
        if (data.name && data.type) {
          items = [data];
        } else {
          // Try to extract components from object values
          items = Object.values(data).filter(item => 
            item && typeof item === 'object' && item.name
          );
        }
      }
      
      if (items.length > 0) {
        return { items, indexUrl };
      }
    } catch (error) {
      continue; // Try next URL
    }
  }
  
  return { items: null, indexUrl: indexUrls[0] };
}

/**
 * Categorize items into components and blocks
 * @param {Array} items - Array of registry items
 * @returns {Object} { components: [], blocks: [] }
 */
function categorizeByType(items) {
  const components = [];
  const blocks = [];
  
  for (const item of items) {
    if (!item || !item.name) continue;
    
    const type = item.type || '';
    const normalizedType = type.toLowerCase();
    
    if (BLOCK_TYPES.some(t => normalizedType.includes('block'))) {
      blocks.push(item);
    } else {
      // Default to component for ui, hook, lib, style, or unknown types
      components.push(item);
    }
  }
  
  return { components, blocks };
}

/**
 * Extract component info from raw item
 * @param {Object} item - Raw registry item
 * @returns {Object} Simplified component info
 */
function extractComponentInfo(item) {
  return {
    type: (item.type || 'unknown').replace('registry:', ''),
    dependencies: item.dependencies || [],
    registryDependencies: item.registryDependencies || [],
  };
}

/**
 * Generate a human-readable name from registry namespace
 * @param {string} namespace - Registry namespace (e.g., "@magicui")
 * @returns {string} Human-readable name
 */
function generateRegistryName(namespace) {
  // Remove @ prefix and convert to title case
  const name = namespace.replace('@', '');
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Main function to fetch and generate all annotations
 */
async function main() {
  console.log('🚀 Starting Registry Annotations Fetch\n');
  console.log('=' .repeat(50));
  
  // Ensure annotations directory exists
  if (!fs.existsSync(ANNOTATIONS_DIR)) {
    fs.mkdirSync(ANNOTATIONS_DIR, { recursive: true });
  }
  
  // Fetch registry list
  const registries = await fetchRegistryList();
  
  // Ensure shadcn main registry is included (it might not be in the registries list)
  if (!registries['@shadcn']) {
    registries['@shadcn'] = 'https://ui.shadcn.com/r/{name}.json';
  }
  
  // Initialize data structures
  const registriesMetadata = {
    lastUpdated: new Date().toISOString(),
    totalRegistries: Object.keys(registries).length,
    registries: {},
  };
  
  const componentsAnnotations = {
    lastUpdated: new Date().toISOString(),
    registries: {},
  };
  
  const blocksAnnotations = {
    lastUpdated: new Date().toISOString(),
    registries: {},
  };
  
  // Statistics
  let successCount = 0;
  let failedCount = 0;
  let totalComponents = 0;
  let totalBlocks = 0;
  const failedRegistries = [];
  
  // Process each registry
  const registryEntries = Object.entries(registries);
  
  for (let i = 0; i < registryEntries.length; i++) {
    const [namespace, url] = registryEntries[i];
    const progress = `[${i + 1}/${registryEntries.length}]`;
    
    process.stdout.write(`${progress} Fetching ${namespace}... `);
    
    // Fetch components
    const { items, indexUrl } = await fetchRegistryIndex(namespace, url);
    
    // Add to metadata
    registriesMetadata.registries[namespace] = {
      name: generateRegistryName(namespace),
      url: url.replace('/{name}.json', '').replace('{name}.json', '').replace('/{name}', '').replace('{name}', ''),
      indexUrl,
    };
    
    if (items === null) {
      console.log('❌ Failed');
      failedCount++;
      failedRegistries.push(namespace);
    } else if (items.length === 0) {
      console.log('⚠️  Empty');
      successCount++;
    } else {
      // Categorize items
      const { components, blocks } = categorizeByType(items);
      
      // Add components
      if (components.length > 0) {
        componentsAnnotations.registries[namespace] = {
          name: generateRegistryName(namespace),
          url: registriesMetadata.registries[namespace].url,
          components: {},
        };
        
        for (const comp of components) {
          componentsAnnotations.registries[namespace].components[comp.name] = 
            extractComponentInfo(comp);
        }
        
        totalComponents += components.length;
      }
      
      // Add blocks
      if (blocks.length > 0) {
        blocksAnnotations.registries[namespace] = {
          name: generateRegistryName(namespace),
          url: registriesMetadata.registries[namespace].url,
          blocks: {},
        };
        
        for (const block of blocks) {
          blocksAnnotations.registries[namespace].blocks[block.name] = 
            extractComponentInfo(block);
        }
        
        totalBlocks += blocks.length;
      }
      
      console.log(`✅ ${components.length} components, ${blocks.length} blocks`);
      successCount++;
    }
    
    // Rate limiting delay
    if (i < registryEntries.length - 1) {
      await sleep(REQUEST_DELAY_MS);
    }
  }
  
  // Add statistics to metadata
  registriesMetadata.statistics = {
    successful: successCount,
    failed: failedCount,
    totalComponents,
    totalBlocks,
  };
  
  if (failedRegistries.length > 0) {
    registriesMetadata.failedRegistries = failedRegistries;
  }
  
  // Write files
  console.log('\n' + '='.repeat(50));
  console.log('\n📁 Writing annotation files...\n');
  
  const metadataPath = path.join(ANNOTATIONS_DIR, 'registries-metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(registriesMetadata, null, 2));
  console.log(`   ✅ ${metadataPath}`);
  
  const componentsPath = path.join(ANNOTATIONS_DIR, 'components-annotations.json');
  fs.writeFileSync(componentsPath, JSON.stringify(componentsAnnotations, null, 2));
  console.log(`   ✅ ${componentsPath}`);
  
  const blocksPath = path.join(ANNOTATIONS_DIR, 'blocks-annotations.json');
  fs.writeFileSync(blocksPath, JSON.stringify(blocksAnnotations, null, 2));
  console.log(`   ✅ ${blocksPath}`);
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Summary:\n');
  console.log(`   Total Registries: ${registryEntries.length}`);
  console.log(`   Successful: ${successCount}`);
  console.log(`   Failed: ${failedCount}`);
  console.log(`   Total Components: ${totalComponents}`);
  console.log(`   Total Blocks: ${totalBlocks}`);
  
  if (failedRegistries.length > 0) {
    console.log(`\n⚠️  Failed registries: ${failedRegistries.join(', ')}`);
  }
  
  console.log('\n✨ Done!\n');
}

// Run
main().catch(error => {
  console.error(`\n❌ Error: ${error.message}\n`);
  process.exit(1);
});

