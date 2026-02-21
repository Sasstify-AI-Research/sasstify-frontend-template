#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  colorize,
  isProtectedDependency,
  extractImports,
  scanDirectoryForImports,
  buildPageUsageMap,
  buildComponentMap,
  getComponentFilePath,
  getGroupName,
  isBlockComponent,
} from './analyze-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---

// Dev dependencies are always excluded from "unused" check
const DEV_DEPENDENCY_PATTERNS = [
  /^@types\//,
  /^eslint/,
  /^@eslint/,
  /^typescript/,
  /^vite/,
  /^@vitejs/,
  /^vitest/,
  /^@vitest/,
  /^@testing-library/,
  /^@playwright/,
  /^postcss/,
  /^autoprefixer/,
  /^tailwindcss/,
  /^@tailwindcss/,
  /^terser/,
  /^rollup/,
  /^jsdom/,
  /^globals/,
];

function isDevDependencyPattern(depName) {
  return DEV_DEPENDENCY_PATTERNS.some(pattern => pattern.test(depName));
}

// --- Core Functions ---

/**
 * Load package.json and return dependencies info
 */
function loadPackageJson() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return { dependencies: {}, devDependencies: {} };
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return {
    dependencies: packageJson.dependencies || {},
    devDependencies: packageJson.devDependencies || {},
  };
}

/**
 * Scan entire src directory for all npm imports
 */
function scanAllImports() {
  const srcDir = path.join(process.cwd(), 'src');
  const allImports = new Set();
  
  if (!fs.existsSync(srcDir)) return allImports;
  
  function scanDir(dirPath) {
    const items = fs.readdirSync(dirPath);
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
          const imports = extractImports(fullPath);
          imports.forEach(imp => allImports.add(imp));
        }
      }
    });
  }
  
  scanDir(srcDir);
  return allImports;
}

/**
 * Build a map of which dependencies are used where
 */
function buildDependencyUsageMap(pageUsageMap, componentMap) {
  const depUsageMap = new Map();
  
  // Track usage in pages
  for (const [pageName, pageData] of pageUsageMap.entries()) {
    pageData.dependencies.forEach(dep => {
      if (!depUsageMap.has(dep)) {
        depUsageMap.set(dep, { 
          pages: new Set(), 
          blocks: new Set(),
          components: new Set(),
          uiComponents: new Set()
        });
      }
      depUsageMap.get(dep).pages.add(pageName);
    });
  }
  
  // Track usage in components
  for (const [componentPath, fullPath] of componentMap.entries()) {
    const deps = extractImports(fullPath);
    deps.forEach(dep => {
      if (!depUsageMap.has(dep)) {
        depUsageMap.set(dep, { 
          pages: new Set(), 
          blocks: new Set(),
          components: new Set(),
          uiComponents: new Set()
        });
      }
      // Get component group name (handles blocks, ui, and regular components)
      const groupName = getGroupName(componentPath);
      
      // Categorize by component type
      if (isBlockComponent(groupName)) {
        depUsageMap.get(dep).blocks.add(groupName);
      } else if (groupName.startsWith('ui/')) {
        depUsageMap.get(dep).uiComponents.add(groupName);
      } else {
        depUsageMap.get(dep).components.add(groupName);
      }
    });
  }
  
  return depUsageMap;
}

/**
 * Analyze npm dependencies
 */
function analyzeNpmDependencies() {
  const { dependencies, devDependencies } = loadPackageJson();
  const allDeps = Object.keys(dependencies);
  const allDevDeps = Object.keys(devDependencies);
  
  // Scan all imports in src
  const usedImports = scanAllImports();
  
  // Build usage map
  const pageUsageMap = buildPageUsageMap();
  const componentMap = buildComponentMap();
  const depUsageMap = buildDependencyUsageMap(pageUsageMap, componentMap);
  
  // Categorize dependencies
  const used = [];
  const unused = [];
  const protectedDeps = [];
  
  allDeps.forEach(dep => {
    const isUsed = usedImports.has(dep);
    const isProtected = isProtectedDependency(dep);
    const usage = depUsageMap.get(dep) || { 
      pages: new Set(), 
      blocks: new Set(),
      components: new Set(),
      uiComponents: new Set()
    };
    
    const depInfo = {
      name: dep,
      version: dependencies[dep],
      protected: isProtected,
      usedInPages: Array.from(usage.pages).sort(),
      usedInBlocks: Array.from(usage.blocks).sort(),
      usedInComponents: Array.from(usage.components).sort(),
      usedInUIComponents: Array.from(usage.uiComponents).sort(),
    };
    
    if (isProtected) {
      protectedDeps.push(depInfo);
    }
    
    if (isUsed) {
      used.push(depInfo);
    } else if (!isProtected) {
      unused.push(depInfo);
    }
  });
  
  return {
    summary: {
      dependencies: allDeps.length,
      devDependencies: allDevDeps.length,
      total: allDeps.length + allDevDeps.length,
      used: used.length,
      unused: unused.length,
      protected: protectedDeps.length,
    },
    dependencies: allDeps,
    devDependencies: allDevDeps,
    used,
    unused,
    protected: protectedDeps,
  };
}

// --- Print Functions ---

function printDependencyAnalysis(analysis) {
  console.log('\n' + colorize('═'.repeat(70), 'cyan'));
  console.log(colorize('📦 NPM DEPENDENCY ANALYSIS', 'cyan'));
  console.log(colorize('═'.repeat(70), 'cyan') + '\n');
  
  // Summary
  const { summary } = analysis;
  console.log(colorize('Summary:', 'bright'));
  console.log(`  Dependencies: ${colorize(summary.dependencies.toString(), 'green')} | DevDependencies: ${colorize(summary.devDependencies.toString(), 'blue')} | Total: ${colorize(summary.total.toString(), 'cyan')}`);
  console.log('');
  
  // Used Dependencies
  console.log(colorize(`USED DEPENDENCIES (${analysis.used.length}):`, 'green'));
  if (analysis.used.length === 0) {
    console.log(colorize('  None', 'gray'));
  } else {
    analysis.used.sort((a, b) => a.name.localeCompare(b.name)).forEach((dep, index) => {
      const protectedLabel = dep.protected ? ` ${colorize('(protected)', 'yellow')}` : '';
      console.log(`  ${index + 1}. ${colorize(dep.name, 'bright')}${protectedLabel}`);
      console.log(colorize('     ─'.repeat(30), 'gray'));
      
      // Check if dependency has any usage
      const hasUsage = dep.usedInPages.length > 0 || dep.usedInBlocks.length > 0 || 
                       dep.usedInComponents.length > 0 || dep.usedInUIComponents.length > 0;
      
      if (hasUsage) {
        console.log(`     ${colorize('Used by:', 'bright')}`);
        
        // Pages
        console.log(`        ${colorize('Pages:', 'yellow')} (${dep.usedInPages.length})`);
        if (dep.usedInPages.length > 0) {
          dep.usedInPages.forEach(page => {
            const pageIsProtected = page === 'index';
            const label = pageIsProtected ? ` ${colorize('(protected)', 'yellow')}` : '';
            console.log(`          • ${page}${label}`);
          });
        } else {
          console.log(`          ${colorize('None', 'gray')}`);
        }
        
        // Blocks
        console.log(`\n        ${colorize('Blocks:', 'cyan')} (${dep.usedInBlocks.length})`);
        if (dep.usedInBlocks.length > 0) {
          dep.usedInBlocks.forEach(block => {
            console.log(`          • ${block}`);
          });
        } else {
          console.log(`          ${colorize('None', 'gray')}`);
        }
        
        // Components
        console.log(`\n        ${colorize('Components:', 'green')} (${dep.usedInComponents.length})`);
        if (dep.usedInComponents.length > 0) {
          dep.usedInComponents.forEach(comp => {
            console.log(`          • ${comp}`);
          });
        } else {
          console.log(`          ${colorize('None', 'gray')}`);
        }
        
        // UI Components
        console.log(`\n        ${colorize('UI Components:', 'magenta')} (${dep.usedInUIComponents.length})`);
        if (dep.usedInUIComponents.length > 0) {
          dep.usedInUIComponents.forEach(uiComp => {
            console.log(`          • ${uiComp}`);
          });
        } else {
          console.log(`          ${colorize('None', 'gray')}`);
        }
      } else {
        console.log(`     ${colorize('Used by:', 'bright')} ${colorize('None', 'gray')}`);
      }
      
      console.log('');
    });
  }
  console.log('');
  
  // Unused Dependencies
  console.log(colorize(`UNUSED DEPENDENCIES (${analysis.unused.length}):`, analysis.unused.length > 0 ? 'yellow' : 'green'));
  if (analysis.unused.length === 0) {
    console.log(colorize('  ✅ No unused dependencies found!', 'green'));
  } else {
    analysis.unused.sort((a, b) => a.name.localeCompare(b.name)).forEach(dep => {
      console.log(`  ${colorize('⚠️', 'yellow')}  ${colorize(dep.name, 'yellow')} - Not imported anywhere`);
    });
    console.log('');
    console.log(colorize('  💡 Tip: Run the following to remove unused dependencies:', 'gray'));
    console.log(colorize(`     npm uninstall ${analysis.unused.map(d => d.name).join(' ')}`, 'gray'));
  }
  console.log('');
  
  // Dev Dependencies note
  console.log(colorize('DEV DEPENDENCIES (excluded from unused check):', 'blue'));
  console.log(colorize('  Build tools, testing, linting, and type definitions are not checked.', 'gray'));
  console.log(colorize('  Examples: vite, typescript, eslint, vitest, @types/*, etc.', 'gray'));
  console.log('');
  
  // Protected Dependencies
  console.log(colorize(`PROTECTED DEPENDENCIES (${analysis.protected.length}):`, 'magenta'));
  console.log(colorize('  Core dependencies that should never be removed:', 'gray'));
  analysis.protected.sort((a, b) => a.name.localeCompare(b.name)).forEach(dep => {
    console.log(`  • ${dep.name}`);
  });
  
  console.log('\n' + colorize('═'.repeat(70), 'cyan') + '\n');
}

/**
 * Generate JSON output
 */
function generateJsonOutput(analysis) {
  return {
    generated: new Date().toISOString(),
    summary: analysis.summary,
    used: analysis.used.map(d => ({
      name: d.name,
      version: d.version,
      protected: d.protected,
      pages: d.usedInPages,
      blocks: d.usedInBlocks,
      components: d.usedInComponents,
      uiComponents: d.usedInUIComponents,
    })),
    unused: analysis.unused.map(d => d.name),
    protected: analysis.protected.map(d => d.name),
  };
}

// --- CLI ---

function showHelp() {
  console.log(`
${colorize('📦 Analyze NPM Dependencies', 'cyan')}

${colorize('Usage:', 'bright')}
  npm run analyze:deps [options]

${colorize('Options:', 'bright')}
  --json      Output results as JSON to console
  --help      Show this help message

${colorize('Examples:', 'bright')}
  npm run analyze:deps              # Show dependency analysis
  npm run analyze:deps -- --json    # Output as JSON

${colorize('What it does:', 'bright')}
  • Lists all npm dependencies from package.json
  • Shows which pages/components use each dependency
  • Identifies unused dependencies (installed but not imported)
  • Identifies protected dependencies (core deps that shouldn't be removed)
  • Dev dependencies are excluded from the unused check
`);
}

// --- Main ---

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }
  
  const outputJson = args.includes('--json');
  
  try {
    const analysis = analyzeNpmDependencies();
    
    if (outputJson) {
      // Output JSON to console only
      const jsonOutput = generateJsonOutput(analysis);
      console.log(JSON.stringify(jsonOutput, null, 2));
    } else {
      // Print formatted console output
      console.log('\n🔍 Analyzing NPM Dependencies...\n');
      printDependencyAnalysis(analysis);
      console.log(`${colorize('✅ Analysis Complete!', 'green')}\n`);
    }
    
  } catch (error) {
    console.error(`\n${colorize('❌ Error during analysis:', 'red')} ${error.message}`);
    process.exit(1);
  }
}

// Check if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

