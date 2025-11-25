#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  parseArgs,
  hasArgs,
} from './utils/cli.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to components.json
const COMPONENTS_JSON_PATH = path.join(process.cwd(), 'components.json');

// Default shadcn registry URL
const DEFAULT_REGISTRY_URL = 'https://ui.shadcn.com/r';

// Load annotation files
const ANNOTATIONS_PATH = path.join(__dirname, 'annotations', 'components-annotations.json');
const REGISTRIES_METADATA_PATH = path.join(__dirname, 'annotations', 'registries-metadata.json');

// Load annotations (with fallback to empty objects if files don't exist)
let annotations = { registries: {} };
let registriesMetadata = { registries: {} };

try {
  if (fs.existsSync(ANNOTATIONS_PATH)) {
    annotations = JSON.parse(fs.readFileSync(ANNOTATIONS_PATH, 'utf-8'));
  }
  if (fs.existsSync(REGISTRIES_METADATA_PATH)) {
    registriesMetadata = JSON.parse(fs.readFileSync(REGISTRIES_METADATA_PATH, 'utf-8'));
  }
} catch (e) {
  // Ignore errors, use defaults
}

/**
 * Get registry-specific annotations
 * @param {string} registryName - Registry namespace (e.g., "@magicui")
 * @returns {Object} Components/blocks for that registry
 */
function getRegistryAnnotations(registryName) {
  const normalizedName = registryName.startsWith('@') ? registryName : `@${registryName}`;
  return annotations.registries[normalizedName] || {};
}

/**
 * Get annotation for a specific component
 * @param {string} name - Component name (kebab-case)
 * @param {string} registry - Registry namespace
 * @returns {Object|null} Component annotation or null
 */
function getComponentAnnotation(name, registry) {
  const registryData = getRegistryAnnotations(registry);
  return registryData[name] || null;
}

/**
 * Get description for a component
 * @param {string} name - Component name
 * @param {string} registry - Optional registry name for registry-specific info
 * @returns {string} Description or empty string
 */
function getComponentDescription(name, registry = null) {
  if (registry) {
    const annotation = getComponentAnnotation(name, registry);
    if (annotation?.description) {
      return annotation.description;
    }
  }
  
  // Try to find in any registry
  for (const [regName, regData] of Object.entries(annotations.registries)) {
    if (regData[name]?.description) {
      return regData[name].description;
    }
  }
  
  return '';
}

/**
 * Get display name for a component
 * @param {string} name - Component name (kebab-case)
 * @param {string} registry - Optional registry name
 * @returns {string} Display name or formatted kebab-case
 */
function getComponentDisplayName(name, registry = null) {
  if (registry) {
    const annotation = getComponentAnnotation(name, registry);
    if (annotation?.name) {
      return annotation.name;
    }
  }
  
  // Convert kebab-case to Title Case
  return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/**
 * Load components.json file
 * @returns {Object} Parsed components.json content
 */
function loadComponentsJson() {
  if (!fs.existsSync(COMPONENTS_JSON_PATH)) {
    throw new Error('components.json not found. Run "npx shadcn@latest init" first.');
  }
  
  const content = fs.readFileSync(COMPONENTS_JSON_PATH, 'utf-8');
  return JSON.parse(content);
}

/**
 * Get registry URL from namespace
 * @param {string} namespace - Registry namespace (e.g., "@magicui")
 * @returns {Object} { baseUrl, name }
 */
function getRegistryInfo(namespace) {
  if (!namespace || namespace === 'shadcn' || namespace === '@shadcn') {
    return {
      name: '@shadcn',
      baseUrl: DEFAULT_REGISTRY_URL,
    };
  }
  
  const normalizedNs = namespace.startsWith('@') ? namespace : `@${namespace}`;
  
  // Check registries metadata first (from fetch:annotations)
  if (registriesMetadata.registries && registriesMetadata.registries[normalizedNs]) {
    const metadata = registriesMetadata.registries[normalizedNs];
    return {
      name: normalizedNs,
      baseUrl: metadata.url || metadata.indexUrl?.replace('/index.json', '') || DEFAULT_REGISTRY_URL,
    };
  }
  
  // Check configured registries in components.json
  try {
    const config = loadComponentsJson();
    
    if (config.registries && config.registries[normalizedNs]) {
      const registryUrl = config.registries[normalizedNs];
      // Extract base URL (remove {name}.json part)
      const baseUrl = typeof registryUrl === 'string' 
        ? registryUrl.replace('/{name}.json', '').replace('{name}.json', '').replace('/{name}', '').replace('{name}', '')
        : registryUrl.url?.replace('/{name}.json', '').replace('{name}.json', '').replace('/{name}', '').replace('{name}', '');
      
      return {
        name: normalizedNs,
        baseUrl,
      };
    }
  } catch {
    // Ignore errors
  }
  
  console.log(`\n⚠️  Registry "${namespace}" not found in annotations or components.json`);
  console.log('   Using default shadcn registry.\n');
  
  return {
    name: '@shadcn',
    baseUrl: DEFAULT_REGISTRY_URL,
  };
}

/**
 * Get components from local annotations
 * @param {string} registryName - Registry namespace (e.g., "@8bitcn")
 * @returns {Array|null} Array of component objects or null if not found
 */
function getComponentsFromAnnotations(registryName) {
  const registryData = getRegistryAnnotations(registryName);
  
  if (!registryData || Object.keys(registryData).length === 0) {
    return null;
  }
  
  // Map annotation types to shadcn types
  const typeMap = {
    'component': 'ui',
    'block': 'block',
    'hook': 'hook',
    'lib': 'lib',
    'style': 'style',
  };
  
  // Convert map to array format compatible with the rest of the script
  return Object.entries(registryData).map(([name, info]) => {
    const annotationType = info.type || 'component';
    const shadcnType = typeMap[annotationType] || annotationType;
    return {
      name,
      type: `registry:${shadcnType}`,
      displayName: info.name || name,
      description: info.description || '',
    };
  });
}

/**
 * Fetch component index from registry (with local annotations fallback)
 * @param {string} baseUrl - Registry base URL
 * @param {string} registryName - Registry namespace for annotations lookup
 * @returns {Promise<Array>} Array of component objects
 */
async function fetchComponentIndex(baseUrl, registryName = null) {
  // First try local annotations
  if (registryName) {
    const localComponents = getComponentsFromAnnotations(registryName);
    if (localComponents && localComponents.length > 0) {
      console.log(`   (Using local annotations - ${localComponents.length} items)`);
      return localComponents;
    }
  }
  
  // Fetch from network
  const indexUrl = `${baseUrl}/index.json`;
  
  try {
    const response = await fetch(indexUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    
    // Handle different registry formats:
    // - Direct array: shadcn format
    // - Object with items array: aceternity/other format
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.items)) {
      return data.items;
    } else if (data && typeof data === 'object') {
      // Try to extract components from object values
      return Object.values(data).filter(item => 
        item && typeof item === 'object' && item.name
      );
    }
    return [];
  } catch (error) {
    throw new Error(`Failed to fetch components from ${indexUrl}: ${error.message}`);
  }
}

/**
 * Group components by type
 * @param {Array} components - Array of component objects
 * @returns {Object} Components grouped by type
 */
function groupByType(components) {
  const groups = {};
  
  for (const component of components) {
    const type = component.type || 'unknown';
    // Normalize type (e.g., "registry:ui" -> "ui")
    const normalizedType = type.replace('registry:', '');
    
    if (!groups[normalizedType]) {
      groups[normalizedType] = [];
    }
    groups[normalizedType].push(component);
  }
  
  return groups;
}

/**
 * Filter components by type
 * @param {Array} components - Array of component objects
 * @param {string} type - Type to filter by
 * @returns {Array} Filtered components
 */
function filterByType(components, type) {
  const normalizedType = type.replace('registry:', '');
  return components.filter(c => {
    const componentType = (c.type || '').replace('registry:', '');
    return componentType.toLowerCase() === normalizedType.toLowerCase();
  });
}

/**
 * Search components by name
 * @param {Array} components - Array of component objects
 * @param {string} query - Search query
 * @returns {Array} Matching components
 */
function searchComponents(components, query) {
  const lowerQuery = query.toLowerCase();
  return components.filter(c => 
    c.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Format component for display
 * @param {Object} component - Component object
 * @param {number} maxNameLength - Max length for name column
 * @param {string} registry - Optional registry name for descriptions
 * @returns {string} Formatted string
 */
function formatComponent(component, maxNameLength = 20, registry = null) {
  const name = component.name.padEnd(maxNameLength);
  // Use description from component object first, then try lookup
  const description = component.description || getComponentDescription(component.name, registry);
  const deps = component.dependencies?.length || 0;
  
  if (description) {
    return `  ${name}  ${description}`;
  } else if (deps > 0) {
    return `  ${name}  (${deps} dependencies)`;
  }
  return `  ${name}`;
}

/**
 * Print components in console format
 * @param {Array} components - Array of component objects
 * @param {Object} options - Display options
 */
function printComponents(components, options = {}) {
  const { registry = 'shadcn', type, search } = options;
  
  console.log(`\n📦 Components from ${registry}:\n`);
  
  if (components.length === 0) {
    console.log('   No components found.\n');
    return;
  }
  
  // Get max name length for formatting
  const maxNameLength = Math.max(...components.map(c => c.name.length), 15);
  
  if (type) {
    // Single type - flat list
    console.log(`   Type: ${type}\n`);
    for (const component of components) {
      console.log(formatComponent(component, maxNameLength, registry));
    }
    console.log(`\n   Total: ${components.length} components\n`);
  } else {
    // Group by type
    const grouped = groupByType(components);
    const typeOrder = ['ui', 'hook', 'block', 'lib', 'style', 'unknown'];
    
    for (const groupType of typeOrder) {
      if (grouped[groupType] && grouped[groupType].length > 0) {
        const typeLabel = groupType.charAt(0).toUpperCase() + groupType.slice(1);
        const groupMaxLen = Math.max(...grouped[groupType].map(c => c.name.length), 15);
        
        console.log(`   ${typeLabel} Components (${grouped[groupType].length})`);
        console.log(`   ${'─'.repeat(40)}`);
        
        for (const component of grouped[groupType].sort((a, b) => a.name.localeCompare(b.name))) {
          console.log(formatComponent(component, groupMaxLen, registry));
        }
        console.log('');
      }
    }
    
    console.log(`   Total: ${components.length} components\n`);
  }
  
  if (search) {
    console.log(`   (Filtered by search: "${search}")\n`);
  }
  
  console.log('💡 To add a component:');
  console.log(`   npx shadcn@latest add ${registry === 'shadcn' ? '' : registry + '/'}button`);
  console.log('');
}

/**
 * Output components as JSON
 * @param {Array} components - Array of component objects
 * @param {Object} options - Options
 */
function outputJson(components, options = {}) {
  const { registry = 'shadcn' } = options;
  
  const output = {
    registry,
    total: components.length,
    components: components.map(c => ({
      name: c.name,
      type: c.type?.replace('registry:', '') || 'unknown',
      displayName: c.displayName || getComponentDisplayName(c.name, registry),
      description: c.description || getComponentDescription(c.name, registry) || null,
      dependencies: c.dependencies || [],
      registryDependencies: c.registryDependencies || [],
    })),
  };
  
  console.log(JSON.stringify(output, null, 2));
}

/**
 * Print usage help
 */
function printUsage() {
  console.log(`
Usage: npm run list:registry [options]

Options:
  --registry=<name>   Registry to list (default: shadcn)
                      Use @ prefix or registry name (e.g., @magicui or magicui)
  --type=<type>       Filter by type (ui, hook, block, lib)
  --search=<query>    Search components by name
  --json              Output as JSON
  --help, -h          Show this help message

Examples:
  # List all shadcn components
  npm run list:registry

  # List components from a specific registry
  npm run list:registry -- --registry=@magicui

  # Filter by type
  npm run list:registry -- --type=ui
  npm run list:registry -- --type=hook

  # Search components
  npm run list:registry -- --search=button

  # Combine filters
  npm run list:registry -- --registry=@magicui --type=ui --search=marquee

  # Output as JSON
  npm run list:registry -- --json
`);
}

/**
 * Main function
 */
async function main() {
  const args = parseArgs();
  
  // Show help
  if (args.help || args.h) {
    printUsage();
    process.exit(0);
  }
  
  try {
    // Get registry info
    const registryInfo = getRegistryInfo(args.registry);
    
    console.log(`\n🔍 Fetching components from ${registryInfo.name}...`);
    
    // Fetch components (tries local annotations first, then network)
    let components = await fetchComponentIndex(registryInfo.baseUrl, registryInfo.name);
    
    // Apply type filter
    if (args.type) {
      components = filterByType(components, args.type);
    }
    
    // Apply search filter
    if (args.search) {
      components = searchComponents(components, args.search);
    }
    
    // Output
    if (args.json) {
      outputJson(components, { registry: registryInfo.name });
    } else {
      printComponents(components, {
        registry: registryInfo.name,
        type: args.type,
        search: args.search,
      });
    }
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  }
}

// Run
main();
