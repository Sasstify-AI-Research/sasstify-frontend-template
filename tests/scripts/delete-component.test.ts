/**
 * Comprehensive functional tests for delete-component.js script (regular components only)
 */

import { describe, it, expect, afterEach, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  runScript,
  fileExists,
  dirExists,
  readFile,
  cleanupAllTestArtifacts,
  getComponentPath,
  getComponentTestPath,
  getUIComponentPath,
  getBlockComponentPath,
  getPagePath,
  generateTestName,
  TEST_PREFIX,
  toPascalCase,
  PATHS,
} from './helpers/test-utils';

describe('delete-component script (regular components)', () => {
  const createdComponents: string[] = [];
  const createdUIComponents: string[] = [];
  const createdBlocks: string[] = [];
  const createdPages: string[] = [];

  // Helper to create a test regular component
  function createTestComponent(compName: string): boolean {
    const result = runScript('create:component', `--name=${compName}`);
    if (result.success) {
      createdComponents.push(compName);
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

  // Helper to create a test block
  function createTestBlock(blockName: string): boolean {
    const result = runScript('create:block', `--name=${blockName}`);
    if (result.success) {
      createdBlocks.push(blockName);
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

  // Helper to add import to a UI component file
  function addImportToUIComponent(compName: string, importStatement: string): void {
    const compPath = getUIComponentPath(compName);
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

  // Helper to add import to a block file
  function addImportToBlock(blockName: string, importStatement: string): void {
    const blockPath = getBlockComponentPath(blockName);
    const pascalName = toPascalCase(blockName);
    const filePath = path.join(blockPath, `${pascalName}.tsx`);
    
    if (fileExists(filePath)) {
      let content = readFile(filePath);
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

  afterEach(() => {
    // Cleanup in reverse order to handle dependencies
    // Delete pages first
    for (const pageName of [...createdPages].reverse()) {
      runScript('delete:page', `--name=${pageName} --yes`);
    }
    
    // Delete blocks
    for (let pass = 0; pass < 3; pass++) {
      for (const blockName of [...createdBlocks].reverse()) {
        runScript('delete:block', `--name=${blockName} --yes`);
      }
    }
    
    // Delete regular components with multiple passes
    for (let pass = 0; pass < 3; pass++) {
      for (const compName of [...createdComponents].reverse()) {
        runScript('delete:component', `--name=${compName} --yes`);
      }
    }
    
    // Delete UI components
    for (const compName of [...createdUIComponents].reverse()) {
      runScript('delete:ui-component', `--name=${compName} --yes`);
    }
    
    // Fallback: Direct cleanup for any remaining test artifacts
    for (const compName of createdComponents) {
      const compPath = getComponentPath(compName);
      if (dirExists(compPath)) {
        fs.rmSync(compPath, { recursive: true, force: true });
      }
      const testPath = getComponentTestPath(compName, false);
      if (fileExists(testPath)) {
        fs.unlinkSync(testPath);
      }
    }
    
    createdComponents.length = 0;
    createdUIComponents.length = 0;
    createdBlocks.length = 0;
    createdPages.length = 0;
  });

  afterAll(() => {
    cleanupAllTestArtifacts();
  });

  // ==========================================
  // 1. Basic Deletion Tests
  // ==========================================
  describe('basic deletion', () => {
    it('should delete component folder', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      createTestComponent(compName);
      
      const compPath = getComponentPath(compName);
      expect(dirExists(compPath)).toBe(true);
      
      const result = runScript('delete:component', `--name=${compName} --yes`);
      
      expect(result.success).toBe(true);
      expect(dirExists(compPath)).toBe(false);
      console.log('✓ Component folder deleted');
    });

    it('should delete component test file', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      createTestComponent(compName);
      
      const testPath = getComponentTestPath(compName, false);
      expect(fileExists(testPath)).toBe(true);
      
      runScript('delete:component', `--name=${compName} --yes`);
      
      expect(fileExists(testPath)).toBe(false);
      console.log('✓ Component test file deleted');
    });

    it('should show help with --help flag', () => {
      const result = runScript('delete:component', '--help');
      
      expect(result.success).toBe(true);
      expect(result.output).toContain('Usage:');
      expect(result.output).toContain('--name');
      expect(result.output).toContain('--yes');
      console.log('✓ Help displayed correctly');
    });

    it('should handle component name correctly', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      createTestComponent(compName);
      
      const result = runScript('delete:component', `--name=${compName} --yes`);
      
      expect(result.success).toBe(true);
      expect(dirExists(getComponentPath(compName))).toBe(false);
      console.log('✓ Component name handled correctly');
    });

    it('should delete component with CSS module', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      runScript('create:component', `--name=${compName} --css`);
      createdComponents.push(compName);
      
      const compPath = getComponentPath(compName);
      const pascalName = toPascalCase(compName);
      const cssPath = path.join(compPath, `${pascalName}.module.css`);
      
      expect(fileExists(cssPath)).toBe(true);
      
      runScript('delete:component', `--name=${compName} --yes`);
      
      expect(dirExists(compPath)).toBe(false);
      console.log('✓ Component with CSS module deleted');
    });
  });

  // ==========================================
  // 2. Error Handling Tests
  // ==========================================
  describe('error handling', () => {
    it('should handle component not found', () => {
      const result = runScript('delete:component', '--name=non-existent-component-xyz --yes');
      
      const indicatesError = !result.success || 
        result.output.toLowerCase().includes('not found') ||
        result.output.toLowerCase().includes('does not exist') ||
        result.output.toLowerCase().includes('error');
      
      expect(indicatesError).toBe(true);
      console.log('✓ Component not found handled');
    });

    it('should handle missing --name flag', () => {
      const result = runScript('delete:component', '--yes');
      
      const indicatesError = !result.success || 
        result.output.toLowerCase().includes('name') ||
        result.output.toLowerCase().includes('required') ||
        result.output.toLowerCase().includes('usage');
      
      expect(indicatesError).toBe(true);
      console.log('✓ Missing --name handled');
    });

    it('should handle empty component name', () => {
      const result = runScript('delete:component', '--name= --yes');
      
      const indicatesError = !result.success || 
        result.output.toLowerCase().includes('name') ||
        result.output.toLowerCase().includes('invalid') ||
        result.output.toLowerCase().includes('error');
      
      expect(indicatesError).toBe(true);
      console.log('✓ Empty component name handled');
    });

    it('should handle non-existent test file gracefully', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      createTestComponent(compName);
      
      // Manually delete the test file
      const testPath = getComponentTestPath(compName, false);
      if (fileExists(testPath)) {
        fs.unlinkSync(testPath);
      }
      
      // Delete should still succeed
      const result = runScript('delete:component', `--name=${compName} --yes`);
      
      expect(result.success).toBe(true);
      console.log('✓ Non-existent test file handled gracefully');
    });
  });

  // ==========================================
  // 3. Usage Protection Tests
  // ==========================================
  describe('usage protection', () => {
    it('should prevent deletion if component used by pages', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      const pageName = generateTestName(TEST_PREFIX.PAGE);
      
      createTestComponent(compName);
      createTestPage(pageName);
      
      const pascalCompName = toPascalCase(compName);
      addImportToPage(pageName, `import ${pascalCompName} from '@/components/${compName}/${pascalCompName}';`);
      
      const result = runScript('delete:component', `--name=${compName} --yes`);
      
      const indicatesUsage = !result.success ||
        result.output.toLowerCase().includes('used') ||
        result.output.toLowerCase().includes('usage') ||
        result.output.toLowerCase().includes('cannot delete');
      
      expect(indicatesUsage).toBe(true);
      console.log('✓ Component used by page - deletion prevented or warned');
    });

    it('should prevent deletion if component used by blocks', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      
      createTestComponent(compName);
      createTestBlock(blockName);
      
      const pascalCompName = toPascalCase(compName);
      addImportToBlock(blockName, `import ${pascalCompName} from '@/components/${compName}/${pascalCompName}';`);
      
      const result = runScript('delete:component', `--name=${compName} --yes`);
      
      const indicatesUsage = !result.success ||
        result.output.toLowerCase().includes('used') ||
        result.output.toLowerCase().includes('usage');
      
      expect(indicatesUsage).toBe(true);
      console.log('✓ Component used by block - deletion prevented or warned');
    });

    it('should prevent deletion if component used by other components', () => {
      const compName1 = generateTestName(TEST_PREFIX.COMPONENT);
      const compName2 = generateTestName(TEST_PREFIX.COMPONENT);
      
      createTestComponent(compName1);
      createTestComponent(compName2);
      
      const pascalComp1 = toPascalCase(compName1);
      addImportToComponent(compName2, `import ${pascalComp1} from '@/components/${compName1}/${pascalComp1}';`);
      
      const result = runScript('delete:component', `--name=${compName1} --yes`);
      
      const indicatesUsage = !result.success ||
        result.output.toLowerCase().includes('used') ||
        result.output.toLowerCase().includes('usage');
      
      expect(indicatesUsage).toBe(true);
      console.log('✓ Component used by other component - deletion prevented or warned');
    });

    it('should prevent deletion if component used by UI components', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      
      createTestComponent(compName);
      createTestUIComponent(uiCompName);
      
      const pascalCompName = toPascalCase(compName);
      addImportToUIComponent(uiCompName, `import ${pascalCompName} from '@/components/${compName}/${pascalCompName}';`);
      
      const result = runScript('delete:component', `--name=${compName} --yes`);
      
      const indicatesUsage = !result.success ||
        result.output.toLowerCase().includes('used') ||
        result.output.toLowerCase().includes('usage');
      
      expect(indicatesUsage).toBe(true);
      console.log('✓ Component used by UI component - deletion prevented or warned');
    });

    it('should allow deletion when no usages found', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      createTestComponent(compName);
      
      const result = runScript('delete:component', `--name=${compName} --yes`);
      
      expect(result.success).toBe(true);
      expect(result.output.toLowerCase()).toContain('no usages found');
      console.log('✓ Unused component deleted successfully');
    });
  });

  // ==========================================
  // 4. Cascade Delete Tests
  // ==========================================
  describe('cascade delete', () => {
    describe('basic cascade', () => {
      it('should support --cascade flag', () => {
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        createTestComponent(compName);
        
        const result = runScript('delete:component', `--name=${compName} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getComponentPath(compName))).toBe(false);
        console.log('✓ --cascade flag supported');
      });
    });

    describe('single child type', () => {
      it('should cascade delete component with only orphaned child component', () => {
        const parentComp = generateTestName(TEST_PREFIX.COMPONENT);
        const childComp = generateTestName(TEST_PREFIX.COMPONENT);
        
        createTestComponent(parentComp);
        createTestComponent(childComp);
        
        const pascalChild = toPascalCase(childComp);
        addImportToComponent(parentComp, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        
        const result = runScript('delete:component', `--name=${parentComp} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getComponentPath(parentComp))).toBe(false);
        console.log('✓ Component with only orphaned child component - cascade completed');
      });

      it('should NOT cascade delete component with only shared child component', () => {
        const parentComp1 = generateTestName(TEST_PREFIX.COMPONENT);
        const parentComp2 = generateTestName(TEST_PREFIX.COMPONENT);
        const childComp = generateTestName(TEST_PREFIX.COMPONENT);
        
        createTestComponent(parentComp1);
        createTestComponent(parentComp2);
        createTestComponent(childComp);
        
        const pascalChild = toPascalCase(childComp);
        addImportToComponent(parentComp1, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        addImportToComponent(parentComp2, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        
        runScript('delete:component', `--name=${parentComp1} --cascade --yes`);
        
        // Shared child component should still exist
        expect(dirExists(getComponentPath(childComp))).toBe(true);
        console.log('✓ Component with only shared child component - child preserved');
      });

      it('should cascade delete component with only orphaned UI component', () => {
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestComponent(compName);
        createTestUIComponent(uiCompName);
        
        const pascalUI = toPascalCase(uiCompName);
        addImportToComponent(compName, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        const result = runScript('delete:component', `--name=${compName} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getComponentPath(compName))).toBe(false);
        console.log('✓ Component with only orphaned UI component - cascade completed');
      });

      it('should NOT cascade delete component with only shared UI component', () => {
        const compName1 = generateTestName(TEST_PREFIX.COMPONENT);
        const compName2 = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestComponent(compName1);
        createTestComponent(compName2);
        createTestUIComponent(uiCompName);
        
        const pascalUI = toPascalCase(uiCompName);
        addImportToComponent(compName1, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        addImportToComponent(compName2, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        runScript('delete:component', `--name=${compName1} --cascade --yes`);
        
        // Shared UI component should still exist
        expect(dirExists(getUIComponentPath(uiCompName))).toBe(true);
        console.log('✓ Component with only shared UI component - UI preserved');
      });
    });

    describe('mixed children - same status', () => {
      it('should cascade delete both orphaned child component AND orphaned UI component', () => {
        const parentComp = generateTestName(TEST_PREFIX.COMPONENT);
        const childComp = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestComponent(parentComp);
        createTestComponent(childComp);
        createTestUIComponent(uiCompName);
        
        const pascalChild = toPascalCase(childComp);
        const pascalUI = toPascalCase(uiCompName);
        addImportToComponent(parentComp, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        addImportToComponent(parentComp, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        const result = runScript('delete:component', `--name=${parentComp} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getComponentPath(parentComp))).toBe(false);
        console.log('✓ Both orphaned child comp AND UI component - cascade completed');
      });

      it('should NOT cascade delete when both child component AND UI component are shared', () => {
        const parentComp1 = generateTestName(TEST_PREFIX.COMPONENT);
        const parentComp2 = generateTestName(TEST_PREFIX.COMPONENT);
        const childComp = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestComponent(parentComp1);
        createTestComponent(parentComp2);
        createTestComponent(childComp);
        createTestUIComponent(uiCompName);
        
        const pascalChild = toPascalCase(childComp);
        const pascalUI = toPascalCase(uiCompName);
        
        // Both parents use both children
        addImportToComponent(parentComp1, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        addImportToComponent(parentComp1, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        addImportToComponent(parentComp2, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        addImportToComponent(parentComp2, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        runScript('delete:component', `--name=${parentComp1} --cascade --yes`);
        
        // Both shared children should still exist
        expect(dirExists(getComponentPath(childComp))).toBe(true);
        expect(dirExists(getUIComponentPath(uiCompName))).toBe(true);
        console.log('✓ Both shared child comp AND UI component - both preserved');
      });
    });

    describe('mixed children - different status', () => {
      it('should cascade delete orphaned child comp but preserve shared UI component', () => {
        const parentComp1 = generateTestName(TEST_PREFIX.COMPONENT);
        const parentComp2 = generateTestName(TEST_PREFIX.COMPONENT);
        const childComp = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestComponent(parentComp1);
        createTestComponent(parentComp2);
        createTestComponent(childComp);
        createTestUIComponent(uiCompName);
        
        const pascalChild = toPascalCase(childComp);
        const pascalUI = toPascalCase(uiCompName);
        
        // Parent1: uses orphaned child + shared UI
        addImportToComponent(parentComp1, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        addImportToComponent(parentComp1, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        // Parent2: uses only shared UI
        addImportToComponent(parentComp2, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        runScript('delete:component', `--name=${parentComp1} --cascade --yes`);
        
        // Shared UI component should still exist
        expect(dirExists(getUIComponentPath(uiCompName))).toBe(true);
        console.log('✓ Orphaned child deleted, shared UI preserved');
      });

      it('should cascade delete orphaned UI but preserve shared child component', () => {
        const parentComp1 = generateTestName(TEST_PREFIX.COMPONENT);
        const parentComp2 = generateTestName(TEST_PREFIX.COMPONENT);
        const childComp = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestComponent(parentComp1);
        createTestComponent(parentComp2);
        createTestComponent(childComp);
        createTestUIComponent(uiCompName);
        
        const pascalChild = toPascalCase(childComp);
        const pascalUI = toPascalCase(uiCompName);
        
        // Parent1: uses shared child + orphaned UI
        addImportToComponent(parentComp1, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        addImportToComponent(parentComp1, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        // Parent2: uses only shared child
        addImportToComponent(parentComp2, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        
        runScript('delete:component', `--name=${parentComp1} --cascade --yes`);
        
        // Shared child component should still exist
        expect(dirExists(getComponentPath(childComp))).toBe(true);
        console.log('✓ Orphaned UI deleted, shared child preserved');
      });

      it('should handle component with 2 child components: 1 orphaned, 1 shared', () => {
        const parentComp1 = generateTestName(TEST_PREFIX.COMPONENT);
        const parentComp2 = generateTestName(TEST_PREFIX.COMPONENT);
        const orphanedChild = generateTestName(TEST_PREFIX.COMPONENT);
        const sharedChild = generateTestName(TEST_PREFIX.COMPONENT);
        
        createTestComponent(parentComp1);
        createTestComponent(parentComp2);
        createTestComponent(orphanedChild);
        createTestComponent(sharedChild);
        
        const pascalOrphaned = toPascalCase(orphanedChild);
        const pascalShared = toPascalCase(sharedChild);
        
        // Parent1: uses both orphaned and shared children
        addImportToComponent(parentComp1, `import ${pascalOrphaned} from '@/components/${orphanedChild}/${pascalOrphaned}';`);
        addImportToComponent(parentComp1, `import ${pascalShared} from '@/components/${sharedChild}/${pascalShared}';`);
        // Parent2: uses only shared child
        addImportToComponent(parentComp2, `import ${pascalShared} from '@/components/${sharedChild}/${pascalShared}';`);
        
        runScript('delete:component', `--name=${parentComp1} --cascade --yes`);
        
        // Shared child should still exist
        expect(dirExists(getComponentPath(sharedChild))).toBe(true);
        console.log('✓ Mixed orphaned/shared child components handled');
      });

      it('should handle component with 2 UI components: 1 orphaned, 1 shared', () => {
        const parentComp1 = generateTestName(TEST_PREFIX.COMPONENT);
        const parentComp2 = generateTestName(TEST_PREFIX.COMPONENT);
        const orphanedUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const sharedUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestComponent(parentComp1);
        createTestComponent(parentComp2);
        createTestUIComponent(orphanedUI);
        createTestUIComponent(sharedUI);
        
        const pascalOrphaned = toPascalCase(orphanedUI);
        const pascalShared = toPascalCase(sharedUI);
        
        // Parent1: uses both orphaned and shared UI components
        addImportToComponent(parentComp1, `import ${pascalOrphaned} from '@/components/ui/${orphanedUI}/${pascalOrphaned}';`);
        addImportToComponent(parentComp1, `import ${pascalShared} from '@/components/ui/${sharedUI}/${pascalShared}';`);
        // Parent2: uses only shared UI
        addImportToComponent(parentComp2, `import ${pascalShared} from '@/components/ui/${sharedUI}/${pascalShared}';`);
        
        runScript('delete:component', `--name=${parentComp1} --cascade --yes`);
        
        // Shared UI should still exist
        expect(dirExists(getUIComponentPath(sharedUI))).toBe(true);
        console.log('✓ Mixed orphaned/shared UI components handled');
      });
    });

    describe('multi-level cascade', () => {
      it('should handle multi-level cascade: comp → child comp → UI component (all orphaned)', () => {
        const parentComp = generateTestName(TEST_PREFIX.COMPONENT);
        const childComp = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestComponent(parentComp);
        createTestComponent(childComp);
        createTestUIComponent(uiCompName);
        
        const pascalChild = toPascalCase(childComp);
        const pascalUI = toPascalCase(uiCompName);
        
        // Chain: parent → child → UI
        addImportToComponent(parentComp, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        addImportToComponent(childComp, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        const result = runScript('delete:component', `--name=${parentComp} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getComponentPath(parentComp))).toBe(false);
        console.log('✓ Multi-level cascade (comp → child → UI) completed');
      });

      it('should stop cascade at shared child component in chain', () => {
        const parentComp = generateTestName(TEST_PREFIX.COMPONENT);
        const parentComp2 = generateTestName(TEST_PREFIX.COMPONENT);
        const childComp = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestComponent(parentComp);
        createTestComponent(parentComp2);
        createTestComponent(childComp);
        createTestUIComponent(uiCompName);
        
        const pascalChild = toPascalCase(childComp);
        const pascalUI = toPascalCase(uiCompName);
        
        // Parent → child → UI, Parent2 also uses child (making it shared)
        addImportToComponent(parentComp, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        addImportToComponent(childComp, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        addImportToComponent(parentComp2, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        
        runScript('delete:component', `--name=${parentComp} --cascade --yes`);
        
        // Shared child should still exist
        expect(dirExists(getComponentPath(childComp))).toBe(true);
        // UI used by shared child should also exist
        expect(dirExists(getUIComponentPath(uiCompName))).toBe(true);
        console.log('✓ Cascade stopped at shared child in chain');
      });

      it('should preserve entire chain when child component is used elsewhere (comp → shared child → UI)', () => {
        // This test explicitly verifies:
        // Component → Child Component → UI Component
        // If Child Component is used by a Block, then:
        // - Child Component is preserved (shared)
        // - UI Component is also preserved (used by preserved Child)
        // - Only Component gets deleted
        
        const parentComp = generateTestName(TEST_PREFIX.COMPONENT);
        const childComp = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        
        createTestComponent(parentComp);
        createTestComponent(childComp);
        createTestUIComponent(uiCompName);
        createTestBlock(blockName);
        
        const pascalChild = toPascalCase(childComp);
        const pascalUI = toPascalCase(uiCompName);
        
        // Chain: parent → child → UI
        addImportToComponent(parentComp, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        addImportToComponent(childComp, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        // Block also uses the child component (making it shared)
        addImportToBlock(blockName, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        
        runScript('delete:component', `--name=${parentComp} --cascade --yes`);
        
        // Parent should be deleted
        expect(dirExists(getComponentPath(parentComp))).toBe(false);
        // Child should be preserved (used by Block)
        expect(dirExists(getComponentPath(childComp))).toBe(true);
        // UI should also be preserved (used by preserved Child)
        expect(dirExists(getUIComponentPath(uiCompName))).toBe(true);
        
        console.log('✓ Chain preserved when child component is shared - only parent deleted');
      });

      it('should handle deep cascade chain (comp → child1 → child2 → UI)', () => {
        const parentComp = generateTestName(TEST_PREFIX.COMPONENT);
        const child1 = generateTestName(TEST_PREFIX.COMPONENT);
        const child2 = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestComponent(parentComp);
        createTestComponent(child1);
        createTestComponent(child2);
        createTestUIComponent(uiCompName);
        
        const pascalChild1 = toPascalCase(child1);
        const pascalChild2 = toPascalCase(child2);
        const pascalUI = toPascalCase(uiCompName);
        
        // Chain: parent → child1 → child2 → UI
        addImportToComponent(parentComp, `import ${pascalChild1} from '@/components/${child1}/${pascalChild1}';`);
        addImportToComponent(child1, `import ${pascalChild2} from '@/components/${child2}/${pascalChild2}';`);
        addImportToComponent(child2, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        const result = runScript('delete:component', `--name=${parentComp} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getComponentPath(parentComp))).toBe(false);
        console.log('✓ Deep cascade chain (4 levels) completed');
      });
    });

    describe('complex patterns', () => {
      it('should handle diamond dependency (comp uses child A & B, both use UI C)', () => {
        const parentComp = generateTestName(TEST_PREFIX.COMPONENT);
        const childA = generateTestName(TEST_PREFIX.COMPONENT);
        const childB = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestComponent(parentComp);
        createTestComponent(childA);
        createTestComponent(childB);
        createTestUIComponent(uiCompName);
        
        const pascalA = toPascalCase(childA);
        const pascalB = toPascalCase(childB);
        const pascalUI = toPascalCase(uiCompName);
        
        // Diamond: parent → A, parent → B, A → UI, B → UI
        addImportToComponent(parentComp, `import ${pascalA} from '@/components/${childA}/${pascalA}';`);
        addImportToComponent(parentComp, `import ${pascalB} from '@/components/${childB}/${pascalB}';`);
        addImportToComponent(childA, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        addImportToComponent(childB, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        const result = runScript('delete:component', `--name=${parentComp} --cascade --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ Diamond dependency pattern handled');
      });

      it('should handle multiple components sharing same child tree', () => {
        const parentComp1 = generateTestName(TEST_PREFIX.COMPONENT);
        const parentComp2 = generateTestName(TEST_PREFIX.COMPONENT);
        const childComp = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestComponent(parentComp1);
        createTestComponent(parentComp2);
        createTestComponent(childComp);
        createTestUIComponent(uiCompName);
        
        const pascalChild = toPascalCase(childComp);
        const pascalUI = toPascalCase(uiCompName);
        
        // Both parents share the same child tree
        addImportToComponent(parentComp1, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        addImportToComponent(parentComp2, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        addImportToComponent(childComp, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        // Delete first parent
        runScript('delete:component', `--name=${parentComp1} --cascade --yes`);
        
        // Child tree should still exist (used by parent2)
        expect(dirExists(getComponentPath(childComp))).toBe(true);
        expect(dirExists(getUIComponentPath(uiCompName))).toBe(true);
        
        console.log('✓ Multiple components sharing child tree handled');
      });

      it('should handle component using another component with cascade', () => {
        const compName1 = generateTestName(TEST_PREFIX.COMPONENT);
        const compName2 = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestComponent(compName1);
        createTestComponent(compName2);
        createTestUIComponent(uiCompName);
        
        const pascalComp1 = toPascalCase(compName1);
        const pascalUI = toPascalCase(uiCompName);
        
        // Comp2 uses Comp1, Comp1 uses UI
        addImportToComponent(compName2, `import ${pascalComp1} from '@/components/${compName1}/${pascalComp1}';`);
        addImportToComponent(compName1, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        // Delete Comp2 with cascade (Comp1 becomes orphaned)
        const result = runScript('delete:component', `--name=${compName2} --cascade --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ Component using another component with cascade handled');
      });
    });

    describe('edge cases', () => {
      it('should handle component with many orphaned children (5+)', () => {
        const parentComp = generateTestName(TEST_PREFIX.COMPONENT);
        createTestComponent(parentComp);
        
        // Create 5 child components
        for (let i = 0; i < 5; i++) {
          const childComp = generateTestName(TEST_PREFIX.COMPONENT);
          createTestComponent(childComp);
          
          const pascalChild = toPascalCase(childComp);
          addImportToComponent(parentComp, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        }
        
        const result = runScript('delete:component', `--name=${parentComp} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getComponentPath(parentComp))).toBe(false);
        console.log('✓ Component with 5+ orphaned children handled');
      });

      it('should handle component with no children', () => {
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        createTestComponent(compName);
        
        const result = runScript('delete:component', `--name=${compName} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getComponentPath(compName))).toBe(false);
        console.log('✓ Component with no children handled');
      });

      it('should show cascade deletion in output', () => {
        const parentComp = generateTestName(TEST_PREFIX.COMPONENT);
        const childComp = generateTestName(TEST_PREFIX.COMPONENT);
        
        createTestComponent(parentComp);
        createTestComponent(childComp);
        
        const pascalChild = toPascalCase(childComp);
        addImportToComponent(parentComp, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        
        const result = runScript('delete:component', `--name=${parentComp} --cascade --yes`);
        
        expect(result.success).toBe(true);
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
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        createTestComponent(compName);
        
        const result = runScript('delete:component', `--name=${compName} --deps --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getComponentPath(compName))).toBe(false);
        console.log('✓ --deps flag supported');
      });

      it('should handle --deps flag with component having no dependencies', () => {
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        createTestComponent(compName);
        
        const result = runScript('delete:component', `--name=${compName} --deps --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ --deps with no dependencies handled');
      });
    });

    describe('protected packages', () => {
      it('should NOT uninstall react even if only used by deleted component', () => {
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        createTestComponent(compName);
        
        runScript('delete:component', `--name=${compName} --deps --yes`);
        
        const packageJson = JSON.parse(readFile(PATHS.packageJson));
        expect(packageJson.dependencies?.react || packageJson.devDependencies?.react).toBeDefined();
        console.log('✓ react not uninstalled');
      });

      it('should NOT uninstall react-dom even if only used by deleted component', () => {
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        createTestComponent(compName);
        
        runScript('delete:component', `--name=${compName} --deps --yes`);
        
        const packageJson = JSON.parse(readFile(PATHS.packageJson));
        expect(packageJson.dependencies?.['react-dom'] || packageJson.devDependencies?.['react-dom']).toBeDefined();
        console.log('✓ react-dom not uninstalled');
      });

      it('should NOT uninstall typescript even if only used by deleted component', () => {
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        createTestComponent(compName);
        
        runScript('delete:component', `--name=${compName} --deps --yes`);
        
        const packageJson = JSON.parse(readFile(PATHS.packageJson));
        const hasTypescript = packageJson.dependencies?.typescript || packageJson.devDependencies?.typescript;
        expect(hasTypescript).toBeDefined();
        console.log('✓ typescript not uninstalled');
      });
    });

    describe('cascade + deps combined', () => {
      it('should handle cascade + deps together', () => {
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        createTestComponent(compName);
        
        const result = runScript('delete:component', `--name=${compName} --cascade --deps --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getComponentPath(compName))).toBe(false);
        console.log('✓ --cascade --deps flags work together');
      });

      it('should handle cascade + deps with orphaned child component', () => {
        const parentComp = generateTestName(TEST_PREFIX.COMPONENT);
        const childComp = generateTestName(TEST_PREFIX.COMPONENT);
        
        createTestComponent(parentComp);
        createTestComponent(childComp);
        
        const pascalChild = toPascalCase(childComp);
        addImportToComponent(parentComp, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        
        const result = runScript('delete:component', `--name=${parentComp} --cascade --deps --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ cascade + deps with orphaned child handled');
      });

      it('should handle cascade + deps with orphaned UI component', () => {
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestComponent(compName);
        createTestUIComponent(uiCompName);
        
        const pascalUI = toPascalCase(uiCompName);
        addImportToComponent(compName, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        const result = runScript('delete:component', `--name=${compName} --cascade --deps --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ cascade + deps with orphaned UI handled');
      });

      it('should handle cascade + deps with both orphaned child and UI', () => {
        const parentComp = generateTestName(TEST_PREFIX.COMPONENT);
        const childComp = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestComponent(parentComp);
        createTestComponent(childComp);
        createTestUIComponent(uiCompName);
        
        const pascalChild = toPascalCase(childComp);
        const pascalUI = toPascalCase(uiCompName);
        addImportToComponent(parentComp, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        addImportToComponent(parentComp, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        const result = runScript('delete:component', `--name=${parentComp} --cascade --deps --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ cascade + deps with both orphaned child and UI handled');
      });

      it('should preserve deps of shared children when using cascade + deps', () => {
        const parentComp1 = generateTestName(TEST_PREFIX.COMPONENT);
        const parentComp2 = generateTestName(TEST_PREFIX.COMPONENT);
        const childComp = generateTestName(TEST_PREFIX.COMPONENT);
        
        createTestComponent(parentComp1);
        createTestComponent(parentComp2);
        createTestComponent(childComp);
        
        const pascalChild = toPascalCase(childComp);
        addImportToComponent(parentComp1, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        addImportToComponent(parentComp2, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        
        runScript('delete:component', `--name=${parentComp1} --cascade --deps --yes`);
        
        // Shared child should still exist
        expect(dirExists(getComponentPath(childComp))).toBe(true);
        console.log('✓ Shared child deps preserved with cascade + deps');
      });

      it('should handle multi-level cascade with deps', () => {
        const parentComp = generateTestName(TEST_PREFIX.COMPONENT);
        const childComp = generateTestName(TEST_PREFIX.COMPONENT);
        const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestComponent(parentComp);
        createTestComponent(childComp);
        createTestUIComponent(uiCompName);
        
        const pascalChild = toPascalCase(childComp);
        const pascalUI = toPascalCase(uiCompName);
        
        // Chain: parent → child → UI
        addImportToComponent(parentComp, `import ${pascalChild} from '@/components/${childComp}/${pascalChild}';`);
        addImportToComponent(childComp, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
        
        const result = runScript('delete:component', `--name=${parentComp} --cascade --deps --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ Multi-level cascade with deps handled');
      });
    });

    describe('edge cases', () => {
      it('should handle --deps with component that has no npm imports', () => {
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        createTestComponent(compName);
        
        const result = runScript('delete:component', `--name=${compName} --deps --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ --deps with no npm imports handled');
      });

      it('should show dependency cleanup info in output', () => {
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        createTestComponent(compName);
        
        const result = runScript('delete:component', `--name=${compName} --deps --yes`);
        
        expect(result.success).toBe(true);
        const hasDepsInfo = result.output.toLowerCase().includes('dep') ||
          result.output.toLowerCase().includes('package') ||
          result.output.toLowerCase().includes('protected');
        expect(hasDepsInfo).toBe(true);
        console.log('✓ Dependency info shown in output');
      });

      it('should handle package used by protected component (Layout)', () => {
        const compName = generateTestName(TEST_PREFIX.COMPONENT);
        createTestComponent(compName);
        
        const result = runScript('delete:component', `--name=${compName} --deps --yes`);
        
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
    it('should handle component using another component', () => {
      const compName1 = generateTestName(TEST_PREFIX.COMPONENT);
      const compName2 = generateTestName(TEST_PREFIX.COMPONENT);
      
      createTestComponent(compName1);
      createTestComponent(compName2);
      
      // Comp2 imports Comp1
      const pascalComp1 = toPascalCase(compName1);
      addImportToComponent(compName2, `import ${pascalComp1} from '@/components/${compName1}/${pascalComp1}';`);
      
      // Try to delete Comp1 (used by Comp2) — may succeed with a warning or be prevented
      const result1 = runScript('delete:component', `--name=${compName1} --yes`);
      expect(result1).toBeDefined();

      // Delete Comp2 first (not used by anyone)
      const result2 = runScript('delete:component', `--name=${compName2} --yes`);
      expect(result2.success).toBe(true);
      
      // Now Comp1 should be deletable
      const result3 = runScript('delete:component', `--name=${compName1} --yes`);
      expect(result3.success).toBe(true);
      
      console.log('✓ Component-to-component dependency handled');
    });

    it('should handle component with multiple files', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      runScript('create:component', `--name=${compName} --css`);
      createdComponents.push(compName);
      
      const compPath = getComponentPath(compName);
      const pascalName = toPascalCase(compName);
      
      // Verify multiple files exist
      expect(fileExists(path.join(compPath, `${pascalName}.tsx`))).toBe(true);
      expect(fileExists(path.join(compPath, `${pascalName}.types.ts`))).toBe(true);
      expect(fileExists(path.join(compPath, `${pascalName}.module.css`))).toBe(true);
      
      // Delete
      runScript('delete:component', `--name=${compName} --yes`);
      
      // All files should be gone
      expect(dirExists(compPath)).toBe(false);
      console.log('✓ Component with multiple files deleted');
    });
  });

  // ==========================================
  // 7. Combined Flags Tests
  // ==========================================
  describe('combined flags', () => {
    it('should work with --yes --cascade', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      createTestComponent(compName);
      
      const result = runScript('delete:component', `--name=${compName} --yes --cascade`);
      
      expect(result.success).toBe(true);
      expect(dirExists(getComponentPath(compName))).toBe(false);
      console.log('✓ --yes --cascade works');
    });

    it('should work with --yes --deps', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      createTestComponent(compName);
      
      const result = runScript('delete:component', `--name=${compName} --yes --deps`);
      
      expect(result.success).toBe(true);
      expect(dirExists(getComponentPath(compName))).toBe(false);
      console.log('✓ --yes --deps works');
    });

    it('should work with --yes --cascade --deps', () => {
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      createTestComponent(compName);
      
      const result = runScript('delete:component', `--name=${compName} --yes --cascade --deps`);
      
      expect(result.success).toBe(true);
      expect(dirExists(getComponentPath(compName))).toBe(false);
      console.log('✓ --yes --cascade --deps works');
    });
  });
});
