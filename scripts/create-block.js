#!/usr/bin/env node

/**
 * Create Block Script
 * Creates block components in src/components/blocks/
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
Usage: npm run create:block [options]

Options:
  --name=<name>           Block name in kebab-case (required for non-interactive)
  --description=<desc>    Block description (optional)
  --css                   Generate CSS module file (optional)

Examples:
  npm run create:block
  npm run create:block -- --name=hero
  npm run create:block -- --name=navigation --description="Navigation block"
  npm run create:block -- --name=hero --css
`);
}

// Main function
async function createBlock() {
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
      console.log('\n✨ Create New Block (CLI Mode)\n');
      
      componentNameKebab = toKebabCase(args.name);
      
      if (!validateKebabCase(componentNameKebab)) {
        console.error(`❌ ${getKebabCaseError('Block')}`);
        process.exit(1);
      }
      
      componentDescription = args.description || '';
      withCss = args.css === true || args.css === 'true';
      
    } else {
      // Interactive mode
      console.log('\n✨ Create New Block\n');
      
      rl = createPrompt();
      
      // Block name
      const componentName = await question(rl, '? Block name (kebab-case, e.g., hero): ');
      if (!validateKebabCase(componentName.trim())) {
        console.error(`❌ ${getKebabCaseError('Block')}`);
        rl.close();
        process.exit(1);
      }
      
      componentNameKebab = toKebabCase(componentName.trim());
      
      // Block description
      componentDescription = await question(rl, '? Block description (optional): ');
      
      // CSS module
      const cssAnswer = await question(rl, '? Generate CSS module? (y/n): ');
      withCss = cssAnswer.trim().toLowerCase() === 'y' || cssAnswer.trim().toLowerCase() === 'yes';
      
      rl.close();
    }
    
    const componentNamePascal = toPascalCase(componentNameKebab);
    const componentType = 'block';
    
    // Get paths
    const { componentPath, testPath } = getComponentPaths(componentNameKebab, componentType);
    
    // Check if component already exists
    try {
      validateComponentExists(componentPath, componentType);
    } catch (error) {
      console.error(`❌ ${error.message}`);
      process.exit(1);
    }
    
    console.log(`\n📦 Creating block...\n`);
    
    const createdFiles = [];
    
    // Create component directory
    fs.mkdirSync(componentPath, { recursive: true });
    console.log(`  ✅ Created src/components/blocks/${componentNameKebab}/`);
    
    // Generate component file
    const componentFile = generateComponentFile(componentPath, componentNamePascal, componentDescription.trim(), withCss, componentType);
    createdFiles.push(`src/components/blocks/${componentNameKebab}/${componentFile}`);
    console.log(`  ✅ Created src/components/blocks/${componentNameKebab}/${componentFile}`);
    
    // Generate types file
    const typesFile = generateTypesFile(componentPath, componentNamePascal, componentDescription.trim(), componentType);
    createdFiles.push(`src/components/blocks/${componentNameKebab}/${typesFile}`);
    console.log(`  ✅ Created src/components/blocks/${componentNameKebab}/${typesFile}`);
    
    // Generate CSS module if requested
    if (withCss) {
      const cssFile = generateComponentCSSModule(componentPath, componentNamePascal);
      createdFiles.push(`src/components/blocks/${componentNameKebab}/${cssFile}`);
      console.log(`  ✅ Created src/components/blocks/${componentNameKebab}/${cssFile}`);
    }
    
    // Create test directory if needed
    const testDirCreated = ensureDirectoryExists(testPath);
    if (testDirCreated) {
      console.log(`  ✅ Created tests/unit/components/blocks/`);
    }
    
    // Generate test file
    const testFile = generateTestFile(testPath, componentNamePascal, componentNameKebab, componentType);
    createdFiles.push(`tests/unit/components/blocks/${testFile}`);
    console.log(`  ✅ Created tests/unit/components/blocks/${testFile}`);
    
    // Success message
    console.log('\n🎉 Success! Block created!\n');
    console.log('📁 Created files:');
    createdFiles.forEach(file => console.log(`   - ${file}`));
    console.log('\n🚀 Next steps:');
    let stepNum = 1;
    console.log(`  ${stepNum++}. Edit src/components/blocks/${componentNameKebab}/${componentNamePascal}.tsx`);
    console.log(`  ${stepNum++}. Update types in src/components/blocks/${componentNameKebab}/${componentNamePascal}.types.ts`);
    if (withCss) {
      console.log(`  ${stepNum++}. Add styles in src/components/blocks/${componentNameKebab}/${componentNamePascal}.module.css`);
    }
    const importPath = getComponentImportPath(componentNameKebab, componentNamePascal, componentType);
    console.log(`  ${stepNum++}. Import: import ${componentNamePascal} from '${importPath}'`);
    console.log(`  ${stepNum}. Run tests: npm test\n`);
    
  } catch (error) {
    console.error('\n❌ Error creating block:', error.message);
    if (rl) rl.close();
    process.exit(1);
  }
}

// Run
createBlock();

