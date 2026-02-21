#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import {
  colorize,
  isProtectedDependency,
  loadPackageDependencies,
  buildComponentMap,
  buildPageUsageMap,
  buildComponentUsageMap
} from './analyze-utils.js';
import {
  parseArgs,
  hasArgs,
  createPrompt,
  question,
  toKebabCase
} from './utils/cli.js';
import {
  getGroupName
} from './analyze-utils.js';
import {
  deleteComponentFolder,
  deleteComponentUnitTests,
  findUnusedDependencies,
  findUnusedComponents,
  findAllCascadeComponents,
  getComponentTypeFromGroup
} from './utils/component-deletion.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Delete associated e2e tests for a page
 * Returns array of deleted test file paths
 */
function deletePageE2eTests(pageName) {
  const deletedTests = [];
  const e2eDir = path.join(process.cwd(), 'tests/e2e');
  
  // E2E test file patterns
  const testPaths = [
    path.join(e2eDir, `${pageName}.spec.ts`),
    path.join(e2eDir, `${pageName}.spec.tsx`),
  ];
  
  // Delete test files if they exist
  for (const testPath of testPaths) {
    if (fs.existsSync(testPath)) {
      fs.unlinkSync(testPath);
      deletedTests.push(path.relative(process.cwd(), testPath));
    }
  }
  
  return deletedTests;
}

/**
 * Delete unit tests for page sub-components
 * Unit tests are located at tests/unit/pages/[page-name]/
 * Returns array of deleted test file paths
 */
function deletePageSubComponentUnitTests(pageName) {
  const deletedTests = [];
  const pageTestDir = path.join(process.cwd(), 'tests/unit/pages', pageName);
  
  // Check if page test directory exists
  if (fs.existsSync(pageTestDir)) {
    // Delete all test files in the directory
    const files = fs.readdirSync(pageTestDir);
    for (const file of files) {
      const filePath = path.join(pageTestDir, file);
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
        deletedTests.push(`tests/unit/pages/${pageName}/${file}`);
      }
    }
    
    // Remove the directory if empty
    const remaining = fs.readdirSync(pageTestDir);
    if (remaining.length === 0) {
      fs.rmdirSync(pageTestDir);
    }
  }
  
  return deletedTests;
}

/**
 * Analyze dependencies for a page using shared functions from delete-component.js
 * This is a simplified version that leverages the reusable functions.
 * 
 * Key logic: A dependency is "safe to delete" if it's ONLY used by:
 * - The page being deleted (direct page dependency)
 * - Exclusive shared components (components only used by this page)
 * - Cascade components (components only used by exclusive components)
 */
/**
 * Find components that are exclusively used by a single page
 */
function findPageExclusiveComponents(pageName, pageUsageMap, componentUsageMap) {
  const exclusiveComponents = [];
  const pageUsage = pageUsageMap.get(pageName);
  
  if (!pageUsage || !pageUsage.components) {
    return exclusiveComponents;
  }
  
  // Get all components used by this page (as group names)
  const pageComponents = pageUsage.components.filter((comp) => !comp.endsWith('.types'));
  const pageComponentGroups = new Set(pageComponents.map(c => getGroupName(c)));
  
  // Helper to check if a component is only used within the page's component tree
  function isOnlyUsedByPageTree(groupName, visited = new Set()) {
    if (visited.has(groupName)) return true; // Circular reference within tree
    visited.add(groupName);
    
    const compData = componentUsageMap.get(groupName);
    if (!compData) return true;
    
    // Check if used by any OTHER page
    const usedByOtherPages = Array.from(compData.usedInPages).some(page => page !== pageName);
    if (usedByOtherPages) return false;
    
    // Check if used by components outside the page's tree
    for (const consumer of compData.usedByComponents) {
      // If consumer is in the page's component tree, check recursively
      if (pageComponentGroups.has(consumer)) {
        if (!isOnlyUsedByPageTree(consumer, visited)) return false;
      } else {
        // Used by something outside the page's tree
        return false;
      }
    }
    
    return true;
  }
  
  for (const compPath of pageComponents) {
    const groupName = getGroupName(compPath);
    
    if (isOnlyUsedByPageTree(groupName)) {
      exclusiveComponents.push(compPath);
    }
  }
  
  return exclusiveComponents;
}

function analyzePageDependencies(pagePath, pageName, allPackageDeps, pageUsageMap, componentMap) {
  const pageUsage = pageUsageMap.get(pageName);
  if (!pageUsage) {
    throw new Error(`Page usage data missing for "${pageName}".`);
  }
  
  // Build component usage map
  const componentUsageMap = buildComponentUsageMap(componentMap, pageUsageMap);
  
  // 1. Find exclusive components for this page (safe to delete)
  const exclusiveComponents = findPageExclusiveComponents(pageName, pageUsageMap, componentUsageMap);
  
  // 2. Get exclusive component group names
  const exclusiveComponentGroups = new Set(exclusiveComponents.map(c => getGroupName(c)));
  
  // 3. Find ALL cascade components RECURSIVELY using the new function
  const cascadeComponents = findAllCascadeComponents(
    Array.from(exclusiveComponentGroups), 
    componentUsageMap, 
    pageName
  );
  const cascadeComponentGroups = new Set(cascadeComponents);
  
  // 4. Combine all shared components that will be deleted
  const allComponentsToDelete = new Set([...exclusiveComponentGroups, ...cascadeComponentGroups]);
  
  // 5. Get all shared components used by this page
  const allPageComponents = pageUsage.components.filter((comp) => !comp.endsWith('.types'));
  
  // Build components summary - include cascade components in willBeDeleted
  const allWillBeDeletedComponents = [...exclusiveComponents];
  cascadeComponents.forEach(c => {
    if (!allWillBeDeletedComponents.includes(c)) {
      allWillBeDeletedComponents.push(c);
    }
  });
  
  const components = {
    used: allPageComponents,
    willBeDeleted: allWillBeDeletedComponents,
    usedElsewhere: allPageComponents.filter(c => !allComponentsToDelete.has(getGroupName(c)))
  };
  
  // 6. Collect ALL dependencies from:
  //    - Page directly
  //    - Exclusive components (these will be deleted with the page)
  //    - Cascade components (these become unused after exclusive components are deleted)
  const allDepsFromDeletingEntities = new Set();
  
  // Add page's direct dependencies
  (pageUsage.dependencies || []).forEach(dep => allDepsFromDeletingEntities.add(dep));
  
  // Add dependencies from ALL components being deleted (exclusive + cascade)
  allComponentsToDelete.forEach(groupName => {
    const group = componentUsageMap.get(groupName);
    if (group && group.dependencies) {
      group.dependencies.forEach(dep => allDepsFromDeletingEntities.add(dep));
    }
  });
  
  // 7. For each dependency, check if it's used by anything that will REMAIN after deletion
  const safeToDeleteDeps = [];
  const usedElsewhereDeps = [];
  const protectedDeps = [];
  
  allDepsFromDeletingEntities.forEach(dep => {
    if (!allPackageDeps.has(dep)) return; // Not in package.json
    
    if (isProtectedDependency(dep)) {
      protectedDeps.push(dep);
      return;
    }
    
    let usedByRemainingEntity = false;
    
    // Check if used by OTHER pages
    for (const [otherPage, otherData] of pageUsageMap.entries()) {
      if (otherPage !== pageName) {
        if (otherData.dependencies && otherData.dependencies.includes(dep)) {
          usedByRemainingEntity = true;
          break;
        }
      }
    }
    
    // Check if used by components that are NOT being deleted
    if (!usedByRemainingEntity) {
      for (const [groupName, groupData] of componentUsageMap.entries()) {
        // Skip components that will be deleted (exclusive + cascade)
        if (allComponentsToDelete.has(groupName)) continue;
        
        if (groupData.dependencies && groupData.dependencies.has(dep)) {
          usedByRemainingEntity = true;
          break;
        }
      }
    }
    
    if (usedByRemainingEntity) {
      usedElsewhereDeps.push(dep);
    } else {
      safeToDeleteDeps.push(dep);
    }
  });
  
  // Build final summaries
  const dependencies = {
    used: Array.from(allDepsFromDeletingEntities).filter(d => allPackageDeps.has(d)),
    safeToDelete: safeToDeleteDeps,
    usedElsewhere: [...usedElsewhereDeps, ...protectedDeps],
    protected: protectedDeps
  };

  // Component dependencies summary (for backward compatibility)
  const componentDependencies = {
    used: [],
    safeToDelete: safeToDeleteDeps.filter(dep => {
      // Dependencies that come from components (not direct page imports)
      const pageDirectDeps = new Set(pageUsage.dependencies || []);
      return !pageDirectDeps.has(dep);
    }),
    usedElsewhere: usedElsewhereDeps.filter(dep => {
      const pageDirectDeps = new Set(pageUsage.dependencies || []);
      return !pageDirectDeps.has(dep);
    }),
    protected: []
  };

  return { dependencies, components, componentDependencies };
}

// List all available pages (excluding index and dashboard which are core)
function listAvailablePages() {
  const pagesDir = path.join(process.cwd(), 'src/pages');
  
  if (!fs.existsSync(pagesDir)) {
    return [];
  }
  
  const pages = fs.readdirSync(pagesDir)
    .filter(file => {
      const fullPath = path.join(pagesDir, file);
      return fs.statSync(fullPath).isDirectory();
    })
    // Exclude index page (protected)
    .filter(page => page !== 'index');
  
  return pages;
}

// Update vite.config.ts to remove page
function updateViteConfig(pageNameKebab) {
  const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');
  let content = fs.readFileSync(viteConfigPath, 'utf8');
  
  let updateCount = 0;
  let warnings = [];
  
  // 1. Remove from rollupOptions.input
  // Pattern matches the full line including leading whitespace and trailing comma/newline
  const inputEntryPattern = new RegExp(
    `\\n[ \\t]*['"]?${pageNameKebab}['"]?:\\s*path\\.resolve\\(__dirname,\\s*['"]src/pages/${pageNameKebab}/index\\.html['"]\\),?`,
    'g'
  );
  
  if (content.match(inputEntryPattern)) {
    content = content.replace(inputEntryPattern, '');
    // Clean up any extra blank lines in the input section (multiple newlines before closing brace)
    content = content.replace(/(\n[ \t]*\n)([ \t]*\},)/g, '\n$2');
    updateCount++;
  } else {
    warnings.push('Could not find page entry in rollupOptions.input');
  }
  
  // 2. Remove from devServerMiddleware
  const pageNameTitle = pageNameKebab
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  const middlewarePattern = new RegExp(
    `(\\n[ \\t]*\\/\\/\\s*${pageNameTitle}\\s+page[^\\n]*\\n)` +
    `([ \\t]*else\\s+if\\s*\\(pathname\\s*===\\s*['"]/${pageNameKebab}['"]\\s*\\|\\|\\s*pathname\\s*===\\s*['"]/${pageNameKebab}/['"]\\)\\s*\\{[^}]*\\}\\s*)` +
    `(else\\s+if\\s*\\(pathname\\s*===\\s*['"]/${pageNameKebab}/index\\.html['"]\\)\\s*\\{[^}]*\\}\\s*)` +
    `(?:\\n[ \\t]*\\n)+`,
    'gm'
  );
  
  if (content.match(middlewarePattern)) {
    content = content.replace(middlewarePattern, '\n');
    updateCount++;
  } else {
    warnings.push('Could not find page middleware in devServerMiddleware');
  }
  
  // 3. Write file
  fs.writeFileSync(viteConfigPath, content);
  
  if (updateCount === 2) {
    console.log(`  ${colorize('✅', 'green')} Updated vite.config.ts (removed ${updateCount}/2 sections)`);
  } else {
    console.log(`  ${colorize(`⚠️  Partially updated vite.config.ts (removed ${updateCount}/2 sections)`, 'yellow')}`);
    if (warnings.length > 0) {
      console.log(`\n  ${colorize('⚠️  Warnings:', 'yellow')}`);
      warnings.forEach(warning => console.log(`     - ${colorize(warning, 'yellow')}`));
      console.log(`\n  ${colorize('📝 Manual cleanup required in vite.config.ts:', 'cyan')}`);
      if (updateCount < 1) {
        console.log(`     1. Remove from rollupOptions.input:`);
        console.log(`        ${pageNameKebab}: path.resolve(__dirname, 'src/pages/${pageNameKebab}/index.html'),`);
      }
      if (updateCount < 2) {
        console.log(`     2. Remove from devServerMiddleware:`);
        console.log(`        The entire block for /${pageNameKebab}/ routing`);
      }
    }
  }
}

function printUsage() {
  console.log(`
Usage: npm run delete:page [options]

Options:
  --name=<name>     Page name in kebab-case (required for non-interactive)
  --yes / -y        Skip confirmation prompts

Examples:
  npm run delete:page
  npm run delete:page -- --name=user-profile --yes
`);
}

// Main function
async function deletePage() {
  const args = parseArgs();
  
  // Show help
  if (args.help || args.h) {
    printUsage();
    process.exit(0);
  }
  
  const skipConfirmation = args.yes === true;
  let rl = null;
  
  console.log('\n🗑️  Delete Page from MPA\n');

  try {
    // Load package dependencies
    const allPackageDeps = loadPackageDependencies();
    // Build page usage map of dependencies and components
    const pageUsageMap = buildPageUsageMap();
    // Build component map
    const componentMap = buildComponentMap();
    
    // List available pages
    const availablePages = listAvailablePages();

    if (availablePages.length === 0) {
      console.log(`${colorize('❌ No deletable pages found!', 'red')}`);
      console.log(`   ${colorize('(only the index page is protected and cannot be deleted)', 'gray')}\n`);
      process.exit(0);
    }
    
    let pageNameKebab;
    
    if (hasArgs() && args.name) {
      // Non-interactive mode with CLI arguments
      pageNameKebab = toKebabCase(args.name);
    } else {
      // Interactive mode
      rl = createPrompt();
      
      console.log(`${colorize('📋 Available pages to delete:', 'cyan')}`);
      availablePages.forEach((page, index) => {
        console.log(`   ${index + 1}. ${page}`);
      });
      console.log('');
      
      // Get page name
      const pageName = await question(rl, '? Page name to delete (kebab-case): ');
      pageNameKebab = toKebabCase(pageName.trim());
    }
    
    if (!pageNameKebab) {
      console.error(`${colorize('❌ Page name is required!', 'red')}`);
      if (rl) rl.close();
      process.exit(1);
    }
    
    // Check if it's a protected page
    if (pageNameKebab === 'index') {
      console.error(`${colorize('❌ Cannot delete the index page!', 'red')}`);
      console.error(`   ${colorize('The index page is required for the application.', 'yellow')}`);
      if (rl) rl.close();
      process.exit(1);
    }
    
    // Check if page exists
    const pagePath = path.join(process.cwd(), 'src/pages', pageNameKebab);
    if (!fs.existsSync(pagePath)) {
      console.error(`${colorize(`❌ Page "${pageNameKebab}" does not exist!`, 'red')}`);
      if (rl) rl.close();
      process.exit(1);
    }
    
    // Analyze dependencies
    console.log(`\n${colorize('🔍 Analyzing dependencies...', 'cyan')}\n`);

    const dependencyAnalysis = analyzePageDependencies(
      pagePath,
      pageNameKebab,
      allPackageDeps,
      pageUsageMap,
      componentMap
    );
    const { dependencies: dependencySummary, components: componentSummary, componentDependencies: componentDepsSummary } = dependencyAnalysis;
    
    console.log(`   ${colorize('⚙️', 'cyan')}  vite.config.ts (will be updated)`);

    // --- Dependencies Section ---
    console.log(`\n${colorize('- Dependencies Used:', 'cyan')}`);
    
    // Merge all dependencies (direct + indirect)
    const allDependenciesSet = new Set([
      ...dependencySummary.used,
      ...componentDepsSummary.used
    ]);
    
    if (allDependenciesSet.size > 0) {
      Array.from(allDependenciesSet).sort().forEach(dep => {
        const isProtected = isProtectedDependency(dep);
        // Check if it's safe to delete in BOTH contexts (or not present in one)
        // Simplified: it is safe if it is NOT used elsewhere
        const isUsedElsewhereDirect = dependencySummary.usedElsewhere.includes(dep);
        const isUsedElsewhereIndirect = componentDepsSummary.usedElsewhere.includes(dep);
        const isUsedElsewhere = isUsedElsewhereDirect || isUsedElsewhereIndirect;

        let label = '';
        if (isProtected) {
          label = ` ${colorize('(protected)', 'yellow')}`;
        } else if (isUsedElsewhere) {
          label = ` ${colorize('(used elsewhere)', 'blue')}`;
        } else {
          label = ` ${colorize('(safe to delete)', 'red')}`;
        }
        
        console.log(`  • ${dep}${label}`);
      });
    } else {
      console.log(`  • ${colorize('None', 'gray')}`);
    }

    // --- Page Sub-Components Section ---
    console.log(`\n${colorize('- Page Sub-Components:', 'magenta')}`);
    if (componentSummary.pageSubComponents && componentSummary.pageSubComponents.length > 0) {
      componentSummary.pageSubComponents.sort().forEach(subComp => {
        console.log(`  • ${subComp} ${colorize('(will be deleted)', 'red')}`);
      });
    } else {
      console.log(`  • ${colorize('None', 'gray')}`);
    }
    
    // --- Shared Components Section ---
    console.log(`\n${colorize('- Shared Components Used:', 'blue')}`);
    
    // Build set of will-be-deleted group names for quick lookup
    const willBeDeletedGroups = new Set((componentSummary.willBeDeleted || []).map(c => getGroupName(c)));
    const usedElsewhereGroups = new Set(componentSummary.usedElsewhere.map(c => getGroupName(c)));
    
    // Get unique group names from all used components
    const componentGroups = new Set();
    componentSummary.used.forEach(compPath => {
      componentGroups.add(getGroupName(compPath));
    });
    
    if (componentGroups.size > 0) {
      Array.from(componentGroups).sort().forEach(groupName => {
        let label = '';
        
        if (usedElsewhereGroups.has(groupName)) {
          label = ` ${colorize('(used elsewhere)', 'blue')}`;
        } else if (willBeDeletedGroups.has(groupName)) {
          label = ` ${colorize('(safe to delete)', 'red')}`;
        } else {
          // Fallback - shouldn't happen
          label = ` ${colorize('(unknown)', 'yellow')}`; 
        }
        
        console.log(`  • ${groupName}${label}`);
      });
    } else {
      console.log(`  • ${colorize('None', 'gray')}`);
    }
    
    const combinedSafeDeps = Array.from(new Set([
      ...dependencySummary.safeToDelete,
      ...componentDepsSummary.safeToDelete,
    ]));

    console.log('');
    
    // Confirmation (skip if --yes flag is provided)
    if (!skipConfirmation) {
      if (!rl) rl = createPrompt();
      
      const confirm1 = await question(rl, `? Are you sure you want to delete "${pageNameKebab}"? (yes/no): `);
      if (confirm1.toLowerCase() !== 'yes') {
        console.log(`${colorize('❌ Deletion cancelled.', 'red')}`);
        rl.close();
        process.exit(0);
      }
      
      const confirm2 = await question(rl, '? Type the page name again to confirm: ');
      if (confirm2.trim() !== pageNameKebab) {
        console.log(`${colorize('❌ Page name did not match. Deletion cancelled.', 'red')}`);
        rl.close();
        process.exit(0);
      }
    }
    
    console.log(`\n${colorize('🗑️  Deleting page...', 'yellow')}\n`);
    
    // 1. Delete page directory
    fs.rmSync(pagePath, { recursive: true, force: true });
    console.log(`  ${colorize('✅', 'green')} Deleted src/pages/${pageNameKebab}/`);
    
    // 2. Update vite.config.ts
    updateViteConfig(pageNameKebab);
    
    // 3. Check dist folder (in case it was built)
    const distPagePath = path.join(process.cwd(), 'dist', pageNameKebab);
    if (fs.existsSync(distPagePath)) {
      fs.rmSync(distPagePath, { recursive: true, force: true });
      console.log(`  ${colorize('✅', 'green')} Deleted dist/${pageNameKebab}/`);
    }
    
    // 3.5 Delete associated e2e tests
    const deletedTests = deletePageE2eTests(pageNameKebab);
    if (deletedTests.length > 0) {
      deletedTests.forEach(testPath => {
        console.log(`  ${colorize('✅', 'green')} Deleted ${testPath}`);
      });
    }
    
    // 3.6 Delete page sub-component unit tests (tests/unit/pages/[page-name]/)
    const deletedUnitTests = deletePageSubComponentUnitTests(pageNameKebab);
    if (deletedUnitTests.length > 0) {
      deletedUnitTests.forEach(testPath => {
        console.log(`  ${colorize('✅', 'green')} Deleted ${testPath}`);
      });
    }
    
    // 4. Delete unused components if any (including cascade components)
    if (componentSummary.willBeDeleted.length > 0) {
      console.log(`\n${colorize('🧹 Removing unused shared components...', 'yellow')}\n`);
      
      // Build global usage map to verify safety
      const componentUsageMap = buildComponentUsageMap(componentMap, pageUsageMap);
      
      // Get unique group names of exclusive components (directly used by page only)
      const exclusiveGroups = new Set();
      componentSummary.willBeDeleted.forEach(compPath => {
        const groupName = getGroupName(compPath);
        const groupUsage = componentUsageMap.get(groupName);
        
        if (groupUsage) {
          // Check if used in OTHER pages
          const usedInOtherPages = Array.from(groupUsage.usedInPages).some(p => p !== pageNameKebab);
          
          // Check if used by OTHER components (that won't be deleted)
          const usedByOtherComponents = Array.from(groupUsage.usedByComponents).some(
            consumerGroup => {
              const consumerGroupName = getGroupName(consumerGroup);
              // Check if consumer is also exclusive to this page
              const consumerUsage = componentUsageMap.get(consumerGroupName);
              if (!consumerUsage) return true; // Unknown consumer, be safe
              const consumerUsedByOtherPages = Array.from(consumerUsage.usedInPages).some(p => p !== pageNameKebab);
              return consumerUsedByOtherPages; // Only count as "other" if consumer is used elsewhere
            }
          );

          if (!usedInOtherPages && !usedByOtherComponents) {
            exclusiveGroups.add(groupName);
          }
        }
      });

      // Find ALL cascade components recursively using the new function
      const allCascadeComponents = findAllCascadeComponents(
        Array.from(exclusiveGroups), 
        componentUsageMap, 
        pageNameKebab
      );
      
      // Combine exclusive + cascade for full deletion list
      const allComponentsToDelete = [...exclusiveGroups, ...allCascadeComponents];
      
      // Track all deleted components
      const deletedComponents = [];
      
      // Delete exclusive components first
      for (const groupName of exclusiveGroups) {
        const componentType = getComponentTypeFromGroup(groupName);
        const deleted = deleteComponentFolder(groupName, componentType);
        if (deleted) {
          console.log(`  ${colorize('✅', 'green')} Deleted component ${groupName}`);
          deletedComponents.push(groupName);
          // Also delete associated unit tests
          deleteComponentUnitTests(groupName, componentType);
        } else {
          console.log(`  ${colorize('⚠️', 'yellow')} Could not delete component folder ${groupName}`);
        }
      }
      
      // Delete cascade components
      if (allCascadeComponents.length > 0) {
        console.log(`\n${colorize('🔗 Cascade deletion - removing orphaned components...', 'yellow')}\n`);
        
        for (const cascadeGroup of allCascadeComponents) {
          const componentType = getComponentTypeFromGroup(cascadeGroup);
          const deleted = deleteComponentFolder(cascadeGroup, componentType);
          if (deleted) {
            console.log(`  ${colorize('✅', 'green')} Deleted cascade component ${cascadeGroup}`);
            deletedComponents.push(cascadeGroup);
            deleteComponentUnitTests(cascadeGroup, componentType);
          }
        }
      }
    }
    
    // Success message
    console.log(`\n${colorize('✅ Success! Page deleted!', 'green')}\n`);
    
    let nextStepIndex = 1;
    console.log(`${colorize('📝 Next steps:', 'cyan')}`);
    console.log(`  ${nextStepIndex}. Review vite.config.ts to ensure proper cleanup`);
    nextStepIndex++;
    
    if (componentSummary.willBeDeleted.length > 0) {
      console.log(`  ${nextStepIndex}. Confirm removed components are no longer referenced`);
      nextStepIndex++;
    }
    
    const depsToRemove = combinedSafeDeps;
    
    if (depsToRemove.length > 0) {
      console.log(`\n${colorize('📦 Unused dependencies found:', 'yellow')}`);
      depsToRemove.forEach(dep => {
        console.log(`  • ${dep}`);
      });
      
      let shouldUninstallDeps = skipConfirmation;
      if (!skipConfirmation) {
        if (!rl) rl = createPrompt();
        const shouldUninstall = await question(rl, `\n? Remove these ${depsToRemove.length} unused dependencies? (yes/no): `);
        shouldUninstallDeps = shouldUninstall.toLowerCase() === 'yes';
      }
      
      if (shouldUninstallDeps) {
        console.log(`\n${colorize('🗑️  Uninstalling dependencies...', 'yellow')}\n`);
        try {
          // Batch uninstall for efficiency
          const depsString = depsToRemove.join(' ');
          execSync(`npm uninstall ${depsString}`, { 
            stdio: 'inherit',
            cwd: process.cwd()
          });
          console.log(`\n${colorize('✅ Successfully uninstalled dependencies!', 'green')}\n`);
        } catch (error) {
          console.error(`\n${colorize('⚠️  Error uninstalling dependencies:', 'yellow')} ${error.message}`);
          console.log(`${colorize('💡 Tip:', 'cyan')} You can manually uninstall them later:\n`);
          depsToRemove.forEach(dep => {
            console.log(`     npm uninstall ${dep}`);
          });
        }
      } else {
        console.log(`${colorize('ℹ️  Skipping dependency removal.', 'gray')}`);
        console.log(`${colorize('💡 Tip:', 'cyan')} You can uninstall them later:\n`);
        depsToRemove.forEach(dep => {
          console.log(`     npm uninstall ${dep}`);
        });
      }
    }
    
    console.log(`\n${colorize('📝 Next steps:', 'cyan')}`);
    console.log(`  ${nextStepIndex}. Restart dev server if running (npm run dev)`);
    nextStepIndex++;
    console.log(`  ${nextStepIndex}. Rebuild if needed (npm run build)\n`);
    console.log(`${colorize('💡 Tip:', 'cyan')} You can recreate this page anytime with:`);
    console.log(`     ${colorize('npm run create:page', 'bright')}\n`);
    
    if (rl) rl.close();
    
  } catch (error) {
    console.error(`\n${colorize('❌ Error deleting page:', 'red')} ${colorize(error.message, 'red')}`);
    if (rl) rl.close();
    process.exit(1);
  }
}

// Run
deletePage();

