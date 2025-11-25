#!/usr/bin/env node

/**
 * Analyze Components Script
 * Analyzes shared components in src/components/
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
 * Pretty print component analysis
 */
function printComponentMap(componentMap, pageUsageMap) {
  console.log('\n' + colorize('═'.repeat(80), 'cyan'));
  console.log(colorize('📦 COMPONENT ANALYSIS', 'cyan'));
  console.log(colorize('═'.repeat(80), 'cyan') + '\n');

  const components = Array.from(componentMap.entries());
  
  if (components.length === 0) {
    console.log(colorize('  No components found', 'gray'));
    return;
  }

  const componentGroups = buildComponentUsageMap(componentMap, pageUsageMap);

  // Sort groups alphabetically
  const sortedGroups = Array.from(componentGroups.entries()).sort((a, b) => 
    a[0].localeCompare(b[0])
  );

  let index = 1;
  sortedGroups.forEach(([groupName, data]) => {
    const isFolder = groupName.includes('/') || data.files.length > 1 || data.files[0].componentPath.includes('/');
    const componentType = getComponentType(groupName);
    const isBlock = isBlockComponent(groupName);
    const typeLabel = isBlock ? ` ${colorize('(Block)', 'cyan')}` : (componentType === 'ui' ? ` ${colorize('(UI)', 'magenta')}` : '');

    console.log(colorize(`${index}. ${groupName}`, 'blue') + typeLabel);
    
    // Files
    if (isFolder) {
      console.log(`   ${colorize('Files:', 'gray')} ${data.files.length}`);
      data.files.forEach(file => {
        const fileName = file.componentPath.split('/').pop();
        console.log(`      • ${colorize(fileName, 'gray')}`);
      });
    } else {
       console.log(`   ${colorize('Path:', 'gray')} ${data.files[0].fullPath}`);
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

    // Used Components
    if (data.usedComponents.size > 0) {
      const uiComponents = Array.from(data.usedComponents).filter(comp => comp.startsWith('ui/'));
      const otherComponents = Array.from(data.usedComponents).filter(comp => !comp.startsWith('ui/'));
      
      if (isBlock && uiComponents.length > 0) {
        console.log(`   ${colorize('Uses UI Components:', 'magenta')}`);
        uiComponents.sort().forEach(comp => {
          console.log(`      • ${comp}`);
        });
      }
      
      if (otherComponents.length > 0) {
        const label = isBlock && uiComponents.length > 0 ? 'Uses Other Components:' : 'Uses Components:';
        console.log(`   ${colorize(label, 'magenta')}`);
        otherComponents.sort().forEach(comp => {
          console.log(`      • ${comp}`);
        });
      } else if (!isBlock && uiComponents.length > 0) {
        console.log(`   ${colorize('Uses Components:', 'magenta')}`);
        uiComponents.sort().forEach(comp => {
          console.log(`      • ${comp}`);
        });
      }
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

    // Used In Pages
    if (data.usedInPages.size > 0) {
      console.log(`   ${colorize('Used In Pages:', 'green')}`);
      Array.from(data.usedInPages).sort().forEach(page => {
        const isProtected = page === 'index';
        const label = isProtected ? ` ${colorize('(protected)', 'yellow')}` : '';
        console.log(`      • ${page}${label}`);
      });
    } else {
       if (data.usedByComponents.size === 0) {
          console.log(`   ${colorize('Usage:', 'red')} ${colorize('Not used in any Page or Component', 'red')}`); 
       } else {
          console.log(`   ${colorize('Used In Pages:', 'green')} ${colorize('None (Indirectly used via other components)', 'gray')}`);
       }
    }

    console.log('');
    index++;
  });

  console.log(colorize('─'.repeat(80), 'gray'));
  console.log(colorize(`Total Component Groups: ${sortedGroups.length}`, 'cyan'));
  console.log(colorize(`Total Component Files: ${components.length}`, 'cyan'));
  console.log(colorize('═'.repeat(80), 'cyan') + '\n');
}

// --- JSON Export Functions ---

/**
 * Generate JSON report for components
 */
function generateComponentsJson(componentMap, pageUsageMap) {
  const componentGroups = buildComponentUsageMap(componentMap, pageUsageMap);
  const sortedGroups = Array.from(componentGroups.entries()).sort((a, b) => 
    a[0].localeCompare(b[0])
  );

  const components = sortedGroups.map(([groupName, data]) => {
    const componentType = getComponentType(groupName);
    const isBlock = isBlockComponent(groupName);
    const uiComponents = Array.from(data.usedComponents).filter(comp => comp.startsWith('ui/'));
    const usedByUIComponents = Array.from(data.usedByComponents).filter(comp => comp.startsWith('ui/'));
    const usedByBlocks = Array.from(data.usedByComponents).filter(comp => isBlockComponent(comp));
    const usedByRegularComponents = Array.from(data.usedByComponents).filter(comp => 
      !comp.startsWith('ui/') && !isBlockComponent(comp)
    );
    
    return {
      name: groupName,
      type: componentType,
      isBlock,
      files: data.files.map(f => f.componentPath),
      dependencies: Array.from(data.dependencies).sort(),
      usesComponents: Array.from(data.usedComponents).sort(),
      usesUIComponents: isBlock ? uiComponents.sort() : undefined,
      usedByUIComponents: usedByUIComponents.map(comp => comp.replace('ui/', '')).sort(),
      usedByBlocks: usedByBlocks.map(comp => comp.replace('blocks/', '')).sort(),
      usedByRegularComponents: usedByRegularComponents.sort(),
      usedInPages: Array.from(data.usedInPages).sort(),
      isOrphan: data.usedInPages.size === 0 && data.usedByComponents.size === 0,
    };
  });

  return {
    generated: new Date().toISOString(),
    summary: {
      totalComponentGroups: sortedGroups.length,
      totalComponentFiles: componentMap.size,
      orphanCount: components.filter(c => c.isOrphan).length,
    },
    components,
    orphanComponents: components.filter(c => c.isOrphan).map(c => c.name),
  };
}

// --- CLI ---

function showHelp() {
  console.log(`
${colorize('📦 Analyze Components', 'cyan')}

${colorize('Usage:', 'bright')}
  npm run analyze:components [options]

${colorize('Options:', 'bright')}
  --json      Output results as JSON to console
  --help      Show this help message

${colorize('Examples:', 'bright')}
  npm run analyze:components              # Show component analysis
  npm run analyze:components -- --json    # Output as JSON

${colorize('What it does:', 'bright')}
  • Lists all shared components in src/components/
  • Shows NPM dependencies used by each component
  • Shows component-to-component relationships
  • Identifies orphan components (not used anywhere)
  • Shows which pages use each component
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
    
    if (outputJson) {
      const jsonOutput = generateComponentsJson(componentMap, pageUsageMap);
      console.log(JSON.stringify(jsonOutput, null, 2));
    } else {
      console.log('\n🔍 Analyzing Components...\n');
      printComponentMap(componentMap, pageUsageMap);
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
