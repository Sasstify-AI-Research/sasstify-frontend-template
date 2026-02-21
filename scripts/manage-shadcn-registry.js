#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  parseArgs,
  hasArgs,
  createPrompt,
  question,
  toKebabCase,
  validateKebabCase
} from './utils/cli.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to components.json
const COMPONENTS_JSON_PATH = path.join(process.cwd(), 'components.json');

// Shadcn registry index URL
const SHADCN_REGISTRY_INDEX_URL = 'https://ui.shadcn.com/r/registries.json';

/**
 * Registry descriptions sourced from https://ui.shadcn.com/docs/directory
 * These are hardcoded as the API doesn't provide descriptions
 */
const REGISTRY_DESCRIPTIONS = {
  '@8bitcn': 'A set of 8-bit styled retro components. Works with your favorite frameworks. Open Source. Open Code.',
  '@97cn': 'UI components registry.',
  '@aceternity': 'A modern component library built with Tailwind CSS and Motion for React. Unique and interactive components for stunning landing pages.',
  '@aevr': 'A small collection of focused, production-ready components and primitives for React/Next.js projects—built on shadcn/ui.',
  '@ai-elements': 'Pre-built components like conversations, messages and more to help you build AI-native applications faster.',
  '@algolia': 'Enterprises and developers use Algolia\'s AI search infrastructure to understand users and show them what they\'re looking for.',
  '@aliimam': 'Digital experiences that connect and inspire. Apps, websites, brands, and products end-to-end.',
  '@animate-ui': 'A fully animated, open-source React component distribution. Animated primitives, components and icons.',
  '@assistant-ui': 'Radix-style React primitives for AI chat with adapters for AI SDK, LangGraph, Mastra, and custom backends.',
  '@better-upload': 'Simple and easy file uploads for React. Upload directly to any S3-compatible service with minimal setup.',
  '@basecn': 'Beautifully crafted shadcn/ui components powered by Base UI.',
  '@billingsdk': 'Open-source React and Next.js component library for SaaS billing and payments.',
  '@blocks': 'A set of clean, modern application building blocks. Free and Open Source.',
  '@clerk': 'The easiest way to add authentication and user management to your application. Purpose-built for React, Next.js, Remix.',
  '@coss': 'A new, modern UI component library built on top of Base UI. Built for developers and AI.',
  '@creative-tim': 'A collection of open-source UI components, blocks and AI Agents for v0, Lovable, Claude or your application.',
  '@cult-ui': 'A rare, curated set of shadcn-compatible, headless and composable components—tastefully animated with Framer Motion.',
  '@diceui': 'Accessible shadcn/ui components built with React, TypeScript, and Tailwind CSS. Copy-paste ready and customizable.',
  '@elements': 'Full-stack shadcn/ui components that go beyond UI. Add auth, monetization, uploads, and AI to your app in seconds.',
  '@elevenlabs-ui': 'A collection of Open Source agent and audio components that you can customize and extend.',
  '@efferd': 'A collection of beautifully crafted Shadcn/UI blocks for building modern websites with ease.',
  '@eldoraui': 'An open-source, modern UI component library for React with TypeScript, Tailwind CSS, and Framer Motion.',
  '@formcn': 'Build production-ready forms with a few clicks using shadcn components and modern tools.',
  '@gaia': 'Production-ready UI components designed for building beautiful AI assistants and conversational interfaces.',
  '@glass-ui': 'A shadcn-ui compatible registry distributing 40+ glassmorphic React/TypeScript components with Apple-inspired design.',
  '@ha-components': 'A collection of customisable components to build Home Assistant dashboards.',
  '@hextaui': 'Ready-to-use foundation components/blocks built on top of shadcn/ui.',
  '@hooks': 'A comprehensive React Hooks Collection built with Shadcn.',
  '@intentui': 'Accessible React component library to copy, customize, and own your UI.',
  '@kibo-ui': 'Composable, accessible and open source components designed for use with shadcn/ui.',
  '@kanpeki': 'A set of perfect-designed components built on top of React Aria and Motion.',
  '@kokonutui': 'Collection of stunning components built with Tailwind CSS, shadcn/ui and Motion.',
  '@lens-blocks': 'A collection of social media components for use with Lens Social Protocol.',
  '@limeplay': 'Modern UI Library for building media players in React. Powered by Shaka Player.',
  '@lytenyte': 'LyteNyte Grid is a high performance, light weight, headless, React data grid themed with Tailwind and Shadcn.',
  '@magicui': 'UI Library for Design Engineers. 150+ free and open-source animated components built with React, Typescript, Tailwind CSS, and Motion.',
  '@mui-treasury': 'A collection of hand-crafted interfaces built on top of MUI components.',
  '@moleculeui': 'A modern React component library focused on intuitive interactions and seamless user experiences.',
  '@motion-primitives': 'Beautifully designed motion components. Easy copy-paste. Customizable. Open Source. Built for engineers and designers.',
  '@ncdai': 'A collection of reusable components.',
  '@nuqs': 'Custom parsers, adapters and utilities for type-safe URL state management.',
  '@nexus-elements': 'Ready-made React components for almost any use case. Use as is or customise and go to market fast.',
  '@oui': 'React Aria Components with shadcn characteristics. Copy-and-paste react aria components that run side-by-side with shadcn.',
  '@paceui': 'Animated components and building blocks built for smooth interaction and rich detail.',
  '@paykit-sdk': 'Unified payments SDK for builders—handle checkout, billing, and webhooks across Stripe, PayPal, Adyen, and regional gateways.',
  '@plate': 'AI-powered rich text editor for React.',
  '@prompt-kit': 'Core building blocks for AI apps. High-quality, accessible, and customizable components for AI interfaces.',
  '@prosekit': 'Powerful and flexible rich text editor for React, Vue, Preact, Svelte, and SolidJS.',
  '@phucbm': 'A collection of modern React UI components with GSAP animations.',
  '@react-bits': 'A large collection of animated, interactive & fully customizable React components for building memorable websites.',
  '@retroui': 'A Neobrutalism styled React + TailwindCSS UI library for building bold, modern web apps.',
  '@reui': 'Open-source collection of UI components and animated effects built with React, Typescript, Tailwind CSS, and Motion.',
  '@scrollxui': 'ScrollX UI is an open-source React and shadcn-compatible component library for animated, interactive UIs.',
  '@square-ui': 'Collection of beautifully crafted open-source layouts UI built with shadcn/ui.',
  '@systaliko-ui': 'UI component library designed for flexibility, built for customization, and crafted to scale.',
  '@roiui': 'UI components and blocks built with Base UI primitives. Some blocks use motion (framer). Open-source forever.',
  '@solaceui': 'Production-ready and tastefully crafted sections, animated components, and full-page templates for Next.js.',
  '@shadcnblocks': 'A registry with hundreds of extra blocks for shadcn ui.',
  '@shadcndesign': 'A growing collection of high-quality blocks and themes for shadcn/ui.',
  '@shadcn-map': 'A map component for shadcn/ui. Built with Leaflet and React Leaflet.',
  '@shadcn-studio': 'An open-source set of shadcn/ui components, blocks, and templates with a powerful theme generator.',
  '@shadcn-editor': 'Accessible, Customizable, Rich Text Editor. Made with Lexical and Shadcn/UI. Open Source.',
  '@shadcnui-blocks': 'A collection of premium, production-ready shadcn/ui blocks, components and templates.',
  '@shadcraft': 'Polished shadcn/ui components and marketing blocks built to production standards.',
  '@smoothui': 'Beautifully crafted motion components built with React, Framer Motion, and TailwindCSS.',
  '@spectrumui': 'A modern component library built with shadcn/ui and Tailwind CSS with elegant, responsive components.',
  '@supabase': 'React components and blocks built on shadcn/ui that connect your front-end to Supabase back-end.',
  '@svgl': 'A beautiful library with SVG logos.',
  '@tailark': 'Shadcn blocks designed for building modern marketing websites.',
  '@taki': 'Beautifully designed, accessible components. Made with React Aria Components and Shadcn tokens.',
  '@uitripled': 'Open-source, production-ready UI components and blocks powered by shadcn/ui and Framer Motion.',
  '@utilcn': 'Fullstack registry items for big features. ChatGPT Apps, file uploading with progress bars, and typesafe env vars.',
  '@wandry-ui': 'A set of open source fully controlled React Inertia form elements.',
  '@wigggle-ui': 'A beautiful collection of copy-and-paste widgets for your next project.',
  '@zippystarter': 'Expertly crafted blocks, components & themes for shadcn/ui.',
  '@uicapsule': 'A curated collection of components that spark joy. Interactive concepts, design experiments, and AI/UI components.',
  '@ui-layouts': 'UI Layouts offers components, effects, design tools, and ready-made blocks for modern interfaces.',
};

/**
 * Get description for a registry namespace
 * @param {string} namespace - Registry namespace (e.g., "@magicui")
 * @returns {string} Description or default message
 */
function getRegistryDescription(namespace) {
  return REGISTRY_DESCRIPTIONS[namespace] || '(No description available)';
}

/**
 * Fetch available registries from shadcn website
 * @returns {Promise<Array>} Array of registry objects
 */
async function fetchRegistriesFromShadcn() {
  try {
    const response = await fetch(SHADCN_REGISTRY_INDEX_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`\n⚠️  Could not fetch registries from shadcn: ${error.message}`);
    console.log('   Showing fallback list...\n');
    return null;
  }
}

/**
 * Get fallback registries (used when network fails)
 * @returns {Array} Array of fallback registry objects
 */
function getFallbackRegistries() {
  return [
    {
      name: 'shadcn',
      url: 'https://ui.shadcn.com',
    },
    {
      name: 'magicui',
      url: 'https://magicui.design',
    },
    {
      name: 'aceternity',
      url: 'https://ui.aceternity.com',
    },
    {
      name: 'origin',
      url: 'https://originui.com',
    }
  ];
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
 * Save components.json file
 * @param {Object} config - Configuration to save
 */
function saveComponentsJson(config) {
  fs.writeFileSync(COMPONENTS_JSON_PATH, JSON.stringify(config, null, 2) + '\n');
}

/**
 * Validate registry URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
function validateRegistryUrl(url) {
  try {
    // Check if URL contains {name} placeholder
    if (!url.includes('{name}')) {
      return false;
    }
    // Basic URL validation (replace {name} with test for URL parsing)
    const testUrl = url.replace('{name}', 'test');
    new URL(testUrl);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate namespace format (must start with @)
 * @param {string} namespace - Namespace to validate
 * @returns {boolean} True if valid
 */
function validateNamespace(namespace) {
  return namespace && namespace.startsWith('@') && namespace.length > 1;
}

/**
 * Get URL from registry entry (handles both string and object formats)
 * @param {string|Object} registry - Registry entry (URL string or {url: "..."})
 * @returns {string} URL string
 */
function getRegistryUrl(registry) {
  if (typeof registry === 'string') {
    return registry;
  }
  return registry?.url || 'undefined';
}

/**
 * Add a registry entry to components.json
 * @param {string} namespace - Registry namespace (must start with @, e.g., "@magicui")
 * @param {string} url - Registry URL pattern (required)
 * @returns {boolean} True if added successfully
 */
function addRegistry(namespace, url) {
  const config = loadComponentsJson();
  
  // Validate namespace starts with @
  if (!validateNamespace(namespace)) {
    console.log(`\n❌ Invalid namespace "${namespace}".`);
    console.log('   Namespace must start with @ (e.g., @magicui, @myteam)');
    return false;
  }
  
  // Initialize registries if not exists
  if (!config.registries) {
    config.registries = {};
  }
  
  // Check if registry already exists
  if (config.registries[namespace]) {
    console.log(`\n⚠️  Registry "${namespace}" already exists.`);
    console.log(`   Registry URL: ${getRegistryUrl(config.registries[namespace])}`);
    return false;
  }
  
  // Add registry (store as string to match shadcn format)
  config.registries[namespace] = url;
  saveComponentsJson(config);
  
  console.log(`\n✅ Registry "${namespace}" added successfully!`);
  console.log(`   Registry URL: ${url}`);
  
  return true;
}

/**
 * Remove a registry entry from components.json
 * @param {string} namespace - Registry namespace to remove (must start with @)
 * @returns {boolean} True if removed successfully
 */
function removeRegistry(namespace) {
  const config = loadComponentsJson();
  
  // Validate namespace starts with @
  if (!validateNamespace(namespace)) {
    console.log(`\n❌ Invalid namespace "${namespace}".`);
    console.log('   Namespace must start with @ (e.g., @magicui)');
    return false;
  }
  
  if (!config.registries || !config.registries[namespace]) {
    console.log(`\n❌ Registry "${namespace}" not found.`);
    return false;
  }
  
  delete config.registries[namespace];
  
  // Remove registries object if empty
  if (Object.keys(config.registries).length === 0) {
    delete config.registries;
  }
  
  saveComponentsJson(config);
  
  console.log(`\n✅ Registry "${namespace}" removed successfully!`);
  return true;
}

/**
 * List current registries in components.json
 * @param {boolean} jsonOutput - Output as JSON
 */
function listCurrentRegistries(jsonOutput = false) {
  const config = loadComponentsJson();
  
  if (jsonOutput) {
    const registries = [];
    if (config.registries) {
      for (const [namespace, registry] of Object.entries(config.registries)) {
        registries.push({
          namespace,
          url: getRegistryUrl(registry),
          description: getRegistryDescription(namespace),
        });
      }
    }
    console.log(JSON.stringify({ registries, total: registries.length }, null, 2));
    return;
  }
  
  console.log('\n📦 Current Registries in components.json:\n');
  
  if (!config.registries || Object.keys(config.registries).length === 0) {
    console.log('   No registries configured.\n');
    return;
  }
  
  for (const [namespace, registry] of Object.entries(config.registries)) {
    const description = getRegistryDescription(namespace);
    console.log(`   ${namespace}`);
    console.log(`     URL: ${getRegistryUrl(registry)}`);
    console.log(`     ${description}`);
    console.log('');
  }
  
  console.log(`   Total: ${Object.keys(config.registries).length} registries configured\n`);
}

/**
 * List available registries from shadcn website
 * @param {boolean} jsonOutput - Output as JSON
 */
async function listAvailableRegistries(jsonOutput = false) {
  if (!jsonOutput) {
    console.log('\n📋 Available Registries from shadcn:\n');
    console.log('   Fetching from https://ui.shadcn.com/r/registries.json...\n');
  }
  
  const registries = await fetchRegistriesFromShadcn();
  
  // shadcn returns an object with namespace as key and URL as value
  if (registries && typeof registries === 'object' && !Array.isArray(registries)) {
    const entries = Object.entries(registries);
    
    if (entries.length > 0) {
      if (jsonOutput) {
        const registryList = entries.map(([namespace, url]) => ({
          namespace,
          url,
          description: getRegistryDescription(namespace),
        }));
        console.log(JSON.stringify({ registries: registryList, total: registryList.length }, null, 2));
        return;
      }
      
      // Display fetched registries with descriptions
      for (const [namespace, url] of entries) {
        const description = getRegistryDescription(namespace);
        console.log(`   ${namespace}`);
        console.log(`     URL: ${url}`);
        console.log(`     ${description}`);
        console.log('');
      }
      
      console.log(`   Total: ${entries.length} registries available\n`);
    } else {
      showFallbackList(jsonOutput);
    }
  } else {
    showFallbackList(jsonOutput);
  }
  
  if (!jsonOutput) {
    console.log('💡 To add a registry:');
    console.log('   npm run manage:registry -- --add=@magicui --url=https://magicui.design/r/{name}.json');
    console.log('');
  }
}

/**
 * Show fallback list when network unavailable
 * @param {boolean} jsonOutput - Output as JSON
 */
function showFallbackList(jsonOutput = false) {
  const fallback = getFallbackRegistries();
  
  if (jsonOutput) {
    const registryList = fallback.map(registry => ({
      namespace: `@${registry.name}`,
      url: `${registry.url}/r/{name}.json`,
      description: getRegistryDescription(`@${registry.name}`),
    }));
    console.log(JSON.stringify({ registries: registryList, total: registryList.length, fallback: true }, null, 2));
    return;
  }
  
  console.log('   (Fallback list - network unavailable)\n');
  
  for (const registry of fallback) {
    const namespace = `@${registry.name}`;
    const description = getRegistryDescription(namespace);
    console.log(`   ${namespace}`);
    console.log(`     URL: ${registry.url}/r/{name}.json`);
    console.log(`     ${description}`);
    console.log('');
  }
}

/**
 * Interactive mode - prompt user for registry management
 * @param {readline.Interface} rl - Readline interface
 */
async function interactiveMode(rl) {
  console.log('\n🔧 Manage Shadcn Registry\n');
  console.log('Select an option:\n');
  console.log('  1. Add registry');
  console.log('  2. Remove registry');
  console.log('  3. List current registries');
  console.log('  4. List available registries (from shadcn)');
  console.log('  5. Exit\n');
  
  const choice = await question(rl, '? Select option (1-5): ');
  
  switch (choice.trim()) {
    case '1': {
      // Add registry (requires @namespace and URL)
      const namespace = await question(rl, '? Enter namespace (must start with @, e.g., @magicui): ');
      
      if (!namespace.trim()) {
        console.log('\n❌ Namespace is required.');
        break;
      }
      
      if (!validateNamespace(namespace.trim())) {
        console.log('\n❌ Namespace must start with @ (e.g., @magicui, @myteam)');
        break;
      }
      
      const url = await question(rl, '? Enter URL pattern (must include {name}): ');
      
      if (!validateRegistryUrl(url.trim())) {
        console.log('\n❌ Invalid URL. Must be a valid URL containing {name} placeholder.');
        console.log('   Example: https://my-registry.com/r/{name}.json');
        break;
      }
      
      addRegistry(namespace.trim(), url.trim());
      break;
    }
    
    case '2': {
      // Remove registry
      listCurrentRegistries();
      const removeNs = await question(rl, '? Enter namespace to remove (e.g., @magicui): ');
      
      if (removeNs.trim()) {
        removeRegistry(removeNs.trim());
      }
      break;
    }
    
    case '3': {
      // List current registries
      listCurrentRegistries();
      break;
    }
    
    case '4': {
      // List available registries
      await listAvailableRegistries();
      break;
    }
    
    case '5':
    default:
      console.log('\nGoodbye! 👋\n');
      break;
  }
}

/**
 * Print usage help
 */
function printUsage() {
  console.log(`
Usage: npm run manage:registry [options]

Options:
  --add=<@namespace>    Add registry (must start with @, requires --url)
  --url=<url>           Registry URL pattern (required with --add, must contain {name})
  --remove=<@namespace> Remove registry by namespace
  --list                List available registries from shadcn website
  --current             List registries in components.json
  --json                Output as JSON (use with --list or --current)
  --help, -h            Show this help message

Examples:
  # Add a registry (both --add and --url required)
  npm run manage:registry -- --add=@magicui --url=https://magicui.design/r/{name}.json
  npm run manage:registry -- --add=@myteam --url=https://my-registry.com/r/{name}.json

  # Remove a registry
  npm run manage:registry -- --remove=@magicui

  # List available registries from shadcn
  npm run manage:registry -- --list

  # List available registries as JSON
  npm run manage:registry -- --list --json

  # List current registries
  npm run manage:registry -- --current

  # List current registries as JSON
  npm run manage:registry -- --current --json

  # Interactive mode
  npm run manage:registry

After adding a registry, use it with:
  npm run add:shadcn @magicui/marquee
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
  
  // List available registries from shadcn
  if (args.list) {
    await listAvailableRegistries(args.json);
    process.exit(0);
  }
  
  // List current registries
  if (args.current) {
    try {
      listCurrentRegistries(args.json);
    } catch (error) {
      if (!args.json) {
        console.log(`\n❌ Error: ${error.message}`);
      } else {
        console.log(JSON.stringify({ error: error.message }, null, 2));
      }
      process.exit(1);
    }
    process.exit(0);
  }
  
  // Remove registry
  if (args.remove) {
    try {
      const success = removeRegistry(args.remove);
      process.exit(success ? 0 : 1);
    } catch (error) {
      console.log(`\n❌ Error: ${error.message}`);
      process.exit(1);
    }
  }
  
  // Add registry (requires both --add and --url)
  if (args.add) {
    try {
      // URL is mandatory
      if (!args.url) {
        console.log('\n❌ URL is required when adding a registry.');
        console.log('   Usage: npm run manage:registry -- --add=@namespace --url=https://registry.com/r/{name}.json');
        process.exit(1);
      }
      
      // Validate URL format
      if (!validateRegistryUrl(args.url)) {
        console.log('\n❌ Invalid URL. Must be a valid URL containing {name} placeholder.');
        console.log('   Example: https://my-registry.com/r/{name}.json');
        process.exit(1);
      }
      
      const success = addRegistry(args.add, args.url);
      process.exit(success ? 0 : 1);
    } catch (error) {
      console.log(`\n❌ Error: ${error.message}`);
      process.exit(1);
    }
  }
  
  // Interactive mode if no args
  if (!hasArgs()) {
    const rl = createPrompt();
    try {
      await interactiveMode(rl);
    } catch (error) {
      console.log(`\n❌ Error: ${error.message}`);
    } finally {
      rl.close();
    }
    process.exit(0);
  }
  
  // If we reach here, unknown args
  printUsage();
}

// Run
main();

