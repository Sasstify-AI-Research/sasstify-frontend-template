/**
 * Functional tests for create-component.js script (regular components only)
 */

import { describe, it, expect, afterEach, afterAll } from 'vitest';
import path from 'path';
import {
  runScript,
  fileExists,
  dirExists,
  readFile,
  cleanupAllTestArtifacts,
  getComponentPath,
  getComponentTestPath,
  toPascalCase,
  generateTestName,
  TEST_PREFIX,
} from './helpers/test-utils';

describe('create-component script (regular components)', () => {
  const createdComponents: string[] = [];

  afterEach(() => {
    // Cleanup using delete:component script for each created component
    for (const compName of createdComponents) {
      // Use delete:component script with --yes flag to skip confirmation
      runScript('delete:component', `--name=${compName} --yes`);
    }
    createdComponents.length = 0;
  });

  afterAll(() => {
    // Comprehensive cleanup of any remaining test artifacts (fallback)
    cleanupAllTestArtifacts();
  });

  describe('component creation', () => {
    it('should create regular component with correct structure', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:component', `--name=${compName}`);
      
      expect(result.success).toBe(true);
      
      const compPath = getComponentPath(compName);
      const pascalName = toPascalCase(compName);
      
      // Check directory exists
      expect(dirExists(compPath)).toBe(true);
      
      // Check required files exist
      expect(fileExists(path.join(compPath, `${pascalName}.tsx`))).toBe(true);
      expect(fileExists(path.join(compPath, `${pascalName}.types.ts`))).toBe(true);
    });

    it('should create unit test file for regular component', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:component', `--name=${compName}`);
      
      expect(result.success).toBe(true);
      
      const testPath = getComponentTestPath(compName, false);
      expect(fileExists(testPath)).toBe(true);
    });

    it('should create CSS module with --css flag', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:component', `--name=${compName} --css`);
      
      expect(result.success).toBe(true);
      
      const compPath = getComponentPath(compName);
      const pascalName = toPascalCase(compName);
      
      expect(fileExists(path.join(compPath, `${pascalName}.module.css`))).toBe(true);
    });

    it('should generate correct component content', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:component', `--name=${compName} --description="Test component"`);
      
      expect(result.success).toBe(true);
      
      const compPath = getComponentPath(compName);
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
      
      const result = runScript('create:component', `--name=${pascalName}`);
      
      expect(result.success).toBe(true);
      expect(result.output).toContain('invalid-name');
      console.log('✓ PascalCase auto-converted to kebab-case');
    });

    it('should show help with --help flag', () => {
      const result = runScript('create:component', '--help');
      
      expect(result.success).toBe(true);
      expect(result.output).toContain('Usage:');
      expect(result.output).toContain('--name');
    });
  });

  describe('error handling', () => {
    it('should handle duplicate component name', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      createdComponents.push(compName);
      
      // Create first component
      const result1 = runScript('create:component', `--name=${compName}`);
      expect(result1.success).toBe(true);
      
      // Try to create duplicate
      const result2 = runScript('create:component', `--name=${compName}`);
      
      // Should fail or show error message
      const indicatesError = !result2.success || 
        result2.output.includes('exists') ||
        result2.output.includes('already') ||
        result2.output.includes('Error') ||
        result2.output.includes('error');
      
      expect(indicatesError).toBe(true);
      console.log('✓ Duplicate component handled');
    });
  });

  describe('content validation', () => {
    it('should import React in component', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:component', `--name=${compName}`);
      expect(result.success).toBe(true);
      
      const compPath = getComponentPath(compName);
      const pascalName = toPascalCase(compName);
      const content = readFile(path.join(compPath, `${pascalName}.tsx`));
      
      // Should import React
      const hasReactImport = content.includes("import React") || 
        content.includes("from 'react'") ||
        content.includes('from "react"');
      
      expect(hasReactImport).toBe(true);
      console.log('✓ React imported');
    });

    it('should export props interface in types file', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:component', `--name=${compName}`);
      expect(result.success).toBe(true);
      
      const compPath = getComponentPath(compName);
      const pascalName = toPascalCase(compName);
      const typesContent = readFile(path.join(compPath, `${pascalName}.types.ts`));
      
      // Should have export interface for props
      expect(typesContent).toContain('export interface');
      expect(typesContent).toContain(`${pascalName}Props`);
      console.log('✓ Props interface exported');
    });

    it('should include CSS module import when --css flag used', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:component', `--name=${compName} --css`);
      expect(result.success).toBe(true);
      
      const compPath = getComponentPath(compName);
      const pascalName = toPascalCase(compName);
      const content = readFile(path.join(compPath, `${pascalName}.tsx`));
      
      // Should import styles from CSS module
      const hasCssImport = content.includes('import styles from') || 
        content.includes('.module.css');
      
      expect(hasCssImport).toBe(true);
      console.log('✓ CSS module imported');
    });

    it('should include description in JSDoc when provided', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      const description = 'A test component for validation';
      createdComponents.push(compName);
      
      const result = runScript('create:component', `--name=${compName} --description="${description}"`);
      expect(result.success).toBe(true);
      
      const compPath = getComponentPath(compName);
      const pascalName = toPascalCase(compName);
      const content = readFile(path.join(compPath, `${pascalName}.tsx`));
      
      // Should contain the description
      expect(content).toContain(description);
      console.log('✓ Description included in component');
    });
  });

  describe('file structure validation', () => {
    it('should create component in correct directory', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:component', `--name=${compName}`);
      expect(result.success).toBe(true);
      
      // Regular components should be in src/components/[name]/
      const expectedPath = path.join(process.cwd(), 'src/components', compName);
      expect(dirExists(expectedPath)).toBe(true);
      console.log('✓ Component in correct directory');
    });

    it('should create unit test in correct directory', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:component', `--name=${compName}`);
      expect(result.success).toBe(true);
      
      const pascalName = toPascalCase(compName);
      // Unit tests should be in tests/unit/components/
      const expectedPath = path.join(process.cwd(), 'tests/unit/components', `${pascalName}.test.tsx`);
      expect(fileExists(expectedPath)).toBe(true);
      console.log('✓ Unit test in correct directory');
    });
  });

  describe('special characters and edge cases', () => {
    it('should handle long component name', () => {
      const compName = `${TEST_PREFIX.COMPONENT}-very-long-component-name-for-testing-purposes-${Date.now().toString(36)}`;
      createdComponents.push(compName);
      
      const result = runScript('create:component', `--name=${compName}`);
      
      const validResult = result.success || 
        result.output.includes('name') ||
        result.output.includes('long') ||
        result.output.includes('Created');
      
      expect(validResult).toBe(true);
      
      if (result.success) {
        expect(dirExists(getComponentPath(compName))).toBe(true);
        console.log('✓ Long component name handled successfully');
      } else {
        console.log('✓ Long component name rejected with error');
      }
    });

    it('should handle component name with numbers', () => {
      const compName = `${TEST_PREFIX.COMPONENT}-v2-123-${Date.now().toString(36)}`;
      createdComponents.push(compName);
      
      const result = runScript('create:component', `--name=${compName}`);
      
      expect(result.success).toBe(true);
      expect(dirExists(getComponentPath(compName))).toBe(true);
      console.log('✓ Component name with numbers handled');
    });

    it('should handle single word component name', () => {
      const compName = `btn${Date.now().toString(36)}`;
      createdComponents.push(compName);
      
      const result = runScript('create:component', `--name=${compName}`);
      
      expect(result.success).toBe(true);
      expect(dirExists(getComponentPath(compName))).toBe(true);
      console.log('✓ Single word component name handled');
    });
  });
});

