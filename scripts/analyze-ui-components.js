#!/usr/bin/env node

/**
 * Analyze UI Components Script
 * Analyzes UI components in src/components/ui/
 */

import { fileURLToPath } from 'url';
import {
  colorize,
  isProtectedDependency,
  buildComponentMap,
  buildPageUsageMap,
  buildComponentUsageMap,
  getComponentType,
  isBlockComponent,
} from './analyze-utils.js';

// --- Print Functions ---

/**
 * Pretty print UI component analysis
 */
function printUIComponentMap(uiComponentMap, pageUsageMap, fullComponentMap) {
  console.log('\n' + colorize('═'.repeat(80), 'magenta'));
  console.log(colorize('🎨 UI COMPONENT ANALYSIS', 'magenta'));
  console.log(colorize('═'.repeat(80), 'magenta') + '\n');

  const uiComponents = Array.from(uiComponentMap.entries());
  
  if (uiComponents.length === 0) {
    console.log(colorize('  No UI components found', 'gray'));
    return;
  }

  // Use full component map for proper reverse lookups (usedByComponents)
  const componentGroups = buildComponentUsageMap(fullComponentMap, pageUsageMap);

  // Filter to only UI components and sort alphabetically
  const uiGroups = Array.from(componentGroups.entries())
    .filter(([groupName]) => getComponentType(groupName) === 'ui')
    .sort((a, b) => a[0].localeCompare(b[0]));

  let index = 1;
  uiGroups.forEach(([groupName, data]) => {
    const uiName = groupName.replace('ui/', '');
    
    console.log(colorize(`${index}. ${uiName}`, 'magenta'));
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

    // Uses Other UI Components
    const usesUIComponents = Array.from(data.usedComponents).filter(comp => comp.startsWith('ui/'));
    if (usesUIComponents.length > 0) {
      console.log(`   ${colorize('Uses UI Components:', 'magenta')}`);
      usesUIComponents.sort().forEach(comp => {
        const uiName = comp.replace('ui/', '');
        console.log(`      • ${uiName}`);
      });
    }

    // Uses Other Components (non-UI)
    const otherComponents = Array.from(data.usedComponents).filter(comp => !comp.startsWith('ui/'));
    if (otherComponents.length > 0) {
      console.log(`   ${colorize('Uses Other Components:', 'magenta')}`);
      otherComponents.sort().forEach(comp => {
        console.log(`      • ${comp}`);
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

    // Used By Blocks
    const usedByBlocks = Array.from(data.usedByComponents).filter(comp => isBlockComponent(comp));
    if (usedByBlocks.length > 0) {
      console.log(`   ${colorize('Used By Blocks:', 'cyan')}`);
      usedByBlocks.sort().forEach(comp => {
        const blockName = comp.replace('blocks/', '');
        console.log(`      • ${blockName}`);
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
        console.log(`   ${colorize('Used By Pages:', 'green')} ${colorize('None (Indirectly used via blocks/components)', 'gray')}`);
      }
    }

    console.log('');
    index++;
  });

  console.log(colorize('─'.repeat(80), 'gray'));
  console.log(colorize(`Total UI Components: ${uiGroups.length}`, 'magenta'));
  
  const orphanUIComponents = uiGroups.filter(([, data]) => 
    data.usedInPages.size === 0 && data.usedByComponents.size === 0
  );
  if (orphanUIComponents.length > 0) {
    console.log(colorize(`Orphan UI Components: ${orphanUIComponents.length}`, 'yellow'));
  }
  
  console.log(colorize('═'.repeat(80), 'magenta') + '\n');
}

// --- JSON Export Functions ---

/**
 * Generate JSON report for UI components
 */
function generateUIComponentsJson(uiComponentMap, pageUsageMap, fullComponentMap) {
  // Use full component map for proper reverse lookups (usedByComponents)
  const componentGroups = buildComponentUsageMap(fullComponentMap, pageUsageMap);
  
  // Filter to only UI components and sort
  const uiGroups = Array.from(componentGroups.entries())
    .filter(([groupName]) => getComponentType(groupName) === 'ui')
    .sort((a, b) => a[0].localeCompare(b[0]));

  const uiComponents = uiGroups.map(([groupName, data]) => {
    const uiName = groupName.replace('ui/', '');
    const usesUIComponents = Array.from(data.usedComponents).filter(comp => comp.startsWith('ui/'));
    const otherComponents = Array.from(data.usedComponents).filter(comp => !comp.startsWith('ui/'));
    const usedByUIComponents = Array.from(data.usedByComponents).filter(comp => comp.startsWith('ui/'));
    const usedByBlocks = Array.from(data.usedByComponents).filter(comp => isBlockComponent(comp));
    const usedByRegularComponents = Array.from(data.usedByComponents).filter(comp => 
      !comp.startsWith('ui/') && !isBlockComponent(comp)
    );
    
    return {
      name: uiName,
      fullPath: groupName,
      files: data.files.map(f => f.componentPath),
      dependencies: Array.from(data.dependencies).sort(),
      usesUIComponents: usesUIComponents.map(comp => comp.replace('ui/', '')).sort(),
      usesOtherComponents: otherComponents.sort(),
      usedByUIComponents: usedByUIComponents.map(comp => comp.replace('ui/', '')).sort(),
      usedByBlocks: usedByBlocks.map(comp => comp.replace('blocks/', '')).sort(),
      usedByRegularComponents: usedByRegularComponents.sort(),
      usedByPages: Array.from(data.usedInPages).sort(),
      isOrphan: data.usedInPages.size === 0 && data.usedByComponents.size === 0,
    };
  });

  const orphanUIComponents = uiComponents.filter(ui => ui.isOrphan);

  return {
    generated: new Date().toISOString(),
    summary: {
      totalUIComponents: uiGroups.length,
      totalUIComponentFiles: uiComponentMap.size,
      orphanCount: orphanUIComponents.length,
    },
    uiComponents,
    orphanUIComponents: orphanUIComponents.map(ui => ui.name),
  };
}

// --- CLI ---

function showHelp() {
  console.log(`
${colorize('🎨 Analyze UI Components', 'magenta')}

${colorize('Usage:', 'bright')}
  npm run analyze:ui-components [options]

${colorize('Options:', 'bright')}
  --json      Output results as JSON to console
  --help      Show this help message

${colorize('Examples:', 'bright')}
  npm run analyze:ui-components              # Show UI component analysis
  npm run analyze:ui-components -- --json    # Output as JSON

${colorize('What it does:', 'bright')}
  • Lists all UI components in src/components/ui/
  • Shows NPM dependencies used by each UI component
  • Shows which UI components each component uses
  • Shows block-to-component relationships
  • Shows component-to-component relationships
  • Identifies orphan UI components (not used anywhere)
  • Shows which pages use each UI component
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
    
    // Filter to only UI components for display
    const uiComponentMap = new Map();
    componentMap.forEach((fullPath, componentPath) => {
      if (getComponentType(componentPath) === 'ui') {
        uiComponentMap.set(componentPath, fullPath);
      }
    });
    
    if (outputJson) {
      const jsonOutput = generateUIComponentsJson(uiComponentMap, pageUsageMap, componentMap);
      console.log(JSON.stringify(jsonOutput, null, 2));
    } else {
      console.log('\n🔍 Analyzing UI Components...\n');
      printUIComponentMap(uiComponentMap, pageUsageMap, componentMap);
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

