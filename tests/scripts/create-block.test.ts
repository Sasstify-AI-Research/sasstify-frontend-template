/**
 * Functional tests for create-block.js script
 */

import { describe, it, expect, afterEach, afterAll } from 'vitest';
import path from 'path';
import {
  runScript,
  fileExists,
  dirExists,
  readFile,
  cleanupAllTestArtifacts,
  getBlockComponentPath,
  getBlockComponentTestPath,
  toPascalCase,
  generateTestName,
  TEST_PREFIX,
} from './helpers/test-utils';

describe('create-block script', () => {
  const createdComponents: string[] = [];

  afterEach(() => {
    // Cleanup using delete:block script for each created component
    for (const compName of createdComponents) {
      // Use delete:block script with --yes flag to skip confirmation
      runScript('delete:block', `--name=${compName} --yes`);
    }
    createdComponents.length = 0;
  });

  afterAll(() => {
    // Comprehensive cleanup of any remaining test artifacts (fallback)
    cleanupAllTestArtifacts();
  });

  describe('block component creation', () => {
    it('should create block component with correct structure', () => {
      const compName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:block', `--name=${compName}`);
      
      expect(result.success).toBe(true);
      
      const compPath = getBlockComponentPath(compName);
      const pascalName = toPascalCase(compName);
      
      // Check directory exists
      expect(dirExists(compPath)).toBe(true);
      
      // Check required files exist
      expect(fileExists(path.join(compPath, `${pascalName}.tsx`))).toBe(true);
      expect(fileExists(path.join(compPath, `${pascalName}.types.ts`))).toBe(true);
    });

    it('should create unit test file for block component', () => {
      const compName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:block', `--name=${compName}`);
      
      expect(result.success).toBe(true);
      
      const testPath = getBlockComponentTestPath(compName);
      expect(fileExists(testPath)).toBe(true);
    });

    it('should create CSS module with --css flag', () => {
      const compName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:block', `--name=${compName} --css`);
      
      expect(result.success).toBe(true);
      
      const compPath = getBlockComponentPath(compName);
      const pascalName = toPascalCase(compName);
      
      expect(fileExists(path.join(compPath, `${pascalName}.module.css`))).toBe(true);
    });

    it('should generate correct block component content', () => {
      const compName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:block', `--name=${compName} --description="Test block component"`);
      
      expect(result.success).toBe(true);
      
      const compPath = getBlockComponentPath(compName);
      const pascalName = toPascalCase(compName);
      const content = readFile(path.join(compPath, `${pascalName}.tsx`));
      
      expect(content).toContain(`const ${pascalName}`);
      expect(content).toContain(`export default ${pascalName}`);
      expect(content).toContain('Import UI components that this block composes');
    });

    it('should generate correct block component types', () => {
      const compName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:block', `--name=${compName}`);
      
      expect(result.success).toBe(true);
      
      const compPath = getBlockComponentPath(compName);
      const pascalName = toPascalCase(compName);
      const typesPath = path.join(compPath, `${pascalName}.types.ts`);
      
      expect(fileExists(typesPath)).toBe(true);
      
      const content = readFile(typesPath);
      expect(content).toContain(`${pascalName}Props`);
      expect(content).toContain('Block Component Types');
    });

    it('should generate correct block component test file', () => {
      const compName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:block', `--name=${compName}`);
      
      expect(result.success).toBe(true);
      
      const testPath = getBlockComponentTestPath(compName);
      expect(fileExists(testPath)).toBe(true);
      
      const content = readFile(testPath);
      const pascalName = toPascalCase(compName);
      expect(content).toContain(`@/components/blocks/${compName}/${pascalName}`);
      expect(content).toContain(`describe('${pascalName}'`);
    });
  });

  describe('validation', () => {
    it('should auto-convert PascalCase to kebab-case', () => {
      const pascalName = 'InvalidName';
      createdComponents.push('invalid-name');
      
      const result = runScript('create:block', `--name=${pascalName}`);
      
      expect(result.success).toBe(true);
      expect(result.output).toContain('invalid-name');
      console.log('✓ PascalCase auto-converted to kebab-case');
    });

    it('should show help with --help flag', () => {
      const result = runScript('create:block', '--help');
      
      expect(result.success).toBe(true);
      expect(result.output).toContain('Usage:');
      expect(result.output).toContain('--name');
    });
  });

  describe('error handling', () => {
    it('should handle duplicate block name', () => {
      const compName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createdComponents.push(compName);
      
      // Create first block
      const result1 = runScript('create:block', `--name=${compName}`);
      expect(result1.success).toBe(true);
      
      // Try to create duplicate
      const result2 = runScript('create:block', `--name=${compName}`);
      
      // Should fail or show error message
      const indicatesError = !result2.success || 
        result2.output.includes('exists') ||
        result2.output.includes('already') ||
        result2.output.includes('Error') ||
        result2.output.includes('error');
      
      expect(indicatesError).toBe(true);
      console.log('✓ Duplicate block handled');
    });
  });

  describe('content validation', () => {
    it('should import React in block component', () => {
      const compName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:block', `--name=${compName}`);
      expect(result.success).toBe(true);
      
      const compPath = getBlockComponentPath(compName);
      const pascalName = toPascalCase(compName);
      const content = readFile(path.join(compPath, `${pascalName}.tsx`));
      
      const hasReactImport = content.includes("import React") || 
        content.includes("from 'react'") ||
        content.includes('from "react"');
      
      expect(hasReactImport).toBe(true);
      console.log('✓ React imported in block component');
    });

    it('should import from types file', () => {
      const compName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:block', `--name=${compName}`);
      expect(result.success).toBe(true);
      
      const compPath = getBlockComponentPath(compName);
      const pascalName = toPascalCase(compName);
      const content = readFile(path.join(compPath, `${pascalName}.tsx`));
      
      expect(content).toContain(`.types`);
      expect(content).toContain(`${pascalName}Props`);
      console.log('✓ Block component imports from types file');
    });

    it('should export props interface in types file', () => {
      const compName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:block', `--name=${compName}`);
      expect(result.success).toBe(true);
      
      const compPath = getBlockComponentPath(compName);
      const pascalName = toPascalCase(compName);
      const typesContent = readFile(path.join(compPath, `${pascalName}.types.ts`));
      
      expect(typesContent).toContain('export interface');
      expect(typesContent).toContain(`${pascalName}Props`);
      console.log('✓ Props interface exported');
    });
  });

  describe('file structure validation', () => {
    it('should create block in correct directory', () => {
      const compName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:block', `--name=${compName}`);
      expect(result.success).toBe(true);
      
      // Blocks should be in src/components/blocks/[name]/
      const expectedPath = path.join(process.cwd(), 'src/components/blocks', compName);
      expect(dirExists(expectedPath)).toBe(true);
      console.log('✓ Block in correct directory');
    });

    it('should create unit test in correct directory', () => {
      const compName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createdComponents.push(compName);
      
      const result = runScript('create:block', `--name=${compName}`);
      expect(result.success).toBe(true);
      
      const pascalName = toPascalCase(compName);
      // Unit tests should be in tests/unit/components/blocks/
      const expectedPath = path.join(process.cwd(), 'tests/unit/components/blocks', `${pascalName}.test.tsx`);
      expect(fileExists(expectedPath)).toBe(true);
      console.log('✓ Unit test in correct directory');
    });
  });

  describe('special characters and edge cases', () => {
    it('should handle long block name', () => {
      const compName = `${TEST_PREFIX.BLOCK_COMPONENT}-very-long-block-name-${Date.now().toString(36)}`;
      createdComponents.push(compName);
      
      const result = runScript('create:block', `--name=${compName}`);
      
      const validResult = result.success || 
        result.output.includes('name') ||
        result.output.includes('long') ||
        result.output.includes('Created');
      
      expect(validResult).toBe(true);
      
      if (result.success) {
        expect(dirExists(getBlockComponentPath(compName))).toBe(true);
        console.log('✓ Long block name handled successfully');
      }
    });

    it('should handle block name with numbers', () => {
      const compName = `${TEST_PREFIX.BLOCK_COMPONENT}-v2-123-${Date.now().toString(36)}`;
      createdComponents.push(compName);
      
      const result = runScript('create:block', `--name=${compName}`);
      
      expect(result.success).toBe(true);
      expect(dirExists(getBlockComponentPath(compName))).toBe(true);
      console.log('✓ Block name with numbers handled');
    });
  });
});

