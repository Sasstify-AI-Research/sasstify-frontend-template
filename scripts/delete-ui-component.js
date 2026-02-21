#!/usr/bin/env node

/**
 * Delete UI Component Script
 * Deletes UI components from src/components/ui/
 */

import { execSync } from 'child_process';
import {
  colorize,
  buildComponentMap,
  buildPageUsageMap,
  buildComponentUsageMap,
  getGroupName as getGroupNameFromUtils
} from './analyze-utils.js';
import {
  parseArgs,
  hasArgs,
  createPrompt,
  question
} from './utils/cli.js';
import {
  deleteComponentFolder,
  deleteComponentUnitTests,
  findUnusedDependencies,
  findUnusedComponents
} from './utils/component-deletion.js';

/**
 * Get group name for a component path
 */
function getGroupName(componentPath) {
  return getGroupNameFromUtils(componentPath);
}

/**
 * Build a map of grouped UI components with their usage information
 */
function buildGroupedComponentList(componentMap, componentUsageMap) {
  const groups = new Map();
  
  for (const [componentPath] of componentMap) {
    const groupName = getGroupName(componentPath);
    
    // Filter to only UI components
    if (!groupName.startsWith('ui/')) {
      continue;
    }
    
    if (!groups.has(groupName)) {
      groups.set(groupName, {
        files: [],
        usedInPages: new Set(),
        usedByComponents: new Set()
      });
    }
    
    const group = groups.get(groupName);
    group.files.push(componentPath);
    
    // Merge usage from componentUsageMap
    const usage = componentUsageMap.get(groupName);
    if (usage) {
      usage.usedInPages.forEach(page => group.usedInPages.add(page));
      usage.usedByComponents.forEach(comp => group.usedByComponents.add(comp));
    }
  }
  
  return groups;
}

/**
 * Scan page sub-components for usage
 * Note: Page sub-components concept was removed, so this always returns empty Set
 */
function scanPageSubComponentsForUsage(componentPath) {
  // Page sub-components concept was removed - always return empty Set
  return new Set();
}

function printUsage() {
  console.log(`
Usage: npm run delete:ui-component [options]

Options:
  --name=<name>     UI component name (e.g., "accordion" or "ui/accordion")
  --yes / -y        Skip confirmation prompts
  --cascade         Enable cascade deletion of orphaned child components
  --deps            Enable npm dependency cleanup

Examples:
  npm run delete:ui-component
  npm run delete:ui-component -- --name=accordion --yes
  npm run delete:ui-component -- --name=ui/accordion --cascade --deps --yes
`);
}

/**
 * Main function
 */
async function deleteUIComponent() {
  const args = parseArgs();
  
  // Show help
  if (args.help || args.h) {
    printUsage();
    process.exit(0);
  }
  
  const skipConfirmation = args.yes === true;
  const isCliMode = hasArgs() && args.name;
  const enableCascade = isCliMode ? args.cascade === true : true;
  const enableDeps = isCliMode ? args.deps === true : true;
  let rl = null;
  
  console.log(`\n${colorize('🧹 Delete UI Component Script', 'cyan')}\n`);
  console.log(`${colorize('Building component and usage maps...', 'gray')}\n`);
  
  // Build maps
  const componentMap = buildComponentMap();
  const pageUsageMap = buildPageUsageMap();
  const componentUsageMap = buildComponentUsageMap(componentMap, pageUsageMap);
  
  // Build grouped component list (only UI components)
  const groupedComponents = buildGroupedComponentList(componentMap, componentUsageMap);
  
  // Sort components: unused first, then alphabetically
  const sortedGroups = Array.from(groupedComponents.entries()).sort((a, b) => {
    const aUsed = a[1].usedInPages.size > 0 || a[1].usedByComponents.size > 0;
    const bUsed = b[1].usedInPages.size > 0 || b[1].usedByComponents.size > 0;
    
    if (aUsed !== bUsed) return aUsed ? 1 : -1;
    return a[0].localeCompare(b[0]);
  });
  
  let selectedGroup, groupInfo;
  
  if (hasArgs() && args.name) {
    // Non-interactive mode with CLI arguments
    let componentName = args.name;
    
    // Handle both "accordion" and "ui/accordion" formats
    if (!componentName.startsWith('ui/')) {
      componentName = `ui/${componentName}`;
    }
    
    // Find the component in the list
    const found = sortedGroups.find(([name]) => name === componentName);
    
    if (!found) {
      console.log(`${colorize(`❌ UI component "${componentName}" not found!`, 'red')}\n`);
      console.log(`${colorize('Available UI components:', 'cyan')}`);
      sortedGroups.forEach(([name]) => {
        const displayName = name.replace('ui/', '');
        console.log(`  • ${displayName} (${name})`);
      });
      console.log('');
      process.exit(1);
    }
    
    [selectedGroup, groupInfo] = found;
    
  } else {
    // Interactive mode
    rl = createPrompt();
    
    // Display component list
    console.log(`${colorize('Available UI Components:', 'cyan')}\n`);
    
    sortedGroups.forEach(([groupName, info], index) => {
      const displayName = groupName.replace('ui/', '');
      const isUsed = info.usedInPages.size > 0 || info.usedByComponents.size > 0;
      const statusLabel = isUsed 
        ? colorize('(used)', 'yellow')
        : colorize('(unused)', 'green');
      
      console.log(`  ${colorize(`${index + 1}.`, 'gray')} ${displayName} ${statusLabel}`);
    });
    
    console.log('');
    
    // Get user selection
    const selection = await question(rl, `${colorize('Enter UI component number to delete (or "q" to quit):', 'cyan')} `);
    
    if (selection.toLowerCase() === 'q') {
      console.log(`\n${colorize('Cancelled.', 'yellow')}\n`);
      rl.close();
      return;
    }
    
    const selectedIndex = parseInt(selection, 10) - 1;
    
    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= sortedGroups.length) {
      console.log(`\n${colorize('Invalid selection.', 'red')}\n`);
      rl.close();
      return;
    }
    
    [selectedGroup, groupInfo] = sortedGroups[selectedIndex];
  }
  
  console.log(`\n${colorize(`Selected: ${selectedGroup}`, 'cyan')}\n`);
  
  // Check usage in page sub-components
  const pageSubComponentUsage = scanPageSubComponentsForUsage(selectedGroup);
  
  // Combine all usages
  const allPageUsages = new Set([...groupInfo.usedInPages]);
  const allComponentUsages = new Set([...groupInfo.usedByComponents]);
  
  // Display usage details
  console.log(`${colorize('- Usage Analysis:', 'cyan')}`);
  
  if (allPageUsages.size > 0) {
    console.log(`\n  ${colorize('Used in Pages:', 'yellow')}`);
    allPageUsages.forEach(page => {
      console.log(`    • ${page}`);
    });
  }
  
  if (allComponentUsages.size > 0) {
    console.log(`\n  ${colorize('Used by Components:', 'yellow')}`);
    allComponentUsages.forEach(comp => {
      console.log(`    • ${comp}`);
    });
  }
  
  if (pageSubComponentUsage.size > 0) {
    console.log(`\n  ${colorize('Used in Page Sub-Components:', 'yellow')}`);
    pageSubComponentUsage.forEach(usage => {
      console.log(`    • ${usage}`);
    });
  }
  
  const totalUsages = allPageUsages.size + allComponentUsages.size + pageSubComponentUsage.size;
  
  if (totalUsages > 0) {
    console.log(`\n${colorize('❌ Cannot delete: UI component is still in use!', 'red')}`);
    console.log(`${colorize(`   Total usages: ${totalUsages}`, 'red')}\n`);
    if (rl) rl.close();
    return;
  }
  
  console.log(`\n  ${colorize('✓ No usages found - safe to delete!', 'green')}\n`);
  
  // Find cascade components and unused deps based on flags
  const unusedComponents = enableCascade 
    ? findUnusedComponents(selectedGroup, componentUsageMap) 
    : [];
  const allComponentsToDelete = [selectedGroup, ...unusedComponents];
  const unusedDeps = enableDeps 
    ? findUnusedDependencies(allComponentsToDelete, componentUsageMap, pageUsageMap) 
    : [];
  
  // Show what will be deleted
  if (enableCascade || enableDeps) {
    console.log(`${colorize('- Cascade Analysis:', 'cyan')}`);
    
    if (unusedDeps.length > 0) {
      console.log(`\n  ${colorize('Unused npm dependencies (safe to uninstall):', 'magenta')}`);
      unusedDeps.forEach(dep => {
        console.log(`    • ${dep}`);
      });
    }
    
    if (unusedComponents.length > 0) {
      console.log(`\n  ${colorize('Unused components (safe to cascade delete):', 'magenta')}`);
      unusedComponents.forEach(comp => {
        console.log(`    • ${comp}`);
      });
    }
    
    if (unusedDeps.length === 0 && unusedComponents.length === 0) {
      console.log(`\n  ${colorize('No cascade deletions needed.', 'gray')}`);
    }
    
    console.log('');
  }
  
  // Confirm deletion
  if (!skipConfirmation) {
    if (!rl) rl = createPrompt();
    
    const confirm = await question(rl, `${colorize(`Delete UI component "${selectedGroup}"? (y/n):`, 'yellow')} `);
    
    if (confirm.toLowerCase() !== 'y') {
      console.log(`\n${colorize('Cancelled.', 'yellow')}\n`);
      rl.close();
      return;
    }
  }
  
  // Delete the component
  console.log(`\n${colorize('🗑️  Deleting UI component...', 'yellow')}\n`);
  
  const deleted = deleteComponentFolder(selectedGroup, 'ui');
  
  if (deleted) {
    console.log(`  ${colorize('✅', 'green')} Deleted UI component ${selectedGroup}`);
  } else {
    console.log(`  ${colorize('⚠️', 'yellow')} Could not find UI component folder: ${selectedGroup}`);
  }
  
  // Delete associated unit tests
  const deletedTests = deleteComponentUnitTests(selectedGroup, 'ui');
  
  if (deletedTests.length > 0) {
    deletedTests.forEach(testPath => {
      console.log(`  ${colorize('✅', 'green')} Deleted test ${testPath}`);
    });
  }
  
  // Handle cascade component deletion
  if (enableCascade && unusedComponents.length > 0) {
    let shouldCascade = skipConfirmation;
    
    if (!skipConfirmation) {
      if (!rl) rl = createPrompt();
      const cascadeConfirm = await question(rl, `\n${colorize(`Delete ${unusedComponents.length} unused component(s)? (y/n):`, 'yellow')} `);
      shouldCascade = cascadeConfirm.toLowerCase() === 'y';
    }
    
    if (shouldCascade) {
      console.log(`\n${colorize('🧹 Deleting cascade components...', 'yellow')}\n`);
      
      for (const comp of unusedComponents) {
        // Determine component type for cascade deletion
        const compType = comp.startsWith('ui/') ? 'ui' : (comp.startsWith('blocks/') ? 'block' : 'regular');
        const compDeleted = deleteComponentFolder(comp, compType);
        if (compDeleted) {
          console.log(`  ${colorize('✅', 'green')} Deleted component ${comp}`);
        }
        
        const compTests = deleteComponentUnitTests(comp, compType);
        compTests.forEach(testPath => {
          console.log(`  ${colorize('✅', 'green')} Deleted test ${testPath}`);
        });
      }
    } else {
      console.log(`${colorize('ℹ️  Skipping cascade component deletion.', 'gray')}`);
    }
  }
  
  // Handle npm dependency uninstallation
  if (enableDeps && unusedDeps.length > 0) {
    let shouldUninstall = skipConfirmation;
    
    if (!skipConfirmation) {
      if (!rl) rl = createPrompt();
      const depsConfirm = await question(rl, `\n${colorize(`Uninstall ${unusedDeps.length} unused npm dependency(ies)? (y/n):`, 'yellow')} `);
      shouldUninstall = depsConfirm.toLowerCase() === 'y';
    }
    
    if (shouldUninstall) {
      console.log(`\n${colorize('📦 Uninstalling dependencies...', 'yellow')}\n`);
      
      try {
        const depsString = unusedDeps.join(' ');
        execSync(`npm uninstall ${depsString}`, { 
          stdio: 'inherit',
          cwd: process.cwd()
        });
        console.log(`\n${colorize('✅ Successfully uninstalled dependencies!', 'green')}`);
      } catch (error) {
        console.error(`\n${colorize('⚠️  Error uninstalling dependencies:', 'yellow')} ${error.message}`);
        console.log(`${colorize('💡 Tip:', 'cyan')} You can manually uninstall them later:\n`);
        unusedDeps.forEach(dep => {
          console.log(`     npm uninstall ${dep}`);
        });
      }
    } else {
      console.log(`${colorize('ℹ️  Skipping dependency uninstallation.', 'gray')}`);
      console.log(`${colorize('💡 Tip:', 'cyan')} You can uninstall them later:\n`);
      unusedDeps.forEach(dep => {
        console.log(`     npm uninstall ${dep}`);
      });
    }
  }
  
  console.log(`\n${colorize('✅ UI component deletion complete!', 'green')}\n`);
  
  if (rl) rl.close();
}

// Run
deleteUIComponent();

