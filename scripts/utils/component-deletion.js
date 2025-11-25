/**
 * Shared deletion utilities for components
 */

import fs from 'fs';
import path from 'path';
import { toPascalCase } from './cli.js';
import { 
  isBlockComponent,
  loadPackageDependencies,
  isProtectedDependency 
} from '../analyze-utils.js';

/**
 * Delete a component folder
 * @param {string} groupName - Component group name (e.g., "header", "ui/accordion", "blocks/layout")
 * @param {string} componentType - Component type ('regular', 'ui', 'block')
 * @returns {boolean} True if deleted successfully
 */
export function deleteComponentFolder(groupName, componentType) {
  const folderPath = path.join(process.cwd(), 'src/components', groupName);
  
  if (fs.existsSync(folderPath)) {
    if (fs.statSync(folderPath).isDirectory()) {
      fs.rmSync(folderPath, { recursive: true, force: true });
      return true;
    } else {
      // It's a single file component
      fs.unlinkSync(folderPath);
      return true;
    }
  }
  
  // Try with common extensions
  const extensions = ['.tsx', '.ts', '.jsx', '.js'];
  for (const ext of extensions) {
    const filePath = folderPath + ext;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
  }
  
  return false;
}

/**
 * Delete associated unit tests for a component
 * @param {string} groupName - Component group name
 * @param {string} componentType - Component type ('regular', 'ui', 'block')
 * @returns {string[]} Array of deleted test file paths (relative to project root)
 */
export function deleteComponentUnitTests(groupName, componentType) {
  const deletedTests = [];
  const testsDir = path.join(process.cwd(), 'tests/unit/components');
  
  // Determine component name and test paths based on type
  let componentName;
  const testPaths = [];
  
  if (componentType === 'block') {
    // Extract block name from groupName (e.g., "blocks/layout" -> "layout")
    const blockName = groupName.replace('blocks/', '');
    componentName = toPascalCase(blockName);
    testPaths.push(path.join(testsDir, 'blocks', `${componentName}.test.tsx`));
    testPaths.push(path.join(testsDir, 'blocks', `${componentName}.test.ts`));
  } else if (componentType === 'ui') {
    // Extract UI component name (e.g., "ui/accordion" -> "accordion")
    const uiName = groupName.replace('ui/', '');
    componentName = toPascalCase(uiName);
    testPaths.push(path.join(testsDir, 'ui', `${componentName}.test.tsx`));
    testPaths.push(path.join(testsDir, 'ui', `${componentName}.test.ts`));
  } else {
    componentName = toPascalCase(groupName);
    testPaths.push(path.join(testsDir, `${componentName}.test.tsx`));
    testPaths.push(path.join(testsDir, `${componentName}.test.ts`));
  }
  
  // Delete test files if they exist
  for (const testPath of testPaths) {
    if (fs.existsSync(testPath)) {
      fs.unlinkSync(testPath);
      deletedTests.push(path.relative(process.cwd(), testPath));
    }
  }
  
  // Clean up empty directories if needed
  if (componentType === 'block') {
    const blockTestDir = path.join(testsDir, 'blocks');
    if (fs.existsSync(blockTestDir)) {
      try {
        const files = fs.readdirSync(blockTestDir);
        if (files.length === 0) {
          fs.rmdirSync(blockTestDir);
        }
      } catch (e) {
        // Ignore errors
      }
    }
  } else if (componentType === 'ui') {
    const uiTestDir = path.join(testsDir, 'ui');
    if (fs.existsSync(uiTestDir)) {
      try {
        const files = fs.readdirSync(uiTestDir);
        if (files.length === 0) {
          fs.rmdirSync(uiTestDir);
        }
      } catch (e) {
        // Ignore errors
      }
    }
  }
  
  return deletedTests;
}

/**
 * Find npm dependencies that are only used by the components being deleted
 * @param {string|string[]} componentsToDelete - Single component or array of components being deleted
 * @param {Map} componentUsageMap - Map of component groups with their usage data
 * @param {Map|null} pageUsageMap - Optional map of pages with their dependencies (to exclude page-used deps)
 * @returns {string[]} List of dependencies safe to uninstall
 */
export function findUnusedDependencies(componentsToDelete, componentUsageMap, pageUsageMap = null) {
  const packageDeps = loadPackageDependencies();
  
  // Normalize to array
  const componentsArray = Array.isArray(componentsToDelete) ? componentsToDelete : [componentsToDelete];
  const componentsSet = new Set(componentsArray);
  
  // Collect all dependencies from all components being deleted
  const allDepsToCheck = new Set();
  for (const comp of componentsArray) {
    const compData = componentUsageMap.get(comp);
    if (compData && compData.dependencies) {
      for (const dep of compData.dependencies) {
        allDepsToCheck.add(dep);
      }
    }
  }
  
  if (allDepsToCheck.size === 0) {
    return [];
  }
  
  const unusedDeps = [];
  
  // For each dependency from all components being deleted
  for (const dep of allDepsToCheck) {
    // Skip protected dependencies
    if (isProtectedDependency(dep)) continue;
    
    // Skip if not in package.json
    if (!packageDeps.has(dep)) continue;
    
    // Check if any OTHER component (not being deleted) uses this dependency
    let usedElsewhere = false;
    
    for (const [groupName, groupData] of componentUsageMap.entries()) {
      // Skip components that are being deleted
      if (componentsSet.has(groupName)) continue;
      
      if (groupData.dependencies.has(dep)) {
        usedElsewhere = true;
        break;
      }
    }
    
    // Also check if any page uses this dependency directly
    if (!usedElsewhere && pageUsageMap) {
      for (const [pageName, pageData] of pageUsageMap.entries()) {
        // pageData.dependencies is an array, not a Set
        if (pageData.dependencies && pageData.dependencies.includes(dep)) {
          usedElsewhere = true;
          break;
        }
      }
    }
    
    if (!usedElsewhere) {
      unusedDeps.push(dep);
    }
  }
  
  return unusedDeps;
}

/**
 * Find components that are only used by the component being deleted
 * @param {string} selectedGroup - The component group being deleted
 * @param {Map} componentUsageMap - Map of component groups with their usage data
 * @returns {string[]} List of component groups safe to cascade delete
 */
export function findUnusedComponents(selectedGroup, componentUsageMap) {
  const selectedGroupData = componentUsageMap.get(selectedGroup);
  
  if (!selectedGroupData || selectedGroupData.usedComponents.size === 0) {
    return [];
  }
  
  const unusedComponents = [];
  
  // For each component used by the component being deleted
  for (const usedComp of selectedGroupData.usedComponents) {
    const usedCompData = componentUsageMap.get(usedComp);
    
    if (!usedCompData) continue;
    
    // Check if this component is used by any OTHER component
    const usedByOthers = Array.from(usedCompData.usedByComponents).filter(
      comp => comp !== selectedGroup
    );
    
    // Check if this component is used in any page
    const usedInPages = usedCompData.usedInPages.size > 0;
    
    // If only used by the component being deleted, it's safe to cascade delete
    if (usedByOthers.length === 0 && !usedInPages) {
      unusedComponents.push(usedComp);
    }
  }
  
  return unusedComponents;
}

/**
 * Find ALL components that become unused when given components are deleted (recursive)
 * This handles multi-level cascade: if A uses B uses C, and A is deleted,
 * then B becomes orphaned, then C becomes orphaned.
 * Also handles circular references: if A uses B and B uses A, both become orphaned.
 * 
 * @param {string[]} deletedComponents - Array of components being deleted
 * @param {Map} componentUsageMap - Map of component groups with their usage data
 * @param {string} pageName - The page being deleted (to exclude from usage checks)
 * @returns {string[]} List of ALL component groups safe to cascade delete (in deletion order)
 */
export function findAllCascadeComponents(deletedComponents, componentUsageMap, pageName = null) {
  const allCascade = [];
  const deletedSet = new Set(deletedComponents);
  
  // Collect all components that are directly or indirectly used by deleted components
  const potentialOrphans = new Set();
  const visited = new Set();
  
  function collectUsedComponents(comp) {
    if (visited.has(comp)) return;
    visited.add(comp);
    
    const compData = componentUsageMap.get(comp);
    if (!compData || !compData.usedComponents) return;
    
    for (const usedComp of compData.usedComponents) {
      if (!deletedSet.has(usedComp)) {
        potentialOrphans.add(usedComp);
        collectUsedComponents(usedComp);
      }
    }
  }
  
  // Collect all potential orphans from deleted components
  for (const deletedComp of deletedSet) {
    collectUsedComponents(deletedComp);
  }
  
  // First pass: identify which potential orphans DEFINITELY survive
  // (they have external usage that's not being deleted)
  const survivors = new Set();
  
  function hasExternalUsage(comp) {
    const compData = componentUsageMap.get(comp);
    if (!compData) return false;
    
    // Check if used by any OTHER page (not the one being deleted)
    if (pageName) {
      if (Array.from(compData.usedInPages).some(p => p !== pageName)) return true;
    } else {
      if (compData.usedInPages.size > 0) return true;
    }
    
    // Check if used by any component that's NOT being deleted AND NOT a potential orphan
    // (external components that are definitely surviving)
    for (const consumer of compData.usedByComponents) {
      if (!deletedSet.has(consumer) && !potentialOrphans.has(consumer)) {
        return true;
      }
    }
    
    return false;
  }
  
  // Mark all potential orphans with external usage as survivors
  for (const orphan of potentialOrphans) {
    if (hasExternalUsage(orphan)) {
      survivors.add(orphan);
    }
  }
  
  // Second pass: propagate survival - if a component is used by a survivor, it survives too
  let changed = true;
  while (changed) {
    changed = false;
    for (const orphan of potentialOrphans) {
      if (survivors.has(orphan)) continue;
      
      const compData = componentUsageMap.get(orphan);
      if (!compData) continue;
      
      // If any of our consumers is a survivor, we survive too
      for (const consumer of compData.usedByComponents) {
        if (survivors.has(consumer)) {
          survivors.add(orphan);
          changed = true;
          break;
        }
      }
    }
  }
  
  // Third pass: anything in potentialOrphans that's NOT a survivor is orphaned
  for (const orphan of potentialOrphans) {
    if (!survivors.has(orphan) && !deletedSet.has(orphan)) {
      allCascade.push(orphan);
      deletedSet.add(orphan);
    }
  }
  
  return allCascade;
}

/**
 * Get the component type from a group name
 * @param {string} groupName - Component group name
 * @returns {string} 'block', 'ui', or 'regular'
 */
export function getComponentTypeFromGroup(groupName) {
  if (groupName.startsWith('blocks/')) return 'block';
  if (groupName.startsWith('ui/')) return 'ui';
  return 'regular';
}

