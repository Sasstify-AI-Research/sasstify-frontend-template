#!/usr/bin/env node

/**
 * Create Regular Component Script
 * Creates regular components in src/components/
 */

import fs from 'fs';
import path from 'path';
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
import {
  ensureDirectoryExists,
  generateComponentCSSModule,
  validateComponentExists,
  getComponentPaths,
  getComponentImportPath
} from './utils/component-utils.js';
import {
  generateComponentFile,
  generateTypesFile,
  generateTestFile
} from './utils/component-generators.js';

function printUsage() {
  console.log(`
Usage: npm run create:component [options]

Options:
  --name=<name>           Component name in kebab-case (required for non-interactive)
  --description=<desc>    Component description (optional)
  --css                   Generate CSS module file (optional)

Examples:
  npm run create:component
  npm run create:component -- --name=user-card
  npm run create:component -- --name=user-card --description="User card component"
  npm run create:component -- --name=card --css
`);
}

// Main function
async function createComponent() {
  const args = parseArgs();
  
  // Show help
  if (args.help || args.h) {
    printUsage();
    process.exit(0);
  }
  
  let rl = null;
  
  try {
    let componentNameKebab, componentDescription, withCss;
    
    if (hasArgs() && args.name) {
      // Non-interactive mode with CLI arguments
      console.log('\n✨ Create New Component (CLI Mode)\n');
      
      componentNameKebab = toKebabCase(args.name);
      
      if (!validateKebabCase(componentNameKebab)) {
        console.error(`❌ ${getKebabCaseError('Component')}`);
        process.exit(1);
      }
      
      componentDescription = args.description || '';
      withCss = args.css === true || args.css === 'true';
      
    } else {
      // Interactive mode
      console.log('\n✨ Create New Component\n');
      
      rl = createPrompt();
      
      // Component name
      const componentName = await question(rl, '? Component name (kebab-case, e.g., user-card): ');
      if (!validateKebabCase(componentName.trim())) {
        console.error(`❌ ${getKebabCaseError('Component')}`);
        rl.close();
        process.exit(1);
      }
      
      componentNameKebab = toKebabCase(componentName.trim());
      
      // Component description
      componentDescription = await question(rl, '? Component description (optional): ');
      
      // CSS module
      const cssAnswer = await question(rl, '? Generate CSS module? (y/n): ');
      withCss = cssAnswer.trim().toLowerCase() === 'y' || cssAnswer.trim().toLowerCase() === 'yes';
      
      rl.close();
    }
    
    const componentNamePascal = toPascalCase(componentNameKebab);
    const componentType = 'regular';
    
    // Get paths
    const { componentPath, testPath } = getComponentPaths(componentNameKebab, componentType);
    
    // Check if component already exists
    try {
      validateComponentExists(componentPath, componentType);
    } catch (error) {
      console.error(`❌ ${error.message}`);
      process.exit(1);
    }
    
    console.log(`\n📦 Creating component...\n`);
    
    const createdFiles = [];
    
    // Create component directory
    fs.mkdirSync(componentPath, { recursive: true });
    console.log(`  ✅ Created src/components/${componentNameKebab}/`);
    
    // Generate component file
    const componentFile = generateComponentFile(componentPath, componentNamePascal, componentDescription.trim(), withCss, componentType);
    createdFiles.push(`src/components/${componentNameKebab}/${componentFile}`);
    console.log(`  ✅ Created src/components/${componentNameKebab}/${componentFile}`);
    
    // Generate types file
    const typesFile = generateTypesFile(componentPath, componentNamePascal, componentDescription.trim(), componentType);
    createdFiles.push(`src/components/${componentNameKebab}/${typesFile}`);
    console.log(`  ✅ Created src/components/${componentNameKebab}/${typesFile}`);
    
    // Generate CSS module if requested
    if (withCss) {
      const cssFile = generateComponentCSSModule(componentPath, componentNamePascal);
      createdFiles.push(`src/components/${componentNameKebab}/${cssFile}`);
      console.log(`  ✅ Created src/components/${componentNameKebab}/${cssFile}`);
    }
    
    // Create test directory if needed
    const testDirCreated = ensureDirectoryExists(testPath);
    if (testDirCreated) {
      console.log(`  ✅ Created tests/unit/components/`);
    }
    
    // Generate test file
    const testFile = generateTestFile(testPath, componentNamePascal, componentNameKebab, componentType);
    createdFiles.push(`tests/unit/components/${testFile}`);
    console.log(`  ✅ Created tests/unit/components/${testFile}`);
    
    // Success message
    console.log('\n🎉 Success! Component created!\n');
    console.log('📁 Created files:');
    createdFiles.forEach(file => console.log(`   - ${file}`));
    console.log('\n🚀 Next steps:');
    let stepNum = 1;
    console.log(`  ${stepNum++}. Edit src/components/${componentNameKebab}/${componentNamePascal}.tsx`);
    console.log(`  ${stepNum++}. Update types in src/components/${componentNameKebab}/${componentNamePascal}.types.ts`);
    if (withCss) {
      console.log(`  ${stepNum++}. Add styles in src/components/${componentNameKebab}/${componentNamePascal}.module.css`);
    }
    const importPath = getComponentImportPath(componentNameKebab, componentNamePascal, componentType);
    console.log(`  ${stepNum++}. Import: import ${componentNamePascal} from '${importPath}'`);
    console.log(`  ${stepNum}. Run tests: npm test\n`);
    
  } catch (error) {
    console.error('\n❌ Error creating component:', error.message);
    if (rl) rl.close();
    process.exit(1);
  }
}

// Run
createComponent();
