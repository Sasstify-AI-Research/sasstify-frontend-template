#!/usr/bin/env node

/**
 * Analyze Blocks Script
 * Analyzes block components in src/components/blocks/
 */

import { fileURLToPath } from 'url';
import {
  colorize,
  isProtectedDependency,
  buildComponentMap,
  buildPageUsageMap,
  buildComponentUsageMap,
  isBlockComponent,
} from './analyze-utils.js';

// --- Print Functions ---

/**
 * Pretty print block analysis
 */
function printBlockMap(blockMap, pageUsageMap) {
  console.log('\n' + colorize('═'.repeat(80), 'cyan'));
  console.log(colorize('🧩 BLOCK ANALYSIS', 'cyan'));
  console.log(colorize('═'.repeat(80), 'cyan') + '\n');

  const blocks = Array.from(blockMap.entries());
  
  if (blocks.length === 0) {
    console.log(colorize('  No blocks found', 'gray'));
    return;
  }

  const componentGroups = buildComponentUsageMap(blockMap, pageUsageMap);

  // Filter to only blocks and sort alphabetically
  const blockGroups = Array.from(componentGroups.entries())
    .filter(([groupName]) => isBlockComponent(groupName))
    .sort((a, b) => a[0].localeCompare(b[0]));

  let index = 1;
  blockGroups.forEach(([groupName, data]) => {
    const blockName = groupName.replace('blocks/', '');
    
    console.log(colorize(`${index}. ${blockName}`, 'cyan'));
    console.log(`   ${colorize('Path:', 'gray')} ${data.files[0].fullPath}`);
    
    // Files
    if (data.files.length > 1) {
      console.log(`   ${colorize('Files:', 'gray')} ${data.files.length}`);
      data.files.forEach(file => {
        const fileName = file.componentPath.split('/').pop();
        console.log(`      • ${colorize(fileName, 'gray')}`);
      });
    }

    // Used Dependencies
    if (data.dependencies.size > 0) {
      console.log(`   ${colorize('Dependencies:', 'yellow')}`);
      Array.from(data.dependencies).sort().forEach(dep => {
        const isProtected = isProtectedDependency(dep);
        const label = isProtected ? ` ${colorize('(protected)', 'yellow')}` : '';
        console.log(`      • ${dep}${label}`);
      });
    }

    // Uses Blocks
    const usesBlocks = Array.from(data.usedComponents).filter(comp => isBlockComponent(comp));
    if (usesBlocks.length > 0) {
      console.log(`   ${colorize('Uses Blocks:', 'cyan')}`);
      usesBlocks.sort().forEach(comp => {
        const blockName = comp.replace('blocks/', '');
        console.log(`      • ${blockName}`);
      });
    }

    // Used UI Components
    const uiComponents = Array.from(data.usedComponents).filter(comp => comp.startsWith('ui/'));
    if (uiComponents.length > 0) {
      console.log(`   ${colorize('Uses UI Components:', 'magenta')}`);
      uiComponents.sort().forEach(comp => {
        const uiName = comp.replace('ui/', '');
        console.log(`      • ${uiName}`);
      });
    }

    // Used Other Components (non-UI, non-block)
    const otherComponents = Array.from(data.usedComponents).filter(comp => 
      !comp.startsWith('ui/') && !isBlockComponent(comp)
    );
    if (otherComponents.length > 0) {
      console.log(`   ${colorize('Uses Other Components:', 'magenta')}`);
      otherComponents.sort().forEach(comp => {
        console.log(`      • ${comp}`);
      });
    }

    // Used By Blocks
    const usedByBlocks = Array.from(data.usedByComponents).filter(comp => isBlockComponent(comp));
    if (usedByBlocks.length > 0) {
      console.log(`   ${colorize('Used By Blocks:', 'cyan')}`);
      usedByBlocks.sort().forEach(comp => {
        const blockName = comp.replace('blocks/', '');
        console.log(`      • ${blockName}`);
      });
    }

    // Used By UI Components
    const usedByUIComponents = Array.from(data.usedByComponents).filter(comp => comp.startsWith('ui/'));
    if (usedByUIComponents.length > 0) {
      console.log(`   ${colorize('Used By UI Components:', 'magenta')}`);
      usedByUIComponents.sort().forEach(comp => {
        const uiName = comp.replace('ui/', '');
        console.log(`      • ${uiName}`);
      });
    }

    // Used By Regular Components
    const usedByRegularComponents = Array.from(data.usedByComponents).filter(comp => 
      !comp.startsWith('ui/') && !isBlockComponent(comp)
    );
    if (usedByRegularComponents.length > 0) {
      console.log(`   ${colorize('Used By Regular Components:', 'magenta')}`);
      usedByRegularComponents.sort().forEach(comp => {
        console.log(`      • ${comp}`);
      });
    }

    // Used By Pages
    if (data.usedInPages.size > 0) {
      console.log(`   ${colorize('Used By Pages:', 'green')}`);
      Array.from(data.usedInPages).sort().forEach(page => {
        const isProtected = page === 'index';
        const label = isProtected ? ` ${colorize('(protected)', 'yellow')}` : '';
        console.log(`      • ${page}${label}`);
      });
    } else {
      if (data.usedByComponents.size === 0) {
        console.log(`   ${colorize('Usage:', 'red')} ${colorize('Not used in any Page, Block, or Component', 'red')}`); 
      } else {
        console.log(`   ${colorize('Used By Pages:', 'green')} ${colorize('None (Indirectly used via other blocks/components)', 'gray')}`);
      }
    }

    console.log('');
    index++;
  });

  console.log(colorize('─'.repeat(80), 'gray'));
  console.log(colorize(`Total Blocks: ${blockGroups.length}`, 'cyan'));
  
  const orphanBlocks = blockGroups.filter(([, data]) => {
    const usedByBlocks = Array.from(data.usedByComponents).filter(comp => isBlockComponent(comp));
    return data.usedInPages.size === 0 && data.usedByComponents.size === 0;
  });
  if (orphanBlocks.length > 0) {
    console.log(colorize(`Orphan Blocks: ${orphanBlocks.length}`, 'yellow'));
  }
  
  console.log(colorize('═'.repeat(80), 'cyan') + '\n');
}

// --- JSON Export Functions ---

/**
 * Generate JSON report for blocks
 */
function generateBlocksJson(blockMap, pageUsageMap) {
  const componentGroups = buildComponentUsageMap(blockMap, pageUsageMap);
  
  // Filter to only blocks and sort
  const blockGroups = Array.from(componentGroups.entries())
    .filter(([groupName]) => isBlockComponent(groupName))
    .sort((a, b) => a[0].localeCompare(b[0]));

  const blocks = blockGroups.map(([groupName, data]) => {
    const blockName = groupName.replace('blocks/', '');
    const usesBlocks = Array.from(data.usedComponents).filter(comp => isBlockComponent(comp));
    const uiComponents = Array.from(data.usedComponents).filter(comp => comp.startsWith('ui/'));
    const otherComponents = Array.from(data.usedComponents).filter(comp => !comp.startsWith('ui/') && !isBlockComponent(comp));
    const usedByUIComponents = Array.from(data.usedByComponents).filter(comp => comp.startsWith('ui/'));
    const usedByBlocks = Array.from(data.usedByComponents).filter(comp => isBlockComponent(comp));
    const usedByRegularComponents = Array.from(data.usedByComponents).filter(comp => 
      !comp.startsWith('ui/') && !isBlockComponent(comp)
    );
    
    return {
      name: blockName,
      fullPath: groupName,
      files: data.files.map(f => f.componentPath),
      dependencies: Array.from(data.dependencies).sort(),
      usesBlocks: usesBlocks.map(comp => comp.replace('blocks/', '')).sort(),
      usesUIComponents: uiComponents.map(comp => comp.replace('ui/', '')).sort(),
      usesOtherComponents: otherComponents.sort(),
      usedByUIComponents: usedByUIComponents.map(comp => comp.replace('ui/', '')).sort(),
      usedByBlocks: usedByBlocks.map(comp => comp.replace('blocks/', '')).sort(),
      usedByRegularComponents: usedByRegularComponents.sort(),
      usedByPages: Array.from(data.usedInPages).sort(),
      isOrphan: data.usedInPages.size === 0 && data.usedByComponents.size === 0,
    };
  });

  const orphanBlocks = blocks.filter(b => b.isOrphan);

  return {
    generated: new Date().toISOString(),
    summary: {
      totalBlocks: blockGroups.length,
      totalBlockFiles: blockMap.size,
      orphanCount: orphanBlocks.length,
    },
    blocks,
    orphanBlocks: orphanBlocks.map(b => b.name),
  };
}

// --- CLI ---

function showHelp() {
  console.log(`
${colorize('🧩 Analyze Blocks', 'cyan')}

${colorize('Usage:', 'bright')}
  npm run analyze:blocks [options]

${colorize('Options:', 'bright')}
  --json      Output results as JSON to console
  --help      Show this help message

${colorize('Examples:', 'bright')}
  npm run analyze:blocks              # Show block analysis
  npm run analyze:blocks -- --json    # Output as JSON

${colorize('What it does:', 'bright')}
  • Lists all block components in src/components/blocks/
  • Shows NPM dependencies used by each block
  • Shows which UI components each block uses
  • Shows block-to-block relationships
  • Shows component-to-component relationships
  • Identifies orphan blocks (not used anywhere)
  • Shows which pages use each block
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
    const componentMap = buildComponentMap();
    
    // Filter to only block components
    const blockMap = new Map();
    componentMap.forEach((fullPath, componentPath) => {
      if (isBlockComponent(componentPath)) {
        blockMap.set(componentPath, fullPath);
      }
    });
    
    if (outputJson) {
      const jsonOutput = generateBlocksJson(blockMap, pageUsageMap);
      console.log(JSON.stringify(jsonOutput, null, 2));
    } else {
      console.log('\n🔍 Analyzing Blocks...\n');
      printBlockMap(blockMap, pageUsageMap);
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

