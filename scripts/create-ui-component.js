#!/usr/bin/env node

/**
 * Create UI Component Script
 * Creates UI components in src/components/ui/
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
Usage: npm run create:ui-component [options]

Options:
  --name=<name>           UI component name in kebab-case (required for non-interactive)
  --description=<desc>    Component description (optional)
  --css                   Generate CSS module file (optional)

Examples:
  npm run create:ui-component
  npm run create:ui-component -- --name=accordion
  npm run create:ui-component -- --name=accordion --description="Collapsible accordion"
  npm run create:ui-component -- --name=button --css
`);
}

// Main function
async function createUIComponent() {
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
      console.log('\n✨ Create New UI Component (CLI Mode)\n');
      
      componentNameKebab = toKebabCase(args.name);
      
      if (!validateKebabCase(componentNameKebab)) {
        console.error(`❌ ${getKebabCaseError('UI Component')}`);
        process.exit(1);
      }
      
      componentDescription = args.description || '';
      withCss = args.css === true || args.css === 'true';
      
    } else {
      // Interactive mode
      console.log('\n✨ Create New UI Component\n');
      
      rl = createPrompt();
      
      // Component name
      const componentName = await question(rl, '? UI component name (kebab-case, e.g., accordion): ');
      if (!validateKebabCase(componentName.trim())) {
        console.error(`❌ ${getKebabCaseError('UI Component')}`);
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
    const componentType = 'ui';
    
    // Get paths
    const { componentPath, testPath } = getComponentPaths(componentNameKebab, componentType);
    
    // Check if component already exists
    try {
      validateComponentExists(componentPath, componentType);
    } catch (error) {
      console.error(`❌ ${error.message}`);
      process.exit(1);
    }
    
    console.log(`\n📦 Creating UI component...\n`);
    
    const createdFiles = [];
    
    // Create component directory
    fs.mkdirSync(componentPath, { recursive: true });
    console.log(`  ✅ Created src/components/ui/${componentNameKebab}/`);
    
    // Generate component file
    const componentFile = generateComponentFile(componentPath, componentNamePascal, componentDescription.trim(), withCss, componentType);
    createdFiles.push(`src/components/ui/${componentNameKebab}/${componentFile}`);
    console.log(`  ✅ Created src/components/ui/${componentNameKebab}/${componentFile}`);
    
    // Generate types file
    const typesFile = generateTypesFile(componentPath, componentNamePascal, componentDescription.trim(), componentType);
    createdFiles.push(`src/components/ui/${componentNameKebab}/${typesFile}`);
    console.log(`  ✅ Created src/components/ui/${componentNameKebab}/${typesFile}`);
    
    // Generate CSS module if requested
    if (withCss) {
      const cssFile = generateComponentCSSModule(componentPath, componentNamePascal);
      createdFiles.push(`src/components/ui/${componentNameKebab}/${cssFile}`);
      console.log(`  ✅ Created src/components/ui/${componentNameKebab}/${cssFile}`);
    }
    
    // Create test directory if needed
    const testDirCreated = ensureDirectoryExists(testPath);
    if (testDirCreated) {
      console.log(`  ✅ Created tests/unit/components/ui/`);
    }
    
    // Generate test file
    const testFile = generateTestFile(testPath, componentNamePascal, componentNameKebab, componentType);
    createdFiles.push(`tests/unit/components/ui/${testFile}`);
    console.log(`  ✅ Created tests/unit/components/ui/${testFile}`);
    
    // Success message
    console.log('\n🎉 Success! UI component created!\n');
    console.log('📁 Created files:');
    createdFiles.forEach(file => console.log(`   - ${file}`));
    console.log('\n🚀 Next steps:');
    let stepNum = 1;
    console.log(`  ${stepNum++}. Edit src/components/ui/${componentNameKebab}/${componentNamePascal}.tsx`);
    console.log(`  ${stepNum++}. Update types in src/components/ui/${componentNameKebab}/${componentNamePascal}.types.ts`);
    if (withCss) {
      console.log(`  ${stepNum++}. Add styles in src/components/ui/${componentNameKebab}/${componentNamePascal}.module.css`);
    }
    const importPath = getComponentImportPath(componentNameKebab, componentNamePascal, componentType);
    console.log(`  ${stepNum++}. Import: import ${componentNamePascal} from '${importPath}'`);
    console.log(`  ${stepNum}. Run tests: npm test\n`);
    
  } catch (error) {
    console.error('\n❌ Error creating UI component:', error.message);
    if (rl) rl.close();
    process.exit(1);
  }
}

// Run
createUIComponent();

