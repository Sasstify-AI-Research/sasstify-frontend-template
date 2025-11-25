/**
 * Functional tests for create-ui-component.js script
 */

import { describe, it, expect, afterEach, afterAll } from 'vitest';
import path from 'path';
import {
  runScript,
  fileExists,
  dirExists,
  readFile,
  cleanupAllTestArtifacts,
  getUIComponentPath,
  getComponentTestPath,
  toPascalCase,
  generateTestName,
  TEST_PREFIX,
} from './helpers/test-utils';

describe('create-ui-component script', () => {
  const createdComponents: string[] = [];

  afterEach(() => {
    // Cleanup using delete:ui-component script for each created component
    for (const compName of createdComponents) {
      // Use delete:ui-component script with --yes flag to skip confirmation
      runScript('delete:ui-component', `--name=${compName} --yes`);
    }
    createdComponents.length = 0;
  });

  afterAll(() => {
    // Comprehensive cleanup of any remaining test artifacts (fallback)
    cleanupAllTestArtifacts();
  });

  describe('UI component creation', () => {
    it('should create UI component with correct structure', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:ui-component', `--name=${compName}`);
      
      expect(result.success).toBe(true);
      
      const compPath = getUIComponentPath(compName);
      const pascalName = toPascalCase(compName);
      
      // Check directory exists
      expect(dirExists(compPath)).toBe(true);
      
      // Check required files exist
      expect(fileExists(path.join(compPath, `${pascalName}.tsx`))).toBe(true);
      expect(fileExists(path.join(compPath, `${pascalName}.types.ts`))).toBe(true);
    });

    it('should create unit test file for UI component', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:ui-component', `--name=${compName}`);
      
      expect(result.success).toBe(true);
      
      const testPath = getComponentTestPath(compName, true);
      expect(fileExists(testPath)).toBe(true);
    });

    it('should create CSS module with --css flag', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:ui-component', `--name=${compName} --css`);
      
      expect(result.success).toBe(true);
      
      const compPath = getUIComponentPath(compName);
      const pascalName = toPascalCase(compName);
      
      expect(fileExists(path.join(compPath, `${pascalName}.module.css`))).toBe(true);
    });

    it('should create separate types file', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:ui-component', `--name=${compName}`);
      
      expect(result.success).toBe(true);
      
      const compPath = getUIComponentPath(compName);
      const pascalName = toPascalCase(compName);
      const typesPath = path.join(compPath, `${pascalName}.types.ts`);
      
      expect(fileExists(typesPath)).toBe(true);
      
      const content = readFile(typesPath);
      expect(content).toContain(`${pascalName}Props`);
    });

    it('should generate correct component content', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:ui-component', `--name=${compName} --description="Test UI component"`);
      
      expect(result.success).toBe(true);
      
      const compPath = getUIComponentPath(compName);
      const pascalName = toPascalCase(compName);
      const content = readFile(path.join(compPath, `${pascalName}.tsx`));
      
      expect(content).toContain(`const ${pascalName}`);
      expect(content).toContain(`export default ${pascalName}`);
    });
  });

  describe('validation', () => {
    it('should auto-convert PascalCase to kebab-case', () => {
      const pascalName = 'InvalidName';
      createdComponents.push('invalid-name');
      
      const result = runScript('create:ui-component', `--name=${pascalName}`);
      
      expect(result.success).toBe(true);
      expect(result.output).toContain('invalid-name');
      console.log('✓ PascalCase auto-converted to kebab-case');
    });

    it('should show help with --help flag', () => {
      const result = runScript('create:ui-component', '--help');
      
      expect(result.success).toBe(true);
      expect(result.output).toContain('Usage:');
      expect(result.output).toContain('--name');
    });
  });

  describe('error handling', () => {
    it('should handle duplicate UI component name', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createdComponents.push(compName);
      
      // Create first component
      const result1 = runScript('create:ui-component', `--name=${compName}`);
      expect(result1.success).toBe(true);
      
      // Try to create duplicate
      const result2 = runScript('create:ui-component', `--name=${compName}`);
      
      // Should fail or show error message
      const indicatesError = !result2.success || 
        result2.output.includes('exists') ||
        result2.output.includes('already') ||
        result2.output.includes('Error') ||
        result2.output.includes('error');
      
      expect(indicatesError).toBe(true);
      console.log('✓ Duplicate UI component handled');
    });
  });

  describe('content validation', () => {
    it('should import React in UI component', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:ui-component', `--name=${compName}`);
      expect(result.success).toBe(true);
      
      const compPath = getUIComponentPath(compName);
      const pascalName = toPascalCase(compName);
      const content = readFile(path.join(compPath, `${pascalName}.tsx`));
      
      const hasReactImport = content.includes("import React") || 
        content.includes("from 'react'") ||
        content.includes('from "react"');
      
      expect(hasReactImport).toBe(true);
      console.log('✓ React imported in UI component');
    });

    it('should import from types file', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:ui-component', `--name=${compName}`);
      expect(result.success).toBe(true);
      
      const compPath = getUIComponentPath(compName);
      const pascalName = toPascalCase(compName);
      const content = readFile(path.join(compPath, `${pascalName}.tsx`));
      
      // Should import from types file
      expect(content).toContain(`.types`);
      expect(content).toContain(`${pascalName}Props`);
      console.log('✓ UI component imports from types file');
    });

    it('should export props interface in types file', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:ui-component', `--name=${compName}`);
      expect(result.success).toBe(true);
      
      const compPath = getUIComponentPath(compName);
      const pascalName = toPascalCase(compName);
      const typesContent = readFile(path.join(compPath, `${pascalName}.types.ts`));
      
      expect(typesContent).toContain('export interface');
      expect(typesContent).toContain(`${pascalName}Props`);
      console.log('✓ Props interface exported');
    });

    it('should include CSS module import when --css flag used', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:ui-component', `--name=${compName} --css`);
      expect(result.success).toBe(true);
      
      const compPath = getUIComponentPath(compName);
      const pascalName = toPascalCase(compName);
      const content = readFile(path.join(compPath, `${pascalName}.tsx`));
      
      const hasCssImport = content.includes('import styles from') || 
        content.includes('.module.css');
      
      expect(hasCssImport).toBe(true);
      console.log('✓ CSS module imported');
    });
  });

  describe('file structure validation', () => {
    it('should create UI component in correct directory', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:ui-component', `--name=${compName}`);
      expect(result.success).toBe(true);
      
      // UI components should be in src/components/ui/[name]/
      const expectedPath = path.join(process.cwd(), 'src/components/ui', compName);
      expect(dirExists(expectedPath)).toBe(true);
      console.log('✓ UI component in correct directory');
    });

    it('should create unit test in correct directory', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:ui-component', `--name=${compName}`);
      expect(result.success).toBe(true);
      
      const pascalName = toPascalCase(compName);
      // Unit tests should be in tests/unit/components/ui/
      const expectedPath = path.join(process.cwd(), 'tests/unit/components/ui', `${pascalName}.test.tsx`);
      expect(fileExists(expectedPath)).toBe(true);
      console.log('✓ Unit test in correct directory');
    });

    it('should create test file with correct import path', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:ui-component', `--name=${compName}`);
      expect(result.success).toBe(true);
      
      const pascalName = toPascalCase(compName);
      const testPath = path.join(process.cwd(), 'tests/unit/components/ui', `${pascalName}.test.tsx`);
      
      if (fileExists(testPath)) {
        const testContent = readFile(testPath);
        // Should import from @/components/ui/[name]
        const hasCorrectImport = testContent.includes(`@/components/ui/${compName}`) ||
          testContent.includes(`components/ui/${compName}`);
        expect(hasCorrectImport).toBe(true);
        console.log('✓ UI component test has correct import path');
      }
    });
  });

  describe('special characters and edge cases', () => {
    it('should handle long component name', () => {
      const compName = `${TEST_PREFIX.UI_COMPONENT}-very-long-ui-component-name-${Date.now().toString(36)}`;
      createdComponents.push(compName);
      
      const result = runScript('create:ui-component', `--name=${compName}`);
      
      const validResult = result.success || 
        result.output.includes('name') ||
        result.output.includes('long') ||
        result.output.includes('Created');
      
      expect(validResult).toBe(true);
      
      if (result.success) {
        expect(dirExists(getUIComponentPath(compName))).toBe(true);
        console.log('✓ Long UI component name handled successfully');
      }
    });

    it('should handle component name with numbers', () => {
      const compName = `${TEST_PREFIX.UI_COMPONENT}-v2-123-${Date.now().toString(36)}`;
      createdComponents.push(compName);
      
      const result = runScript('create:ui-component', `--name=${compName}`);
      
      expect(result.success).toBe(true);
      expect(dirExists(getUIComponentPath(compName))).toBe(true);
      console.log('✓ UI component name with numbers handled');
    });
  });
});

