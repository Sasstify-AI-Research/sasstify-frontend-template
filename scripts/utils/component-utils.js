/**
 * Shared utilities for component creation and deletion
 */

import fs from 'fs';
import path from 'path';

/**
 * Ensure directory exists, creating it if necessary
 * @param {string} dirPath - Directory path
 * @returns {boolean} True if directory was created, false if it already existed
 */
export function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
  }
  return false;
}

/**
 * Generate CSS module file
 * @param {string} componentPath - Component directory path
 * @param {string} componentNamePascal - Component name in PascalCase
 * @returns {string} Created filename
 */
export function generateComponentCSSModule(componentPath, componentNamePascal) {
  const content = `/* ${componentNamePascal} Component Styles */

.container {
  /* Add your styles here */
}
`;
  
  fs.writeFileSync(path.join(componentPath, `${componentNamePascal}.module.css`), content);
  return `${componentNamePascal}.module.css`;
}

/**
 * Validate if component already exists
 * @param {string} componentPath - Component directory path
 * @param {string} componentType - Component type ('regular', 'ui', 'block')
 * @throws {Error} If component already exists
 */
export function validateComponentExists(componentPath, componentType) {
  if (fs.existsSync(componentPath)) {
    const typeLabel = componentType === 'block' ? 'Block' : (componentType === 'ui' ? 'UI component' : 'Component');
    throw new Error(`${typeLabel} already exists at ${componentPath}!`);
  }
}

/**
 * Get component paths based on type
 * @param {string} componentNameKebab - Component name in kebab-case
 * @param {string} componentType - Component type ('regular', 'ui', 'block')
 * @returns {{componentPath: string, testPath: string}} Paths object
 */
export function getComponentPaths(componentNameKebab, componentType) {
  const baseDir = path.join(process.cwd(), 'src/components');
  let componentPath;
  let testPath;
  
  if (componentType === 'block') {
    componentPath = path.join(baseDir, 'blocks', componentNameKebab);
    testPath = path.join(process.cwd(), 'tests/unit/components/blocks');
  } else if (componentType === 'ui') {
    componentPath = path.join(baseDir, 'ui', componentNameKebab);
    testPath = path.join(process.cwd(), 'tests/unit/components/ui');
  } else {
    componentPath = path.join(baseDir, componentNameKebab);
    testPath = path.join(process.cwd(), 'tests/unit/components');
  }
  
  return { componentPath, testPath };
}

/**
 * Format success message with created files
 * @param {string} componentName - Component name
 * @param {string} componentType - Component type ('regular', 'ui', 'block')
 * @param {string[]} createdFiles - Array of created file paths
 * @returns {string} Formatted message
 */
export function formatSuccessMessage(componentName, componentType, createdFiles) {
  const typeLabel = componentType === 'block' ? 'Block' : (componentType === 'ui' ? 'UI component' : 'Component');
  let message = `\n🎉 Success! ${typeLabel} created!\n\n`;
  message += '📁 Created files:\n';
  createdFiles.forEach(file => message += `   - ${file}\n`);
  return message;
}

/**
 * Get import path for component based on type
 * @param {string} componentNameKebab - Component name in kebab-case
 * @param {string} componentNamePascal - Component name in PascalCase
 * @param {string} componentType - Component type ('regular', 'ui', 'block')
 * @returns {string} Import path
 */
export function getComponentImportPath(componentNameKebab, componentNamePascal, componentType) {
  if (componentType === 'block') {
    return `@/components/blocks/${componentNameKebab}/${componentNamePascal}`;
  } else if (componentType === 'ui') {
    return `@/components/ui/${componentNameKebab}/${componentNamePascal}`;
  } else {
    return `@/components/${componentNameKebab}/${componentNamePascal}`;
  }
}

