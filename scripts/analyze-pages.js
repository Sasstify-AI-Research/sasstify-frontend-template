#!/usr/bin/env node

/**
 * Analyze Pages Script
 * Analyzes pages in src/pages/
 */

import { fileURLToPath } from 'url';
import {
  colorize,
  isProtectedDependency,
  buildPageUsageMap,
  getGroupName,
  isBlockComponent,
} from './analyze-utils.js';

// --- Print Functions ---

/**
 * Pretty print page analysis
 */
function printPageUsageMap(pageUsageMap) {
  console.log('\n' + colorize('═'.repeat(80), 'cyan'));
  console.log(colorize('📄 PAGE ANALYSIS', 'cyan'));
  console.log(colorize('═'.repeat(80), 'cyan') + '\n');

  const pages = Array.from(pageUsageMap.entries());
  
  if (pages.length === 0) {
    console.log(colorize('  No pages found', 'gray'));
    return;
  }

  pages.forEach(([pageName, pageData], index) => {
    const isProtected = pageName === 'index';
    const pageLabel = isProtected ? ` ${colorize('(protected)', 'yellow')}` : '';
    
    console.log(colorize(`${index + 1}. Page: ${pageName}`, 'blue') + pageLabel);
    console.log(colorize('   ─'.repeat(40), 'gray'));
    
    // Dependencies
    console.log(`   ${colorize('Dependencies:', 'yellow')} (${pageData.dependencies.length})`);
    if (pageData.dependencies.length > 0) {
      pageData.dependencies.forEach(dep => {
        const depIsProtected = isProtectedDependency(dep);
        const label = depIsProtected ? ` ${colorize('(protected)', 'yellow')}` : '';
        console.log(`      • ${dep}${label}`);
      });
    } else {
      console.log(`      ${colorize('None', 'gray')}`);
    }
    
    // Separate blocks, regular components, and UI components
    const groupedBlocks = new Set();
    const groupedComponents = new Set();
    const groupedUiComponents = new Set();
    
    if (pageData.components.length > 0) {
      pageData.components.forEach(comp => {
        const groupName = getGroupName(comp);
        if (isBlockComponent(groupName)) {
          groupedBlocks.add(groupName);
        } else if (groupName.startsWith('ui/')) {
          groupedUiComponents.add(groupName);
        } else {
          groupedComponents.add(groupName);
        }
      });
    }

    // Blocks
    console.log(`\n   ${colorize('Blocks:', 'cyan')} (${groupedBlocks.size})`);
    if (groupedBlocks.size > 0) {
      Array.from(groupedBlocks).sort().forEach(comp => {
        console.log(`      • ${comp}`);
      });
    } else {
      console.log(`      ${colorize('None', 'gray')}`);
    }
    
    // Components
    console.log(`\n   ${colorize('Components:', 'green')} (${groupedComponents.size})`);
    if (groupedComponents.size > 0) {
      Array.from(groupedComponents).sort().forEach(comp => {
        console.log(`      • ${comp}`);
      });
    } else {
      console.log(`      ${colorize('None', 'gray')}`);
    }
    
    // UI Components
    console.log(`\n   ${colorize('UI Components:', 'magenta')} (${groupedUiComponents.size})`);
    if (groupedUiComponents.size > 0) {
      Array.from(groupedUiComponents).sort().forEach(comp => {
        console.log(`      • ${comp}`);
      });
    } else {
      console.log(`      ${colorize('None', 'gray')}`);
    }
    
    console.log('');
  });

  console.log(colorize('─'.repeat(80), 'gray'));
  console.log(colorize(`Total Pages: ${pages.length}`, 'cyan'));
  console.log(colorize('═'.repeat(80), 'cyan') + '\n');
}

// --- JSON Export Functions ---

/**
 * Generate JSON report for pages
 */
function generatePagesJson(pageUsageMap) {
  const pages = Array.from(pageUsageMap.entries());
  
  const pagesData = pages.map(([pageName, pageData]) => {
    const groupedBlocks = new Set();
    const groupedComponents = new Set();
    const groupedUiComponents = new Set();
    
    pageData.components.forEach(comp => {
      const groupName = getGroupName(comp);
      if (isBlockComponent(groupName)) {
        groupedBlocks.add(groupName);
      } else if (groupName.startsWith('ui/')) {
        groupedUiComponents.add(groupName);
      } else {
        groupedComponents.add(groupName);
      }
    });

    return {
      name: pageName,
      isProtected: pageName === 'index',
      dependencies: pageData.dependencies.sort(),
      blocks: Array.from(groupedBlocks).sort(),
      components: Array.from(groupedComponents).sort(),
      uiComponents: Array.from(groupedUiComponents).sort(),
    };
  });

  return {
    generated: new Date().toISOString(),
    summary: {
      totalPages: pages.length,
      protectedPages: pages.filter(([name]) => name === 'index').length,
    },
    pages: pagesData,
  };
}

// --- CLI ---

function showHelp() {
  console.log(`
${colorize('📄 Analyze Pages', 'cyan')}

${colorize('Usage:', 'bright')}
  npm run analyze:pages [options]

${colorize('Options:', 'bright')}
  --json      Output results as JSON to console
  --help      Show this help message

${colorize('Examples:', 'bright')}
  npm run analyze:pages              # Show page analysis
  npm run analyze:pages -- --json    # Output as JSON

${colorize('What it does:', 'bright')}
  • Lists all pages in src/pages/
  • Shows NPM dependencies used by each page
  • Shows shared components used by each page
  • Shows UI components used by each page
  • Shows blocks used by each page
  • Identifies protected pages (index)
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
    const pageUsageMap = buildPageUsageMap();
    
    if (outputJson) {
      const jsonOutput = generatePagesJson(pageUsageMap);
      console.log(JSON.stringify(jsonOutput, null, 2));
    } else {
      console.log('\n🔍 Analyzing Pages...\n');
      printPageUsageMap(pageUsageMap);
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


