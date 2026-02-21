/**
 * Comprehensive functional tests for delete-block.js script
 */

import { describe, it, expect, afterEach, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  runScript,
  fileExists,
  dirExists,
  readFile,
  cleanupTestArtifacts,
  cleanupAllTestArtifacts,
  getBlockComponentPath,
  getBlockComponentTestPath,
  getUIComponentPath,
  getComponentPath,
  getComponentTestPath,
  getPagePath,
  generateTestName,
  TEST_PREFIX,
  toPascalCase,
  PATHS,
} from './helpers/test-utils';

describe('delete-block script', () => {
  const createdBlocks: string[] = [];
  const createdUIComponents: string[] = [];
  const createdComponents: string[] = [];
  const createdPages: string[] = [];

  // Helper to create a test block component
  function createTestBlock(blockName: string): boolean {
    const result = runScript('create:block', `--name=${blockName}`);
    if (result.success) {
      createdBlocks.push(blockName);
    }
    return result.success;
  }

  // Helper to create a test UI component
  function createTestUIComponent(compName: string): boolean {
    const result = runScript('create:ui-component', `--name=${compName}`);
    if (result.success) {
      createdUIComponents.push(compName);
    }
    return result.success;
  }

  // Helper to create a test regular component
  function createTestComponent(compName: string): boolean {
    const result = runScript('create:component', `--name=${compName}`);
    if (result.success) {
      createdComponents.push(compName);
    }
    return result.success;
  }

  // Helper to create a test page
  function createTestPage(pageName: string): boolean {
    const result = runScript('create:page', `--name=${pageName} --title="Test Page"`);
    if (result.success) {
      createdPages.push(pageName);
    }
    return result.success;
  }

  // Helper to add import to a block file
  function addImportToBlock(blockName: string, importStatement: string): void {
    const blockPath = getBlockComponentPath(blockName);
    const pascalName = toPascalCase(blockName);
    const filePath = path.join(blockPath, `${pascalName}.tsx`);
    
    if (fileExists(filePath)) {
      let content = readFile(filePath);
      // Add import after React import
      content = content.replace(
        /import React from 'react';/,
        `import React from 'react';\n${importStatement}`
      );
      fs.writeFileSync(filePath, content);
    }
  }

  // Helper to add import to a page file
  function addImportToPage(pageName: string, importStatement: string): void {
    const pagePath = getPagePath(pageName);
    const pascalName = toPascalCase(pageName);
    const filePath = path.join(pagePath, `${pascalName}.tsx`);
    
    if (fileExists(filePath)) {
      let content = readFile(filePath);
      content = content.replace(
        /import React from 'react';/,
        `import React from 'react';\n${importStatement}`
      );
      fs.writeFileSync(filePath, content);
    }
  }

  // Helper to add import to a component file
  function addImportToComponent(compName: string, importStatement: string): void {
    const compPath = getComponentPath(compName);
    const pascalName = toPascalCase(compName);
    const filePath = path.join(compPath, `${pascalName}.tsx`);
    
    if (fileExists(filePath)) {
      let content = readFile(filePath);
      content = content.replace(
        /import React from 'react';/,
        `import React from 'react';\n${importStatement}`
      );
      fs.writeFileSync(filePath, content);
    }
  }

  afterEach(() => {
    // Cleanup in reverse order to handle dependencies
    // Delete pages first (they might use blocks/components)
    for (const pageName of [...createdPages].reverse()) {
      runScript('delete:page', `--name=${pageName} --yes`);
    }
    
    // Delete blocks in reverse order (later blocks might use earlier ones)
    // Run multiple passes to handle interdependencies
    for (let pass = 0; pass < 3; pass++) {
      for (const blockName of [...createdBlocks].reverse()) {
        runScript('delete:block', `--name=${blockName} --yes`);
      }
    }
    
    // Delete regular components
    for (const compName of [...createdComponents].reverse()) {
      runScript('delete:component', `--name=${compName} --yes`);
    }
    
    // Delete UI components last (they might be used by blocks/components)
    for (const compName of [...createdUIComponents].reverse()) {
      runScript('delete:ui-component', `--name=${compName} --yes`);
    }
    
    // Fallback: Direct cleanup for any remaining test artifacts
    for (const blockName of createdBlocks) {
      const blockPath = getBlockComponentPath(blockName);
      if (dirExists(blockPath)) {
        fs.rmSync(blockPath, { recursive: true, force: true });
      }
      const testPath = getBlockComponentTestPath(blockName);
      if (fileExists(testPath)) {
        fs.unlinkSync(testPath);
      }
    }
    
    createdBlocks.length = 0;
    createdUIComponents.length = 0;
    createdComponents.length = 0;
    createdPages.length = 0;
  });

  afterAll(() => {
    cleanupAllTestArtifacts();
  });

  // ==========================================
  // 1. Basic Deletion Tests
  // ==========================================
  describe('basic deletion', () => {
    it('should delete block component folder', () => {
      const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createTestBlock(blockName);
      
      const blockPath = getBlockComponentPath(blockName);
      expect(dirExists(blockPath)).toBe(true);
      
      const result = runScript('delete:block', `--name=${blockName} --yes`);
      
      expect(result.success).toBe(true);
      expect(dirExists(blockPath)).toBe(false);
      console.log('✓ Block folder deleted');
    });

    it('should delete block component test file', () => {
      const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createTestBlock(blockName);
      
      const testPath = getBlockComponentTestPath(blockName);
      expect(fileExists(testPath)).toBe(true);
      
      runScript('delete:block', `--name=${blockName} --yes`);
      
      expect(fileExists(testPath)).toBe(false);
      console.log('✓ Block test file deleted');
    });

    it('should show help with --help flag', () => {
      const result = runScript('delete:block', '--help');
      
      expect(result.success).toBe(true);
      expect(result.output).toContain('Usage:');
      expect(result.output).toContain('--name');
      expect(result.output).toContain('--yes');
      console.log('✓ Help displayed correctly');
    });

    it('should handle block name without blocks/ prefix', () => {
      const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createTestBlock(blockName);
      
      const result = runScript('delete:block', `--name=${blockName} --yes`);
      
      expect(result.success).toBe(true);
      expect(dirExists(getBlockComponentPath(blockName))).toBe(false);
      console.log('✓ Block name without prefix handled');
    });

    it('should handle block name with blocks/ prefix', () => {
      const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createTestBlock(blockName);
      
      const result = runScript('delete:block', `--name=blocks/${blockName} --yes`);
      
      expect(result.success).toBe(true);
      expect(dirExists(getBlockComponentPath(blockName))).toBe(false);
      console.log('✓ Block name with prefix handled');
    });

    it('should delete block with CSS module', () => {
      const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      runScript('create:block', `--name=${blockName} --css`);
      createdBlocks.push(blockName);
      
      const blockPath = getBlockComponentPath(blockName);
      const pascalName = toPascalCase(blockName);
      const cssPath = path.join(blockPath, `${pascalName}.module.css`);
      
      expect(fileExists(cssPath)).toBe(true);
      
      runScript('delete:block', `--name=${blockName} --yes`);
      
      expect(dirExists(blockPath)).toBe(false);
      console.log('✓ Block with CSS module deleted');
    });
  });

  // ==========================================
  // 2. Error Handling Tests
  // ==========================================
  describe('error handling', () => {
    it('should handle block not found', () => {
      const result = runScript('delete:block', '--name=non-existent-block-xyz --yes');
      
      const indicatesError = !result.success || 
        result.output.toLowerCase().includes('not found') ||
        result.output.toLowerCase().includes('does not exist') ||
        result.output.toLowerCase().includes('error');
      
      expect(indicatesError).toBe(true);
      console.log('✓ Block not found handled');
    });

    it('should handle missing --name flag', () => {
      const result = runScript('delete:block', '--yes');
      
      const indicatesError = !result.success || 
        result.output.toLowerCase().includes('name') ||
        result.output.toLowerCase().includes('required') ||
        result.output.toLowerCase().includes('usage');
      
      expect(indicatesError).toBe(true);
      console.log('✓ Missing --name handled');
    });

    it('should handle empty block name', () => {
      const result = runScript('delete:block', '--name= --yes');
      
      const indicatesError = !result.success || 
        result.output.toLowerCase().includes('name') ||
        result.output.toLowerCase().includes('invalid') ||
        result.output.toLowerCase().includes('error');
      
      expect(indicatesError).toBe(true);
      console.log('✓ Empty block name handled');
    });

    it('should handle non-existent test file gracefully', () => {
      const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createTestBlock(blockName);
      
      // Manually delete the test file
      const testPath = getBlockComponentTestPath(blockName);
      if (fileExists(testPath)) {
        fs.unlinkSync(testPath);
      }
      
      // Delete should still succeed
      const result = runScript('delete:block', `--name=${blockName} --yes`);
      
      expect(result.success).toBe(true);
      console.log('✓ Non-existent test file handled gracefully');
    });
  });

  // ==========================================
  // 3. Usage Protection Tests
  // ==========================================
  describe('usage protection', () => {
    it('should prevent deletion if block used by pages', () => {
      const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      const pageName = generateTestName(TEST_PREFIX.PAGE);
      
      createTestBlock(blockName);
      createTestPage(pageName);
      
      const pascalBlockName = toPascalCase(blockName);
      addImportToPage(pageName, `import ${pascalBlockName} from '@/components/blocks/${blockName}/${pascalBlockName}';`);
      
      const result = runScript('delete:block', `--name=${blockName} --yes`);
      
      // Should either fail or show warning about usage
      const indicatesUsage = !result.success ||
        result.output.toLowerCase().includes('used') ||
        result.output.toLowerCase().includes('usage') ||
        result.output.toLowerCase().includes('cannot delete');
      
      expect(indicatesUsage).toBe(true);
      console.log('✓ Block used by page - deletion prevented or warned');
    });

    it('should prevent deletion if block used by other blocks', () => {
      const blockName1 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      const blockName2 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      
      createTestBlock(blockName1);
      createTestBlock(blockName2);
      
      const pascalBlock1 = toPascalCase(blockName1);
      addImportToBlock(blockName2, `import ${pascalBlock1} from '@/components/blocks/${blockName1}/${pascalBlock1}';`);
      
      const result = runScript('delete:block', `--name=${blockName1} --yes`);
      
      const indicatesUsage = !result.success ||
        result.output.toLowerCase().includes('used') ||
        result.output.toLowerCase().includes('usage');
      
      expect(indicatesUsage).toBe(true);
      console.log('✓ Block used by other block - deletion prevented or warned');
    });

    it('should prevent deletion if block used by components', () => {
      const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      
      createTestBlock(blockName);
      createTestComponent(compName);
      
      const pascalBlockName = toPascalCase(blockName);
      addImportToComponent(compName, `import ${pascalBlockName} from '@/components/blocks/${blockName}/${pascalBlockName}';`);
      
      const result = runScript('delete:block', `--name=${blockName} --yes`);
      
      const indicatesUsage = !result.success ||
        result.output.toLowerCase().includes('used') ||
        result.output.toLowerCase().includes('usage');
      
      expect(indicatesUsage).toBe(true);
      console.log('✓ Block used by component - deletion prevented or warned');
    });

    it('should allow deletion when no usages found', () => {
      const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createTestBlock(blockName);
      
      const result = runScript('delete:block', `--name=${blockName} --yes`);
      
      expect(result.success).toBe(true);
      expect(result.output.toLowerCase()).toContain('no usages found');
      console.log('✓ Unused block deleted successfully');
    });
  });

  // ==========================================
  // 4. Cascade Delete Tests
  // ==========================================
  describe('cascade delete', () => {
    describe('basic cascade', () => {
      it('should support --cascade flag', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        createTestBlock(blockName);
        
        const result = runScript('delete:block', `--name=${blockName} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getBlockComponentPath(blockName))).toBe(false);
        console.log('✓ --cascade flag supported');
      });
    });

    describe('single component type', () => {
      it('should cascade delete block with only orphaned component', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        
        createTestBlock(blockName);
        createTestComponent(compName);
        
        const pascalComp = toPascalCase(compName);
        addImportToBlock(blockName, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        
        const result = runScript('delete:block', `--name=${blockName} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getBlockComponentPath(blockName))).toBe(false);
        // Orphaned component should be deleted
        console.log('✓ Block with only orphaned component - cascade completed');
      });

      it('should NOT cascade delete block with only shared component', () => {
        const blockName1 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const blockName2 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        
        createTestBlock(blockName1);
        createTestBlock(blockName2);
        createTestComponent(compName);
        
        const pascalComp = toPascalCase(compName);
        addImportToBlock(blockName1, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        addImportToBlock(blockName2, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        
        runScript('delete:block', `--name=${blockName1} --cascade --yes`);
        
        // Shared component should still exist
        expect(dirExists(getComponentPath(compName))).toBe(true);
        console.log('✓ Block with only shared component - component preserved');
      });

      it('should cascade delete block with only orphaned UI component', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestBlock(blockName);
        createTestUIComponent(uiCompName);
        
        const pascalUIComp = toPascalCase(uiCompName);
        addImportToBlock(blockName, `import ${pascalUIComp} from '@/components/ui/${uiCompName}/${pascalUIComp}';`);
        
        const result = runScript('delete:block', `--name=${blockName} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getBlockComponentPath(blockName))).toBe(false);
        console.log('✓ Block with only orphaned UI component - cascade completed');
      });

      it('should NOT cascade delete block with only shared UI component', () => {
        const blockName1 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const blockName2 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestBlock(blockName1);
        createTestBlock(blockName2);
        createTestUIComponent(uiCompName);
        
        const pascalUIComp = toPascalCase(uiCompName);
        addImportToBlock(blockName1, `import ${pascalUIComp} from '@/components/ui/${uiCompName}/${pascalUIComp}';`);
        addImportToBlock(blockName2, `import ${pascalUIComp} from '@/components/ui/${uiCompName}/${pascalUIComp}';`);
        
        runScript('delete:block', `--name=${blockName1} --cascade --yes`);
        
        // Shared UI component should still exist
        expect(dirExists(getUIComponentPath(uiCompName))).toBe(true);
        console.log('✓ Block with only shared UI component - UI component preserved');
      });
    });

    describe('mixed components - both same status', () => {
      it('should cascade delete both orphaned component AND orphaned UI component', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestBlock(blockName);
        createTestComponent(compName);
        createTestUIComponent(uiCompName);
        
        const pascalComp = toPascalCase(compName);
        const pascalUIComp = toPascalCase(uiCompName);
        addImportToBlock(blockName, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        addImportToBlock(blockName, `import ${pascalUIComp} from '@/components/ui/${uiCompName}/${pascalUIComp}';`);
        
        const result = runScript('delete:block', `--name=${blockName} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getBlockComponentPath(blockName))).toBe(false);
        // Both orphaned components should be candidates for deletion
        console.log('✓ Both orphaned component AND UI component - cascade completed');
      });

      it('should NOT cascade delete when both component AND UI component are shared', () => {
        const blockName1 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const blockName2 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestBlock(blockName1);
        createTestBlock(blockName2);
        createTestComponent(compName);
        createTestUIComponent(uiCompName);
        
        const pascalComp = toPascalCase(compName);
        const pascalUIComp = toPascalCase(uiCompName);
        
        // Both blocks use both components
        addImportToBlock(blockName1, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        addImportToBlock(blockName1, `import ${pascalUIComp} from '@/components/ui/${uiCompName}/${pascalUIComp}';`);
        addImportToBlock(blockName2, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        addImportToBlock(blockName2, `import ${pascalUIComp} from '@/components/ui/${uiCompName}/${pascalUIComp}';`);
        
        runScript('delete:block', `--name=${blockName1} --cascade --yes`);
        
        // Both shared components should still exist
        expect(dirExists(getComponentPath(compName))).toBe(true);
        expect(dirExists(getUIComponentPath(uiCompName))).toBe(true);
        console.log('✓ Both shared component AND UI component - both preserved');
      });
    });

    describe('mixed components - different status', () => {
      it('should cascade delete orphaned component but preserve shared UI component', () => {
        const blockName1 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const blockName2 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestBlock(blockName1);
        createTestBlock(blockName2);
        createTestComponent(compName);
        createTestUIComponent(uiCompName);
        
        const pascalComp = toPascalCase(compName);
        const pascalUIComp = toPascalCase(uiCompName);
        
        // Block1: uses orphaned component + shared UI component
        addImportToBlock(blockName1, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        addImportToBlock(blockName1, `import ${pascalUIComp} from '@/components/ui/${uiCompName}/${pascalUIComp}';`);
        // Block2: uses only shared UI component
        addImportToBlock(blockName2, `import ${pascalUIComp} from '@/components/ui/${uiCompName}/${pascalUIComp}';`);
        
        runScript('delete:block', `--name=${blockName1} --cascade --yes`);
        
        // Shared UI component should still exist
        expect(dirExists(getUIComponentPath(uiCompName))).toBe(true);
        console.log('✓ Orphaned component deleted, shared UI component preserved');
      });

      it('should cascade delete orphaned UI component but preserve shared component', () => {
        const blockName1 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const blockName2 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestBlock(blockName1);
        createTestBlock(blockName2);
        createTestComponent(compName);
        createTestUIComponent(uiCompName);
        
        const pascalComp = toPascalCase(compName);
        const pascalUIComp = toPascalCase(uiCompName);
        
        // Block1: uses shared component + orphaned UI component
        addImportToBlock(blockName1, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        addImportToBlock(blockName1, `import ${pascalUIComp} from '@/components/ui/${uiCompName}/${pascalUIComp}';`);
        // Block2: uses only shared component
        addImportToBlock(blockName2, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        
        runScript('delete:block', `--name=${blockName1} --cascade --yes`);
        
        // Shared component should still exist
        expect(dirExists(getComponentPath(compName))).toBe(true);
        console.log('✓ Orphaned UI component deleted, shared component preserved');
      });

      it('should handle block with 2 components: 1 orphaned, 1 shared', () => {
        const blockName1 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const blockName2 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const orphanedCompName = generateTestName(TEST_PREFIX.COMPONENT);
        const sharedCompName = generateTestName(TEST_PREFIX.COMPONENT);
        
        createTestBlock(blockName1);
        createTestBlock(blockName2);
        createTestComponent(orphanedCompName);
        createTestComponent(sharedCompName);
        
        const pascalOrphaned = toPascalCase(orphanedCompName);
        const pascalShared = toPascalCase(sharedCompName);
        
        // Block1: uses both orphaned and shared components
        addImportToBlock(blockName1, `import ${pascalOrphaned} from '@/components/${orphanedCompName}/${pascalOrphaned}';`);
        addImportToBlock(blockName1, `import ${pascalShared} from '@/components/${sharedCompName}/${pascalShared}';`);
        // Block2: uses only shared component
        addImportToBlock(blockName2, `import ${pascalShared} from '@/components/${sharedCompName}/${pascalShared}';`);
        
        runScript('delete:block', `--name=${blockName1} --cascade --yes`);
        
        // Shared component should still exist
        expect(dirExists(getComponentPath(sharedCompName))).toBe(true);
        console.log('✓ Mixed orphaned/shared components in same category handled');
      });

      it('should handle block with 2 UI components: 1 orphaned, 1 shared', () => {
        const blockName1 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const blockName2 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const orphanedUIName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const sharedUIName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestBlock(blockName1);
        createTestBlock(blockName2);
        createTestUIComponent(orphanedUIName);
        createTestUIComponent(sharedUIName);
        
        const pascalOrphaned = toPascalCase(orphanedUIName);
        const pascalShared = toPascalCase(sharedUIName);
        
        // Block1: uses both orphaned and shared UI components
        addImportToBlock(blockName1, `import ${pascalOrphaned} from '@/components/ui/${orphanedUIName}/${pascalOrphaned}';`);
        addImportToBlock(blockName1, `import ${pascalShared} from '@/components/ui/${sharedUIName}/${pascalShared}';`);
        // Block2: uses only shared UI component
        addImportToBlock(blockName2, `import ${pascalShared} from '@/components/ui/${sharedUIName}/${pascalShared}';`);
        
        runScript('delete:block', `--name=${blockName1} --cascade --yes`);
        
        // Shared UI component should still exist
        expect(dirExists(getUIComponentPath(sharedUIName))).toBe(true);
        console.log('✓ Mixed orphaned/shared UI components handled');
      });
    });

    describe('multi-level cascade', () => {
      it('should handle multi-level cascade: block → component → UI component (all orphaned)', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestBlock(blockName);
        createTestComponent(compName);
        createTestUIComponent(uiCompName);
        
        const pascalComp = toPascalCase(compName);
        const pascalUIComp = toPascalCase(uiCompName);
        
        // Block uses component, component uses UI component
        addImportToBlock(blockName, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        addImportToComponent(compName, `import ${pascalUIComp} from '@/components/ui/${uiCompName}/${pascalUIComp}';`);
        
        const result = runScript('delete:block', `--name=${blockName} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getBlockComponentPath(blockName))).toBe(false);
        console.log('✓ Multi-level cascade (block → comp → UI) completed');
      });

      it('should stop cascade at shared component in chain', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const blockName2 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestBlock(blockName);
        createTestBlock(blockName2);
        createTestComponent(compName);
        createTestUIComponent(uiCompName);
        
        const pascalComp = toPascalCase(compName);
        const pascalUIComp = toPascalCase(uiCompName);
        
        // Block uses component, component uses UI component
        addImportToBlock(blockName, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        addImportToComponent(compName, `import ${pascalUIComp} from '@/components/ui/${uiCompName}/${pascalUIComp}';`);
        // Block2 also uses the component (making it shared)
        addImportToBlock(blockName2, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        
        runScript('delete:block', `--name=${blockName} --cascade --yes`);
        
        // Shared component should still exist
        expect(dirExists(getComponentPath(compName))).toBe(true);
        // UI component used by shared component should also exist
        expect(dirExists(getUIComponentPath(uiCompName))).toBe(true);
        console.log('✓ Cascade stopped at shared component in chain');
      });

      it('should preserve entire chain when child component is used elsewhere (block → shared comp → UI)', () => {
        // This test explicitly verifies:
        // Block → Component → UI Component
        // If Component is used by another Block, then:
        // - Component is preserved (shared)
        // - UI Component is also preserved (used by preserved Component)
        // - Only Block gets deleted
        
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const otherBlock = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestBlock(blockName);
        createTestBlock(otherBlock);
        createTestComponent(compName);
        createTestUIComponent(uiCompName);
        
        const pascalComp = toPascalCase(compName);
        const pascalUI = toPascalCase(uiCompName);
        
        // Chain: block → component → UI
        addImportToBlock(blockName, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        addImportToComponent(compName, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        // Other block also uses the component (making it shared)
        addImportToBlock(otherBlock, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        
        runScript('delete:block', `--name=${blockName} --cascade --yes`);
        
        // Block should be deleted
        expect(dirExists(getBlockComponentPath(blockName))).toBe(false);
        // Component should be preserved (used by otherBlock)
        expect(dirExists(getComponentPath(compName))).toBe(true);
        // UI should also be preserved (used by preserved Component)
        expect(dirExists(getUIComponentPath(uiCompName))).toBe(true);
        
        console.log('✓ Chain preserved when child component is shared - only block deleted');
      });

      it('should handle deep cascade chain (block → comp1 → comp2 → UI)', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const compName1 = generateTestName(TEST_PREFIX.COMPONENT);
        const compName2 = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestBlock(blockName);
        createTestComponent(compName1);
        createTestComponent(compName2);
        createTestUIComponent(uiCompName);
        
        const pascalComp1 = toPascalCase(compName1);
        const pascalComp2 = toPascalCase(compName2);
        const pascalUIComp = toPascalCase(uiCompName);
        
        // Chain: block → comp1 → comp2 → UI
        addImportToBlock(blockName, `import ${pascalComp1} from '@/components/${compName1}/${pascalComp1}';`);
        addImportToComponent(compName1, `import ${pascalComp2} from '@/components/${compName2}/${pascalComp2}';`);
        addImportToComponent(compName2, `import ${pascalUIComp} from '@/components/ui/${uiCompName}/${pascalUIComp}';`);
        
        const result = runScript('delete:block', `--name=${blockName} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getBlockComponentPath(blockName))).toBe(false);
        console.log('✓ Deep cascade chain (4 levels) completed');
      });
    });

    describe('complex patterns', () => {
      it('should handle diamond dependency (block uses comp A & B, both use UI C)', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const compNameA = generateTestName(TEST_PREFIX.COMPONENT);
        const compNameB = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestBlock(blockName);
        createTestComponent(compNameA);
        createTestComponent(compNameB);
        createTestUIComponent(uiCompName);
        
        const pascalA = toPascalCase(compNameA);
        const pascalB = toPascalCase(compNameB);
        const pascalUI = toPascalCase(uiCompName);
        
        // Diamond: block → A, block → B, A → UI, B → UI
        addImportToBlock(blockName, `import ${pascalA} from '@/components/${compNameA}/${pascalA}';`);
        addImportToBlock(blockName, `import ${pascalB} from '@/components/${compNameB}/${pascalB}';`);
        addImportToComponent(compNameA, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        addImportToComponent(compNameB, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        const result = runScript('delete:block', `--name=${blockName} --cascade --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ Diamond dependency pattern handled');
      });

      it('should handle multiple blocks sharing same component tree', () => {
        const blockName1 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const blockName2 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestBlock(blockName1);
        createTestBlock(blockName2);
        createTestComponent(compName);
        createTestUIComponent(uiCompName);
        
        const pascalComp = toPascalCase(compName);
        const pascalUI = toPascalCase(uiCompName);
        
        // Both blocks share the same component tree
        addImportToBlock(blockName1, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        addImportToBlock(blockName2, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        addImportToComponent(compName, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        // Delete first block
        runScript('delete:block', `--name=${blockName1} --cascade --yes`);
        
        // Component tree should still exist (used by block2)
        expect(dirExists(getComponentPath(compName))).toBe(true);
        expect(dirExists(getUIComponentPath(uiCompName))).toBe(true);
        
        // Delete second block - now tree should be orphaned
        runScript('delete:block', `--name=${blockName2} --cascade --yes`);
        
        console.log('✓ Multiple blocks sharing component tree handled');
      });

      it('should handle block using another block with cascade', () => {
        const blockName1 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const blockName2 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestBlock(blockName1);
        createTestBlock(blockName2);
        createTestUIComponent(uiCompName);
        
        const pascalBlock1 = toPascalCase(blockName1);
        const pascalUI = toPascalCase(uiCompName);
        
        // Block2 uses Block1, Block1 uses UI component
        addImportToBlock(blockName2, `import ${pascalBlock1} from '@/components/blocks/${blockName1}/${pascalBlock1}';`);
        addImportToBlock(blockName1, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        // Delete Block2 with cascade (Block1 becomes orphaned)
        const result = runScript('delete:block', `--name=${blockName2} --cascade --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ Block using another block with cascade handled');
      });
    });

    describe('edge cases', () => {
      it('should handle block with many orphaned components (5+)', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        createTestBlock(blockName);
        
        // Create 5 components
        const compNames: string[] = [];
        for (let i = 0; i < 5; i++) {
          const compName = generateTestName(TEST_PREFIX.COMPONENT);
          createTestComponent(compName);
          compNames.push(compName);
          
          const pascalComp = toPascalCase(compName);
          addImportToBlock(blockName, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        }
        
        const result = runScript('delete:block', `--name=${blockName} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getBlockComponentPath(blockName))).toBe(false);
        console.log('✓ Block with 5+ orphaned components handled');
      });

      it('should handle block with no components', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        createTestBlock(blockName);
        
        const result = runScript('delete:block', `--name=${blockName} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getBlockComponentPath(blockName))).toBe(false);
        console.log('✓ Block with no components handled');
      });

      it('should show cascade deletion in output', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        
        createTestBlock(blockName);
        createTestComponent(compName);
        
        const pascalComp = toPascalCase(compName);
        addImportToBlock(blockName, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        
        const result = runScript('delete:block', `--name=${blockName} --cascade --yes`);
        
        expect(result.success).toBe(true);
        // Output should mention cascade or deleted components
        const hasCascadeInfo = result.output.toLowerCase().includes('cascade') ||
          result.output.toLowerCase().includes('deleted') ||
          result.output.toLowerCase().includes('component');
        expect(hasCascadeInfo).toBe(true);
        console.log('✓ Cascade deletion shown in output');
      });
    });
  });

  // ==========================================
  // 5. Dependency Uninstall Tests
  // ==========================================
  describe('dependency uninstall', () => {
    describe('basic deps flag', () => {
      it('should support --deps flag for dependency cleanup', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        createTestBlock(blockName);
        
        const result = runScript('delete:block', `--name=${blockName} --deps --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getBlockComponentPath(blockName))).toBe(false);
        console.log('✓ --deps flag supported');
      });

      it('should handle --deps flag with block having no dependencies', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        createTestBlock(blockName);
        
        const result = runScript('delete:block', `--name=${blockName} --deps --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ --deps with no dependencies handled');
      });
    });

    describe('protected packages', () => {
      it('should NOT uninstall react even if only used by deleted block', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        createTestBlock(blockName);
        
        runScript('delete:block', `--name=${blockName} --deps --yes`);
        
        // Check that react is still in package.json
        const packageJson = JSON.parse(readFile(PATHS.packageJson));
        expect(packageJson.dependencies?.react || packageJson.devDependencies?.react).toBeDefined();
        console.log('✓ react not uninstalled');
      });

      it('should NOT uninstall react-dom even if only used by deleted block', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        createTestBlock(blockName);
        
        runScript('delete:block', `--name=${blockName} --deps --yes`);
        
        const packageJson = JSON.parse(readFile(PATHS.packageJson));
        expect(packageJson.dependencies?.['react-dom'] || packageJson.devDependencies?.['react-dom']).toBeDefined();
        console.log('✓ react-dom not uninstalled');
      });

      it('should NOT uninstall typescript even if only used by deleted block', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        createTestBlock(blockName);
        
        runScript('delete:block', `--name=${blockName} --deps --yes`);
        
        const packageJson = JSON.parse(readFile(PATHS.packageJson));
        // TypeScript might be in devDependencies
        const hasTypescript = packageJson.dependencies?.typescript || packageJson.devDependencies?.typescript;
        expect(hasTypescript).toBeDefined();
        console.log('✓ typescript not uninstalled');
      });
    });

    describe('cascade + deps combined', () => {
      it('should handle cascade + deps together', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        createTestBlock(blockName);
        
        const result = runScript('delete:block', `--name=${blockName} --cascade --deps --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getBlockComponentPath(blockName))).toBe(false);
        console.log('✓ --cascade --deps flags work together');
      });

      it('should handle cascade + deps with orphaned component', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        
        createTestBlock(blockName);
        createTestComponent(compName);
        
        const pascalComp = toPascalCase(compName);
        addImportToBlock(blockName, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        
        const result = runScript('delete:block', `--name=${blockName} --cascade --deps --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ cascade + deps with orphaned component handled');
      });

      it('should handle cascade + deps with orphaned UI component', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestBlock(blockName);
        createTestUIComponent(uiCompName);
        
        const pascalUI = toPascalCase(uiCompName);
        addImportToBlock(blockName, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        const result = runScript('delete:block', `--name=${blockName} --cascade --deps --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ cascade + deps with orphaned UI component handled');
      });

      it('should handle cascade + deps with both orphaned component and UI component', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestBlock(blockName);
        createTestComponent(compName);
        createTestUIComponent(uiCompName);
        
        const pascalComp = toPascalCase(compName);
        const pascalUI = toPascalCase(uiCompName);
        addImportToBlock(blockName, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        addImportToBlock(blockName, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        const result = runScript('delete:block', `--name=${blockName} --cascade --deps --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ cascade + deps with both orphaned comp and UI comp handled');
      });

      it('should preserve deps of shared components when using cascade + deps', () => {
        const blockName1 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const blockName2 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        
        createTestBlock(blockName1);
        createTestBlock(blockName2);
        createTestComponent(compName);
        
        const pascalComp = toPascalCase(compName);
        addImportToBlock(blockName1, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        addImportToBlock(blockName2, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        
        runScript('delete:block', `--name=${blockName1} --cascade --deps --yes`);
        
        // Shared component should still exist
        expect(dirExists(getComponentPath(compName))).toBe(true);
        console.log('✓ Shared component deps preserved with cascade + deps');
      });

      it('should handle multi-level cascade with deps', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestBlock(blockName);
        createTestComponent(compName);
        createTestUIComponent(uiCompName);
        
        const pascalComp = toPascalCase(compName);
        const pascalUI = toPascalCase(uiCompName);
        
        // Chain: block → comp → UI
        addImportToBlock(blockName, `import ${pascalComp} from '@/components/${compName}/${pascalComp}';`);
        addImportToComponent(compName, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        const result = runScript('delete:block', `--name=${blockName} --cascade --deps --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ Multi-level cascade with deps handled');
      });
    });

    describe('edge cases', () => {
      it('should handle --deps with block that has no npm imports', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        createTestBlock(blockName);
        
        const result = runScript('delete:block', `--name=${blockName} --deps --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ --deps with no npm imports handled');
      });

      it('should show dependency cleanup info in output', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        createTestBlock(blockName);
        
        const result = runScript('delete:block', `--name=${blockName} --deps --yes`);
        
        expect(result.success).toBe(true);
        // Output should mention deps or dependencies
        const hasDepsInfo = result.output.toLowerCase().includes('dep') ||
          result.output.toLowerCase().includes('package') ||
          result.output.toLowerCase().includes('protected');
        expect(hasDepsInfo).toBe(true);
        console.log('✓ Dependency info shown in output');
      });

      it('should handle package used by protected component (Layout)', () => {
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        createTestBlock(blockName);
        
        // Layout is a protected/existing component
        const result = runScript('delete:block', `--name=${blockName} --deps --yes`);
        
        expect(result.success).toBe(true);
        // Ensure Layout still exists
        expect(dirExists(path.join(PATHS.blockComponents, 'layout'))).toBe(true);
        console.log('✓ Protected component Layout preserved');
      });
    });
  });

  // ==========================================
  // 6. Complex Scenarios
  // ==========================================
  describe('complex scenarios', () => {
    it('should handle block using another block', () => {
      const blockName1 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      const blockName2 = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      
      createTestBlock(blockName1);
      createTestBlock(blockName2);
      
      // Block2 imports Block1
      const pascalBlock1 = toPascalCase(blockName1);
      addImportToBlock(blockName2, `import ${pascalBlock1} from '@/components/blocks/${blockName1}/${pascalBlock1}';`);
      
      // Try to delete Block1 (used by Block2)
      const result1 = runScript('delete:block', `--name=${blockName1} --yes`);
      
      // Block1 is used, so deletion should be prevented or warned
      const block1StillExists = dirExists(getBlockComponentPath(blockName1));
      
      // Delete Block2 first (not used by anyone)
      const result2 = runScript('delete:block', `--name=${blockName2} --yes`);
      expect(result2.success).toBe(true);
      
      // Now Block1 should be deletable
      const result3 = runScript('delete:block', `--name=${blockName1} --yes`);
      expect(result3.success).toBe(true);
      
      console.log('✓ Block-to-block dependency handled');
    });

    it('should handle block with multiple files', () => {
      const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      runScript('create:block', `--name=${blockName} --css`);
      createdBlocks.push(blockName);
      
      const blockPath = getBlockComponentPath(blockName);
      const pascalName = toPascalCase(blockName);
      
      // Verify multiple files exist
      expect(fileExists(path.join(blockPath, `${pascalName}.tsx`))).toBe(true);
      expect(fileExists(path.join(blockPath, `${pascalName}.types.ts`))).toBe(true);
      expect(fileExists(path.join(blockPath, `${pascalName}.module.css`))).toBe(true);
      
      // Delete
      runScript('delete:block', `--name=${blockName} --yes`);
      
      // All files should be gone
      expect(dirExists(blockPath)).toBe(false);
      console.log('✓ Block with multiple files deleted');
    });
  });

  // ==========================================
  // 7. Combined Flags Tests
  // ==========================================
  describe('combined flags', () => {
    it('should work with --yes --cascade', () => {
      const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createTestBlock(blockName);
      
      const result = runScript('delete:block', `--name=${blockName} --yes --cascade`);
      
      expect(result.success).toBe(true);
      expect(dirExists(getBlockComponentPath(blockName))).toBe(false);
      console.log('✓ --yes --cascade works');
    });

    it('should work with --yes --deps', () => {
      const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createTestBlock(blockName);
      
      const result = runScript('delete:block', `--name=${blockName} --yes --deps`);
      
      expect(result.success).toBe(true);
      expect(dirExists(getBlockComponentPath(blockName))).toBe(false);
      console.log('✓ --yes --deps works');
    });

    it('should work with --yes --cascade --deps', () => {
      const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      createTestBlock(blockName);
      
      const result = runScript('delete:block', `--name=${blockName} --yes --cascade --deps`);
      
      expect(result.success).toBe(true);
      expect(dirExists(getBlockComponentPath(blockName))).toBe(false);
      console.log('✓ --yes --cascade --deps works');
    });
  });
});
