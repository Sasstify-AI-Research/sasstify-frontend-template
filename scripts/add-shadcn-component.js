#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import {
  parseArgs,
  hasArgs,
  createPrompt,
  question,
  toPascalCase,
  toKebabCase,
  validateKebabCase,
  getKebabCaseError
} from './utils/cli.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Known repositories mapping
function getKnownRepositories() {
  return {
    'default': 'https://ui.shadcn.com',
    'official': 'https://ui.shadcn.com',
    'shadcn': 'https://ui.shadcn.com'
  };
}

// Get repository URL from args or prompt
async function getRepository(args, rl = null) {
  // Check CLI args first
  if (args.registry) {
    return args.registry;
  }
  
  if (args.repo) {
    const knownRepos = getKnownRepositories();
    if (knownRepos[args.repo.toLowerCase()]) {
      return knownRepos[args.repo.toLowerCase()];
    }
    console.warn(`⚠️  Unknown repository "${args.repo}", using default`);
  }
  
  // Interactive mode: prompt for repository
  if (rl) {
    return await promptRepository(rl);
  }
  
  // Default to official shadcn/ui registry
  return null; // null means use default (no --registry flag)
}

// Interactive prompt for repository selection
async function promptRepository(rl) {
  const knownRepos = getKnownRepositories();
  console.log('\n📦 Repository Selection:');
  console.log('  1. Default (shadcn/ui official)');
  console.log('  2. Custom URL');
  
  const answer = await question(rl, '? Select option (1-2): ');
  
  if (answer.trim() === '2') {
    const customUrl = await question(rl, '? Enter custom registry URL: ');
    return customUrl.trim() || null;
  }
  
  return null; // Default
}

// Check if component already exists
function checkComponentExists(componentNameKebab) {
  const componentPath = path.join(process.cwd(), 'src/components/ui', componentNameKebab);
  const flatFilePath = path.join(process.cwd(), 'src/components/ui', `${componentNameKebab}.tsx`);
  
  if (fs.existsSync(componentPath)) {
    return { exists: true, type: 'folder', path: componentPath };
  }
  
  if (fs.existsSync(flatFilePath)) {
    return { exists: true, type: 'flat', path: flatFilePath };
  }
  
  return { exists: false };
}

// Run shadcn CLI to add component
function runShadcnAdd(component, registry = null) {
  return new Promise((resolve, reject) => {
    const args = ['shadcn@latest', 'add', component];
    
    if (registry) {
      args.push('--registry', registry);
    }
    
    console.log(`\n📥 Running: npx ${args.join(' ')}\n`);
    
    const child = spawn('npx', args, {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd()
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`shadcn CLI exited with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Read the generated shadcn component file
function readShadcnComponent(componentNameKebab) {
  const filePath = path.join(process.cwd(), 'src/components/ui', `${componentNameKebab}.tsx`);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Component file not found: ${filePath}`);
  }
  
  return fs.readFileSync(filePath, 'utf-8');
}

// Extract local constants/variables referenced by types
function extractReferencedConstants(typeContent, tsCode) {
  const referencedConstants = [];
  const localIdentifiers = new Map(); // Map of identifier -> full declaration
  
  // Match: const identifier = ... (find start position)
  const constRegex = /const\s+(\w+)\s*=/g;
  let match;
  while ((match = constRegex.exec(tsCode)) !== null) {
    const identifier = match[1];
    const startIndex = match.index;
    
    // Find the complete declaration (handle multi-line)
    let endIndex = startIndex + match[0].length;
    let braceCount = 0;
    let parenCount = 0;
    let inString = false;
    let stringChar = null;
    
    // Skip to the value part
    while (endIndex < tsCode.length && tsCode[endIndex].match(/\s/)) {
      endIndex++;
    }
    
    // Track braces and parens to find the end
    while (endIndex < tsCode.length) {
      const char = tsCode[endIndex];
      const prevChar = endIndex > 0 ? tsCode[endIndex - 1] : '';
      
      // Handle strings
      if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = null;
        }
      }
      
      if (!inString) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
        if (char === '(') parenCount++;
        if (char === ')') parenCount--;
        
        // End of declaration when all braces/parens are closed and we hit semicolon or newline after closing
        if (braceCount === 0 && parenCount === 0 && (char === ';' || (char === '\n' && prevChar === ')'))) {
          endIndex++;
          break;
        }
      }
      
      endIndex++;
    }
    
    const declaration = tsCode.substring(startIndex, endIndex).trim();
    localIdentifiers.set(identifier, { declaration, startIndex, endIndex });
  }
  
  // Match: let identifier = ... or var identifier = ...
  const letVarRegex = /(let|var)\s+(\w+)\s*=/g;
  while ((match = letVarRegex.exec(tsCode)) !== null) {
    const identifier = match[2];
    const startIndex = match.index;
    
    // Similar logic for let/var
    let endIndex = startIndex + match[0].length;
    while (endIndex < tsCode.length && tsCode[endIndex] !== ';') {
      endIndex++;
    }
    endIndex++; // Include semicolon
    
    const declaration = tsCode.substring(startIndex, endIndex).trim();
    localIdentifiers.set(identifier, { declaration, startIndex, endIndex });
  }
  
  // Check if type content references any local identifiers
  for (const [identifier, info] of localIdentifiers) {
    // Check for typeof identifier or identifier in type
    const referencePattern = new RegExp(`(typeof\\s+${identifier}|\\b${identifier}\\b)`, 'g');
    if (referencePattern.test(typeContent)) {
      referencedConstants.push({
        identifier,
        declaration: info.declaration
      });
    }
  }
  
  return referencedConstants;
}

// Extract TypeScript types from component code (including those referencing local constants)
function extractTypes(tsCode, componentNamePascal) {
  const types = [];
  const lines = tsCode.split('\n');
  let currentInterface = null;
  let currentType = null;
  let inInterface = false;
  let braceCount = 0;
  let foundOpeningBrace = false;
  
  // Find exported interfaces and types
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Match: export interface ComponentProps (may span multiple lines, brace may be on different line)
    const interfaceMatch = line.match(/export\s+interface\s+(\w+Props)/);
    if (interfaceMatch && !inInterface) {
      currentInterface = {
        name: interfaceMatch[1],
        lines: [line],
        startLine: i
      };
      inInterface = true;
      foundOpeningBrace = trimmedLine.includes('{');
      if (foundOpeningBrace) {
        braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      } else {
        braceCount = 0; // Will be set when we find opening brace
      }
      continue;
    }
    
    // Match: export type ComponentProps
    const typeMatch = line.match(/export\s+type\s+(\w+Props)\s*=/);
    if (typeMatch && !inInterface) {
      currentType = {
        name: typeMatch[1],
        lines: [line],
        startLine: i
      };
      // Type aliases usually end on same line or next few lines
      let j = i;
      while (j < lines.length && !lines[j].trim().endsWith(';')) {
        j++;
        if (j < lines.length) currentType.lines.push(lines[j]);
      }
      const typeContent = currentType.lines.join('\n');
      // Extract referenced constants
      const referencedConstants = extractReferencedConstants(typeContent, tsCode);
      types.push({
        name: currentType.name,
        content: typeContent,
        referencedConstants
      });
      currentType = null;
      continue;
    }
    
    // Continue collecting interface lines
    if (inInterface && currentInterface) {
      currentInterface.lines.push(line);
      
      // Check if we found the opening brace
      if (!foundOpeningBrace && trimmedLine.includes('{')) {
        foundOpeningBrace = true;
        braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      } else if (foundOpeningBrace) {
        braceCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      }
      
      // Interface ends when braceCount reaches 0 (after finding opening brace)
      if (foundOpeningBrace && braceCount === 0) {
        const typeContent = currentInterface.lines.join('\n');
        // Extract referenced constants
        const referencedConstants = extractReferencedConstants(typeContent, tsCode);
        types.push({
          name: currentInterface.name,
          content: typeContent,
          referencedConstants
        });
        currentInterface = null;
        inInterface = false;
        foundOpeningBrace = false;
      }
    }
  }
  
  // Handle case where interface wasn't closed properly (shouldn't happen, but safety)
  if (inInterface && currentInterface) {
    const typeContent = currentInterface.lines.join('\n');
    const referencedConstants = extractReferencedConstants(typeContent, tsCode);
    types.push({
      name: currentInterface.name,
      content: typeContent,
      referencedConstants
    });
  }
  
  return types;
}

// Extract styles and detect if CSS module needed
function extractStyles(tsCode) {
  const hasStyles = {
    needsCSSModule: false,
    hasInlineStyles: false,
    classNamePatterns: []
  };
  
  // Check if component actually uses CSS module syntax (styles.className)
  const cssModuleUsageRegex = /styles\.\w+/g;
  if (cssModuleUsageRegex.test(tsCode)) {
    hasStyles.needsCSSModule = true;
  }
  
  // Check for custom CSS classes that aren't Tailwind utilities
  // Tailwind classes are utility classes and don't need CSS modules
  // Only create CSS module if there are actual custom styles needed
  
  // Check for inline styles (these might need CSS modules for better organization)
  if (tsCode.includes('style=') || tsCode.includes('style:')) {
    hasStyles.hasInlineStyles = true;
    // Inline styles could be moved to CSS module, but don't auto-create
    // Only create if explicitly needed or if there's CSS module usage
  }
  
  // Check for CSS imports (if already importing CSS, might need module)
  if (tsCode.includes("import.*from.*\\.css") || tsCode.match(/import\s+.*from\s+['"].*\.css['"]/)) {
    hasStyles.needsCSSModule = true;
  }
  
  return hasStyles;
}

// Generate CSS module file
function generateComponentCSSModule(componentPath, componentNamePascal) {
  const content = `/* ${componentNamePascal} Component Styles */

.container {
  /* Add your styles here */
}
`;
  
  fs.writeFileSync(path.join(componentPath, `${componentNamePascal}.module.css`), content);
  return `${componentNamePascal}.module.css`;
}

// Ensure directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
  }
  return false;
}

// Remove extracted types and referenced constants from component code
function removeTypesFromCode(tsCode, types) {
  let updatedCode = tsCode;
  const constantsToRemove = new Set();
  
  // Collect all constants that need to be removed
  for (const type of types) {
    if (type.referencedConstants) {
      for (const constant of type.referencedConstants) {
        constantsToRemove.add(constant.identifier);
      }
    }
  }
  
  // Remove each extracted type/interface from the code (process in reverse to maintain indices)
  for (let t = types.length - 1; t >= 0; t--) {
    const type = types[t];
    const typeName = type.name;
    
    // Normalize whitespace for comparison
    const normalizedTypeContent = type.content.replace(/\s+/g, ' ').trim();
    const normalizedCode = updatedCode.replace(/\s+/g, ' ');
    
    // Try exact match first (normalized)
    const exactMatchIndex = normalizedCode.indexOf(normalizedTypeContent);
    if (exactMatchIndex !== -1) {
      // Find the actual position in original code by counting characters (approximate)
      // This is a simplified approach - for exact match, use the original content
      if (updatedCode.includes(type.content)) {
        const realIndex = updatedCode.indexOf(type.content);
        updatedCode = updatedCode.substring(0, realIndex) + 
                     updatedCode.substring(realIndex + type.content.length);
      }
    } else {
      // Find the start of the type definition using regex
      const typeStartPattern = new RegExp(
        `export\\s+(interface|type)\\s+${typeName}[^\\n\\{]*`,
        'm'
      );
      
      const startMatch = updatedCode.match(typeStartPattern);
      if (startMatch) {
        const startIndex = updatedCode.indexOf(startMatch[0]);
        // Find the end of the type (closing brace)
        let searchIndex = startIndex;
        let braceCount = 0;
        let foundOpeningBrace = false;
        let endIndex = -1;
        
        // Search for opening brace starting from the match
        while (searchIndex < updatedCode.length && searchIndex < startIndex + 500) {
          const char = updatedCode[searchIndex];
          
          if (char === '{') {
            braceCount++;
            foundOpeningBrace = true;
          } else if (char === '}') {
            braceCount--;
            if (foundOpeningBrace && braceCount === 0) {
              endIndex = searchIndex + 1;
              break;
            }
          }
          searchIndex++;
        }
        
        if (endIndex !== -1) {
          // Remove the type definition
          const before = updatedCode.substring(0, startIndex);
          let after = updatedCode.substring(endIndex);
          // Remove one trailing newline if present
          if (after.startsWith('\n')) {
            after = after.substring(1);
          }
          updatedCode = before + after;
        }
      }
    }
  }
  
  // Remove referenced constants
  for (const constantId of constantsToRemove) {
    // Match: const identifier = ... or let/var identifier = ...
    const constPattern = new RegExp(`(const|let|var)\\s+${constantId}\\s*=[^;]+(?:[^;]*\\([^)]*\\)[^;]*)*[^;]*;?`, 'g');
    const multiLinePattern = new RegExp(`(const|let|var)\\s+${constantId}\\s*=[\\s\\S]*?\\)\\s*;?`, 'g');
    
    // Try multi-line match first (for cva calls)
    if (multiLinePattern.test(updatedCode)) {
      updatedCode = updatedCode.replace(multiLinePattern, '');
    } else if (constPattern.test(updatedCode)) {
      updatedCode = updatedCode.replace(constPattern, '');
    }
  }
  
  // Clean up extra blank lines (3+ consecutive newlines -> 2)
  updatedCode = updatedCode.replace(/\n{3,}/g, '\n\n');
  // Remove leading blank lines at start of file
  updatedCode = updatedCode.replace(/^\n+/, '');
  
  return updatedCode;
}

// Remove unused imports after constants/types are moved
function removeUnusedImports(tsCode, types) {
  let updatedCode = tsCode;
  
  // Check if we moved any constants that use cva or types that use VariantProps
  let movedCvaUsage = false;
  let movedVariantPropsUsage = false;
  
  for (const type of types) {
    // Check if moved constants use cva
    if (type.referencedConstants) {
      for (const constant of type.referencedConstants) {
        if (constant.declaration.includes('cva(')) {
          movedCvaUsage = true;
        }
      }
    }
    // Check if moved types use VariantProps
    if (type.content.includes('VariantProps')) {
      movedVariantPropsUsage = true;
    }
  }
  
  // Check for imports from 'class-variance-authority'
  const cvaImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]class-variance-authority['"];?/g;
  let match;
  const matches = [];
  
  // Collect all matches first
  while ((match = cvaImportRegex.exec(tsCode)) !== null) {
    matches.push({
      fullMatch: match[0],
      importsStr: match[1],
      index: match.index
    });
  }
  
  // Process matches in reverse order to maintain indices
  for (let i = matches.length - 1; i >= 0; i--) {
    const { fullMatch, importsStr } = matches[i];
    const imports = importsStr.split(',').map(i => i.trim()).filter(Boolean);
    
    // Check if imports are still used in remaining code (after removal)
    let usesCva = false;
    let usesVariantProps = false;
    
    // Check if cva is used in remaining code (not in moved constants)
    if (imports.some(imp => imp.includes('cva') && !imp.includes('type'))) {
      const cvaPattern = /\bcva\s*\(/;
      usesCva = cvaPattern.test(updatedCode);
    }
    
    // Check if VariantProps is used in remaining code (not in moved types)
    if (imports.some(imp => imp.includes('VariantProps'))) {
      const variantPropsPattern = /\bVariantProps\s*</;
      usesVariantProps = variantPropsPattern.test(updatedCode);
    }
    
    // If neither cva nor VariantProps are used, remove the entire import
    if (!usesCva && !usesVariantProps) {
      updatedCode = updatedCode.substring(0, matches[i].index) + 
                   updatedCode.substring(matches[i].index + fullMatch.length);
    } else {
      // Filter out unused imports
      const remainingImports = imports.filter(imp => {
        const isCva = imp.includes('cva') && !imp.includes('type');
        const isVariantProps = imp.includes('VariantProps');
        return (isCva && usesCva) || (isVariantProps && usesVariantProps);
      });
      
      if (remainingImports.length === 0) {
        // Remove entire import if nothing left
        updatedCode = updatedCode.substring(0, matches[i].index) + 
                     updatedCode.substring(matches[i].index + fullMatch.length);
      } else if (remainingImports.length < imports.length) {
        // Replace with filtered imports
        const newImport = `import { ${remainingImports.join(', ')} } from 'class-variance-authority';`;
        updatedCode = updatedCode.substring(0, matches[i].index) + 
                     newImport + 
                     updatedCode.substring(matches[i].index + fullMatch.length);
      }
    }
  }
  
  // Clean up extra blank lines
  updatedCode = updatedCode.replace(/\n{3,}/g, '\n\n');
  updatedCode = updatedCode.replace(/^\n+/, '');
  
  return updatedCode;
}

// Update component imports
function updateComponentImports(tsCode, componentNamePascal, types, hasStyles) {
  let updatedCode = tsCode;
  
  // Find the last import statement
  const importRegex = /^import\s+.*?;?\n/gm;
  const imports = updatedCode.match(importRegex) || [];
  const lastImportIndex = updatedCode.lastIndexOf(imports[imports.length - 1] || '');
  
  // Collect all imports needed
  const importsToAdd = [];
  const constantsToImport = new Set();
  
  // Add types imports (one per Props type, or single file if only one)
  if (types.length > 0) {
    if (types.length === 1) {
      // Single Props type - use main types file
      const type = types[0];
      const imports = [`${componentNamePascal}Props`];
      
      // Add referenced constants to imports
      if (type.referencedConstants && type.referencedConstants.length > 0) {
        for (const constant of type.referencedConstants) {
          imports.push(constant.identifier);
          constantsToImport.add(constant.identifier);
        }
      }
      
      importsToAdd.push(`import { ${imports.join(', ')} } from './${componentNamePascal}.types';\n`);
    } else {
      // Multiple Props types - create separate imports
      for (const type of types) {
        const typeFileName = `${type.name}.types`;
        const imports = [type.name];
        
        // Add referenced constants to imports
        if (type.referencedConstants && type.referencedConstants.length > 0) {
          for (const constant of type.referencedConstants) {
            imports.push(constant.identifier);
            constantsToImport.add(constant.identifier);
          }
        }
        
        importsToAdd.push(`import { ${imports.join(', ')} } from './${typeFileName}';\n`);
      }
    }
  }
  
  // Add all imports
  if (importsToAdd.length > 0) {
    const allImports = importsToAdd.join('');
    if (lastImportIndex !== -1) {
      const insertPos = lastImportIndex + (imports[imports.length - 1]?.length || 0);
      updatedCode = updatedCode.slice(0, insertPos) + allImports + updatedCode.slice(insertPos);
    } else {
      updatedCode = allImports + updatedCode;
    }
  }
  
  // Add exports for constants that were moved to types file
  if (constantsToImport.size > 0) {
    // Find export statement
    const exportMatch = updatedCode.match(/export\s+\{([^}]+)\}/);
    if (exportMatch) {
      // Get existing exports and check for duplicates
      const existingExports = exportMatch[1].split(',').map(e => e.trim()).filter(Boolean);
      const newConstants = Array.from(constantsToImport).filter(c => !existingExports.includes(c));
      
      if (newConstants.length > 0) {
        // Add only new constants to existing export
        const constantsList = newConstants.join(', ');
        updatedCode = updatedCode.replace(/export\s+\{([^}]+)\}/, `export { $1, ${constantsList} }`);
      }
    } else {
      // Add new export statement before component export
      const constantsList = Array.from(constantsToImport).join(', ');
      const exportStatement = `export { ${constantsList} };\n\n`;
      const lastExportIndex = updatedCode.lastIndexOf('export');
      if (lastExportIndex !== -1) {
        updatedCode = updatedCode.slice(0, lastExportIndex) + exportStatement + updatedCode.slice(lastExportIndex);
      } else {
        updatedCode += `\n${exportStatement}`;
      }
    }
  }
  
  // Add CSS module import only if CSS module is actually needed
  if (hasStyles && hasStyles.needsCSSModule) {
    const cssImport = `import styles from './${componentNamePascal}.module.css';\n`;
    // Re-find last import after potential types import addition
    const updatedImports = updatedCode.match(importRegex) || [];
    const updatedLastImportIndex = updatedCode.lastIndexOf(updatedImports[updatedImports.length - 1] || '');
    if (updatedLastImportIndex !== -1) {
      const insertPos = updatedLastImportIndex + (updatedImports[updatedImports.length - 1]?.length || 0);
      updatedCode = updatedCode.slice(0, insertPos) + cssImport + updatedCode.slice(insertPos);
    } else {
      updatedCode = cssImport + updatedCode;
    }
  }
  
  return updatedCode;
}

// Generate types file content with imports, constants, exports, and Props type
function generateTypesFileContent(type) {
  let typesContent = '';
  
  // Determine needed imports
  const needsReactImport = type.content.includes('React.') || type.content.includes('ReactNode');
  const needsVariantPropsImport = type.content.includes('VariantProps');
  const needsCvaImport = type.referencedConstants && 
    type.referencedConstants.some(c => c.declaration.includes('cva('));
  
  // Add imports
  if (needsReactImport || needsVariantPropsImport || needsCvaImport) {
    if (needsReactImport) {
      typesContent += "import * as React from 'react';\n";
    }
    if (needsVariantPropsImport || needsCvaImport) {
      typesContent += "import { cva, type VariantProps } from 'class-variance-authority';\n";
    }
    typesContent += '\n';
  }
  
  // Add referenced constants declarations
  if (type.referencedConstants && type.referencedConstants.length > 0) {
    const constantsContent = type.referencedConstants
      .map(c => c.declaration)
      .join('\n\n');
    typesContent += constantsContent + '\n\n';
    
    // Export the constants (FIX: Add missing exports)
    const constantNames = type.referencedConstants.map(c => c.identifier).join(', ');
    typesContent += `export { ${constantNames} };\n\n`;
  }
  
  // Add Props interface/type
  typesContent += type.content;
  
  return typesContent;
}

// Reorganize component to folder structure
function reorganizeToFolder(componentNameKebab, componentNamePascal, tsCode, types, hasStyles) {
  const componentDir = path.join(process.cwd(), 'src/components/ui', componentNameKebab);
  const flatFilePath = path.join(process.cwd(), 'src/components/ui', `${componentNameKebab}.tsx`);
  
  // Create folder
  ensureDirectoryExists(componentDir);
  
  const typesPaths = [];
  
  // Write types files (one per Props type if multiple, or single file if one)
  if (types.length > 0) {
    if (types.length === 1) {
      // Single Props type - use main types file
      const type = types[0];
      const typesContent = generateTypesFileContent(type);
      const typesPath = path.join(componentDir, `${componentNamePascal}.types.ts`);
      fs.writeFileSync(typesPath, typesContent);
      typesPaths.push(typesPath);
    } else {
      // Multiple Props types - create separate files
      for (const type of types) {
        const typesContent = generateTypesFileContent(type);
        const typesPath = path.join(componentDir, `${type.name}.types.ts`);
        fs.writeFileSync(typesPath, typesContent);
        typesPaths.push(typesPath);
      }
    }
  }
  
  // Write CSS module only if actually needed (CSS module usage or custom styles)
  // Don't create for Tailwind utility classes alone
  if (hasStyles.needsCSSModule) {
    generateComponentCSSModule(componentDir, componentNamePascal);
  }
  
  // Remove extracted types and constants from component code
  let codeWithoutTypes = tsCode;
  if (types.length > 0) {
    codeWithoutTypes = removeTypesFromCode(tsCode, types);
    // Remove unused imports after moving constants/types
    codeWithoutTypes = removeUnusedImports(codeWithoutTypes, types);
  }
  
  // Update component code with imports
  const updatedCode = updateComponentImports(
    codeWithoutTypes,
    componentNamePascal,
    types,
    hasStyles.needsCSSModule
  );
  
  // Write component file
  const componentPath = path.join(componentDir, `${componentNamePascal}.tsx`);
  fs.writeFileSync(componentPath, updatedCode);
  
  // Delete original flat file
  if (fs.existsSync(flatFilePath)) {
    fs.unlinkSync(flatFilePath);
  }
  
  return {
    componentPath,
    typesPaths: typesPaths.length > 0 ? typesPaths : null,
    cssPath: (hasStyles.hasTailwind || hasStyles.hasInlineStyles) 
      ? path.join(componentDir, `${componentNamePascal}.module.css`) 
      : null
  };
}

// Generate test file (reuse pattern from create-component.js)
function generateUIComponentTest(testPath, componentNamePascal, componentNameKebab, hasNamedExport = true) {
  // Try both named and default export patterns
  const importStatement = hasNamedExport 
    ? `import { ${componentNamePascal} } from '@/components/ui/${componentNameKebab}/${componentNamePascal}';`
    : `import ${componentNamePascal} from '@/components/ui/${componentNameKebab}/${componentNamePascal}';`;
  
  const content = `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
${importStatement}

describe('${componentNamePascal}', () => {
  it('renders without crashing', () => {
    render(<${componentNamePascal} />);
  });

  it('renders children correctly', () => {
    render(<${componentNamePascal}>Test Content</${componentNamePascal}>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<${componentNamePascal} className="custom-class">Content</${componentNamePascal}>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
`;
  
  fs.writeFileSync(path.join(testPath, `${componentNamePascal}.test.tsx`), content);
  return `${componentNamePascal}.test.tsx`;
}

// Display summary
function displaySummary(componentNameKebab, componentNamePascal, files) {
  console.log('\n🎉 Success! Component adapted!\n');
  console.log('📁 Created files:');
  console.log(`   - ${files.componentPath}`);
  if (files.typesPaths && files.typesPaths.length > 0) {
    if (files.typesPaths.length === 1) {
      console.log(`   - ${files.typesPaths[0]}`);
    } else {
      console.log(`   - ${files.typesPaths.length} types files:`);
      files.typesPaths.forEach(path => console.log(`     • ${path}`));
    }
  }
  if (files.cssPath) {
    console.log(`   - ${files.cssPath}`);
  }
  if (files.testPath) {
    console.log(`   - ${files.testPath}`);
  }
  
  console.log('\n🚀 Next steps:');
  console.log(`  1. Import: import { ${componentNamePascal} } from '@/components/ui/${componentNameKebab}/${componentNamePascal}'`);
  console.log(`  2. Customize component in ${files.componentPath}`);
  if (files.typesPaths && files.typesPaths.length > 0) {
    if (files.typesPaths.length === 1) {
      console.log(`  3. Update types in ${files.typesPaths[0]}`);
    } else {
      console.log(`  3. Update types in ${files.typesPaths.length} separate types files`);
    }
  }
  if (files.cssPath) {
    console.log(`  4. Add styles in ${files.cssPath}`);
  }
  console.log(`  5. Run tests: npm test\n`);
}

// Print usage
function printUsage() {
  console.log(`
Usage: npm run add:shadcn [component] [options]

Options:
  --registry=<url>      Custom shadcn registry URL
  --repo=<name>         Repository name (default, official, shadcn)
  --help, -h            Show this help message

Examples:
  npm run add:shadcn button
  npm run add:shadcn button card dialog
  npm run add:shadcn button --registry=https://github.com/custom/shadcn-registry
  npm run add:shadcn button --repo=official
`);
}

// Main function
async function addShadcnComponent() {
  const args = parseArgs();
  
  // Show help
  if (args.help || args.h) {
    printUsage();
    process.exit(0);
  }
  
  // Get component names from args (everything that's not a flag)
  const components = process.argv.slice(2).filter(arg => 
    !arg.startsWith('--') && arg !== '-h'
  );
  
  if (components.length === 0) {
    console.error('❌ Error: Component name(s) required');
    printUsage();
    process.exit(1);
  }
  
  try {
    // Process each component
    for (const componentName of components) {
      const componentNameKebab = toKebabCase(componentName);
      
      // Validate component name
      if (!validateKebabCase(componentNameKebab)) {
        console.error(`❌ ${getKebabCaseError('Component')}`);
        continue;
      }
      
      // Check if component already exists
      const exists = checkComponentExists(componentNameKebab);
      if (exists.exists && exists.type === 'folder') {
        console.error(`❌ Component "${componentNameKebab}" already exists in adapted structure at ${exists.path}`);
        continue;
      }
      
      // Get repository (skip prompt if CLI args provided, use default)
      let registry = null;
      if (args.registry) {
        registry = args.registry;
      } else if (args.repo) {
        const knownRepos = getKnownRepositories();
        registry = knownRepos[args.repo.toLowerCase()] || null;
      }
      // If no registry specified, use default (null = no --registry flag)
      
      console.log(`\n✨ Adapting shadcn component: ${componentNameKebab}\n`);
      
      // Run shadcn CLI
      try {
        await runShadcnAdd(componentNameKebab, registry);
      } catch (error) {
        console.error(`❌ Failed to add component via shadcn CLI: ${error.message}`);
        continue;
      }
      
      // Read generated component
      let tsCode;
      try {
        tsCode = readShadcnComponent(componentNameKebab);
      } catch (error) {
        console.error(`❌ Failed to read component file: ${error.message}`);
        continue;
      }
      
      const componentNamePascal = toPascalCase(componentNameKebab);
      
      // Extract types (only if they don't reference local constants)
      const types = extractTypes(tsCode, componentNamePascal);
      
      // Log if types were skipped due to local constant references
      if (types.length === 0) {
        // Check if there are any Props interfaces/types that weren't extracted
        const propsMatch = tsCode.match(/export\s+(interface|type)\s+(\w+Props)/);
        if (propsMatch) {
          console.log(`ℹ️  Types kept inline (references local constants - no circular dependency)`);
        }
      }
      
      // Extract styles
      const hasStyles = extractStyles(tsCode);
      
      // Reorganize to folder structure
      const files = reorganizeToFolder(componentNameKebab, componentNamePascal, tsCode, types, hasStyles);
      
      // Generate test file
      const testPath = path.join(process.cwd(), 'tests/unit/components/ui');
      ensureDirectoryExists(testPath);
      // Check if component uses named export (shadcn components typically do)
      const hasNamedExport = tsCode.includes(`export { ${componentNamePascal}`) || 
                            tsCode.includes(`export const ${componentNamePascal}`) ||
                            tsCode.includes(`export function ${componentNamePascal}`);
      const testFile = generateUIComponentTest(testPath, componentNamePascal, componentNameKebab, hasNamedExport);
      files.testPath = path.join(testPath, testFile);
      
      // Display summary
      displaySummary(componentNameKebab, componentNamePascal, files);
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run
addShadcnComponent();

