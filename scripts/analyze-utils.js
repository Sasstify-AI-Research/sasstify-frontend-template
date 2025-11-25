#!/usr/bin/env node

/**
 * Shared utility functions for analyze scripts
 * Used by: analyze-components.js, analyze-pages.js, analyze-deps.js, 
 *          analyze-page-components.js, delete-component.js, delete-page.js, 
 *          delete-page-component.js
 */

import fs from 'fs';
import path from 'path';

// --- Configuration ---

export const PROTECTED_DEPENDENCIES = new Set([
  'react',
  'react-dom',
  'class-variance-authority',
  'clsx',
  'react-icons',
  'lucide-react',
  'tailwind-merge',
  'tailwind-variants',
  '@tanstack/react-query'
]);

export function isProtectedDependency(dependency) {
  return PROTECTED_DEPENDENCIES.has(dependency);
}

// --- Console Colors ---

export const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

export function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

// --- Data Loading ---

/**
 * Load package.json dependencies
 */
export function loadPackageDependencies() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) return new Set();
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  return new Set([
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {})
  ]);
}

/**
 * Extract NPM imports from a file
 */
export function extractImports(filePath) {
  if (!fs.existsSync(filePath)) return [];
  
  const content = fs.readFileSync(filePath, 'utf8');
  const imports = new Set();
  
  const importPatterns = [
    /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\w+))?|\w+)?\s+from\s+['"]([^'"]+)['"]/g,
    /import\s+['"]([^'"]+)['"]/g,
    /import\s*\(\s*['"]([^'"]+)['"]/g,
    /require\s*\(\s*['"]([^'"]+)['"]/g,
  ];
  
  importPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const importPath = match[1].trim();
      if (importPath && !importPath.startsWith('.') && !importPath.startsWith('/') && !importPath.startsWith('@/')) {
        const packageName = importPath.split('/')[0].startsWith('@') 
          ? importPath.split('/').slice(0, 2).join('/')
          : importPath.split('/')[0];
        imports.add(packageName);
      }
    }
  });
  
  return Array.from(imports);
}

/**
 * Extract component imports from @/components/*
 */
export function extractComponentImports(filePath) {
  if (!fs.existsSync(filePath)) return [];
  
  const content = fs.readFileSync(filePath, 'utf8');
  const components = new Set();
  
  const componentImportPatterns = [
    /import\s+(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\w+))?\s+from\s+['"]@\/components\/([^'"]+)['"]/g,
    /import\s+['"]@\/components\/([^'"]+)['"]/g,
    /import\s*\(\s*['"]@\/components\/([^'"]+)['"]/g,
    /import\s+(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\w+))?\s+from\s+['"](\.{1,2}[^'"]*)['"]/g,
    /import\s+['"](\.{1,2}[^'"]*)['"]/g
  ];
  
  componentImportPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const componentPath = match[1].trim();
      
      if (componentPath.startsWith('./') || componentPath.startsWith('../')) {
        const resolvedPath = path.resolve(path.dirname(filePath), componentPath);
        const componentsDir = path.join(process.cwd(), 'src/components');
        if (resolvedPath.startsWith(componentsDir)) {
          const normalizedPath = path.relative(componentsDir, resolvedPath)
            .replace(/\.(tsx?|jsx?)$/, '')
            .replace(/\\/g, '/');
          components.add(normalizedPath);
        }
        continue;
      }

      const normalizedPath = componentPath
        .replace(/\.(tsx?|jsx?)$/, '')
        .replace(/\\/g, '/');
      components.add(normalizedPath);
    }
  });
  
  return Array.from(components);
}

// --- Directory Scanning ---

/**
 * Recursively scan directory for all files to find NPM imports
 */
export function scanDirectoryForImports(dirPath, extensions = ['.ts', '.tsx', '.js', '.jsx', '.css']) {
  const imports = new Set();
  if (!fs.existsSync(dirPath)) return imports;
  
  function scanDir(currentPath) {
    const items = fs.readdirSync(currentPath);
    items.forEach(item => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.includes(ext)) {
          const fileImports = extractImports(fullPath);
          fileImports.forEach(imp => imports.add(imp));
        }
      }
    });
  }
  
  scanDir(dirPath);
  return imports;
}

/**
 * Recursively scan directory for component imports
 */
export function scanDirectoryForComponents(dirPath) {
  const components = new Set();
  if (!fs.existsSync(dirPath)) return components;
  
  function scanDir(currentPath) {
    const items = fs.readdirSync(currentPath);
    items.forEach(item => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (['.ts', '.tsx', '.js', '.jsx', '.css'].includes(ext)) {
          const fileComponents = extractComponentImports(fullPath);
          fileComponents.forEach(comp => components.add(comp));
        }
      }
    });
  }
  
  scanDir(dirPath);
  return components;
}

/**
 * Resolve component file path
 */
export function getComponentFilePath(componentPath) {
  const componentsDir = path.join(process.cwd(), 'src/components');
  const fullPath = path.join(componentsDir, componentPath);
  const possibleExtensions = ['.tsx', '.ts', '.jsx', '.js'];
  
  for (const ext of possibleExtensions) {
    const filePath = `${fullPath}${ext}`;
    if (fs.existsSync(filePath)) return filePath;
  }
  
  for (const ext of possibleExtensions) {
    const indexPath = path.join(fullPath, `index${ext}`);
    if (fs.existsSync(indexPath)) return indexPath;
  }
  
  return null;
}

// --- Build Functions ---

/**
 * Build closure by following only the components imported directly/indirectly by a page
 */
export function buildComponentClosure(initialComponents) {
  const closure = new Set();
  const queue = [...initialComponents];
  
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || closure.has(current)) continue;
    
    closure.add(current);
    
    const filePath = getComponentFilePath(current);
    if (!filePath) continue;
    
    const nestedComponents = extractComponentImports(filePath);
    nestedComponents.forEach(nested => {
      if (!closure.has(nested)) queue.push(nested);
    });
  }
  
  return closure;
}

/**
 * Build Component Map (all components in src/components)
 */
export function buildComponentMap() {
  const componentsDir = path.join(process.cwd(), 'src/components');
  const componentMap = new Map();

  if (!fs.existsSync(componentsDir)) return componentMap;

  function walk(dir) {
    fs.readdirSync(dir).forEach((entry) => {
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);

      if (stat.isDirectory()) {
        walk(full);
        return;
      }

      const ext = path.extname(entry);
      if (!['.ts', '.tsx', '.js', '.jsx', '.css'].includes(ext)) return;

      const relative = path
        .relative(componentsDir, full)
        .replace(/\.(tsx?|jsx?|css)$/, '')
        .replace(/\\/g, '/');

      componentMap.set(relative, full);
    });
  }

  walk(componentsDir);
  return componentMap;
}

/**
 * Build Page Usage Map (all pages with their dependencies and components)
 */
export function buildPageUsageMap() {
  const pagesDir = path.join(process.cwd(), 'src/pages');
  if (!fs.existsSync(pagesDir)) return new Map();
  
  const pageDirs = fs.readdirSync(pagesDir).filter((entry) => {
    const fullPath = path.join(pagesDir, entry);
    return fs.statSync(fullPath).isDirectory();
  });
  
  const pageMap = new Map();
  
  pageDirs.forEach((page) => {
    const pagePath = path.join(pagesDir, page);
    const pageImports = scanDirectoryForImports(pagePath);
    const directComponents = scanDirectoryForComponents(pagePath);
    const componentClosure = buildComponentClosure(Array.from(directComponents));
    const uiComponents = Array.from(componentClosure).filter((comp) => comp.startsWith('ui/'));
    
    // Collect dependencies from all used components
    componentClosure.forEach(comp => {
      const compFilePath = getComponentFilePath(comp);
      if (compFilePath) {
        const compDeps = extractImports(compFilePath);
        compDeps.forEach(dep => pageImports.add(dep));
      }
    });

    pageMap.set(page, {
      dependencies: Array.from(pageImports),
      components: Array.from(componentClosure),
      uiComponents,
    });
  });
  
  return pageMap;
}

/**
 * Build Component Usage Map (Groups components and collects usage info)
 */
export function buildComponentUsageMap(componentMap, pageUsageMap = new Map()) {
  const components = Array.from(componentMap.entries());
  const componentGroups = new Map();

  // Helper to determine group name (reuse exported function)
  // Note: This uses the same logic as exported getGroupName() but kept local for consistency
  function getGroupNameLocal(path) {
    if (path.startsWith('blocks/')) {
      const parts = path.split('/');
      return parts.length > 1 ? `${parts[0]}/${parts[1]}` : path;
    }
    if (path.startsWith('ui/')) {
      const parts = path.split('/');
      return parts.length > 1 ? `${parts[0]}/${parts[1]}` : path;
    }
    const parts = path.split('/');
    if (parts.length > 1) return parts[0];
    return path;
  }

  components.forEach(([componentPath, fullPath]) => {
    const groupName = getGroupNameLocal(componentPath);
    
    if (!componentGroups.has(groupName)) {
      componentGroups.set(groupName, {
        files: [],
        dependencies: new Set(),
        usedComponents: new Set(),
        usedInPages: new Set(),
        usedByComponents: new Set()
      });
    }
    
    const group = componentGroups.get(groupName);
    group.files.push({ componentPath, fullPath });

    // 1. Collect NPM Dependencies
    const deps = extractImports(fullPath);
    deps.forEach(dep => group.dependencies.add(dep));

    // 2. Collect Used Components
    const compImports = extractComponentImports(fullPath);
    compImports.forEach(compImport => {
      const importedGroupName = getGroupNameLocal(compImport);
      if (importedGroupName !== groupName) {
        group.usedComponents.add(importedGroupName);
      }
    });

    // 3. Collect Used In Pages
    if (pageUsageMap.size > 0) {
      for (const [pageName, usage] of pageUsageMap.entries()) {
         const pageUsesThisGroup = usage.components.some(usedCompPath => {
             return getGroupNameLocal(usedCompPath) === groupName;
         });
         
         if (pageUsesThisGroup) {
             group.usedInPages.add(pageName);
         }
      }
    }
  });

  // 4. Populate Used By Components (Reverse lookup)
  componentGroups.forEach((groupData, groupName) => {
    groupData.usedComponents.forEach(usedCompName => {
      if (componentGroups.has(usedCompName)) {
        componentGroups.get(usedCompName).usedByComponents.add(groupName);
      }
    });
  });

  return componentGroups;
}

/**
 * Check if a component path is a block component
 */
export function isBlockComponent(componentPath) {
  return componentPath.startsWith('blocks/');
}

/**
 * Get component type: "regular" | "ui" | "block"
 */
export function getComponentType(componentPath) {
  if (isBlockComponent(componentPath)) return 'block';
  if (componentPath.startsWith('ui/')) return 'ui';
  return 'regular';
}

/**
 * Extract block name from a component path
 */
export function getBlockName(componentPath) {
  if (!isBlockComponent(componentPath)) return null;
  const parts = componentPath.split('/');
  return parts.length > 1 ? parts[1] : null;
}

/**
 * Get group name for a component path
 */
export function getGroupName(componentPath) {
  if (componentPath.startsWith('blocks/')) {
    const parts = componentPath.split('/');
    return parts.length > 1 ? `${parts[0]}/${parts[1]}` : componentPath;
  }
  if (componentPath.startsWith('ui/')) {
    const parts = componentPath.split('/');
    return parts.length > 1 ? `${parts[0]}/${parts[1]}` : componentPath;
  }
  const parts = componentPath.split('/');
  if (parts.length > 1) return parts[0];
  return componentPath;
}


