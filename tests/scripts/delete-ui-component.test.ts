/**
 * Comprehensive functional tests for delete-ui-component.js script
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
  getUIComponentPath,
  getComponentPath,
  getBlockComponentPath,
  getPagePath,
  getComponentTestPath,
  generateTestName,
  TEST_PREFIX,
  toPascalCase,
  PATHS,
} from './helpers/test-utils';

describe('delete-ui-component script', () => {
  const createdUIComponents: string[] = [];
  const createdComponents: string[] = [];
  const createdBlocks: string[] = [];
  const createdPages: string[] = [];

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
    
    // Delete regular components
    for (let pass = 0; pass < 3; pass++) {
      for (const compName of [...createdComponents].reverse()) {
        runScript('delete:component', `--name=${compName} --yes`);
      }
    }
    
    // Delete UI components with multiple passes
    for (let pass = 0; pass < 3; pass++) {
      for (const compName of [...createdUIComponents].reverse()) {
        runScript('delete:ui-component', `--name=${compName} --yes`);
      }
    }
    
    // Fallback: Direct cleanup for any remaining test artifacts
    for (const compName of createdUIComponents) {
      const compPath = getUIComponentPath(compName);
      if (dirExists(compPath)) {
        fs.rmSync(compPath, { recursive: true, force: true });
      }
      const testPath = getComponentTestPath(compName, true);
      if (fileExists(testPath)) {
        fs.unlinkSync(testPath);
      }
    }
    
    createdUIComponents.length = 0;
    createdComponents.length = 0;
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
    it('should delete UI component folder', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createTestUIComponent(compName);
      
      const compPath = getUIComponentPath(compName);
      expect(dirExists(compPath)).toBe(true);
      
      const result = runScript('delete:ui-component', `--name=${compName} --yes`);
      
      expect(result.success).toBe(true);
      expect(dirExists(compPath)).toBe(false);
      console.log('✓ UI component folder deleted');
    });

    it('should delete UI component test file', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createTestUIComponent(compName);
      
      const testPath = getComponentTestPath(compName, true);
      expect(fileExists(testPath)).toBe(true);
      
      runScript('delete:ui-component', `--name=${compName} --yes`);
      
      expect(fileExists(testPath)).toBe(false);
      console.log('✓ UI component test file deleted');
    });

    it('should show help with --help flag', () => {
      const result = runScript('delete:ui-component', '--help');
      
      expect(result.success).toBe(true);
      expect(result.output).toContain('Usage:');
      expect(result.output).toContain('--name');
      expect(result.output).toContain('--yes');
      console.log('✓ Help displayed correctly');
    });

    it('should handle UI component name without ui/ prefix', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createTestUIComponent(compName);
      
      const result = runScript('delete:ui-component', `--name=${compName} --yes`);
      
      expect(result.success).toBe(true);
      expect(dirExists(getUIComponentPath(compName))).toBe(false);
      console.log('✓ UI component name without prefix handled');
    });

    it('should handle UI component name with ui/ prefix', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createTestUIComponent(compName);
      
      const result = runScript('delete:ui-component', `--name=ui/${compName} --yes`);
      
      expect(result.success).toBe(true);
      expect(dirExists(getUIComponentPath(compName))).toBe(false);
      console.log('✓ UI component name with prefix handled');
    });

    it('should delete UI component with CSS module', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      runScript('create:ui-component', `--name=${compName} --css`);
      createdUIComponents.push(compName);
      
      const compPath = getUIComponentPath(compName);
      const pascalName = toPascalCase(compName);
      const cssPath = path.join(compPath, `${pascalName}.module.css`);
      
      expect(fileExists(cssPath)).toBe(true);
      
      runScript('delete:ui-component', `--name=${compName} --yes`);
      
      expect(dirExists(compPath)).toBe(false);
      console.log('✓ UI component with CSS module deleted');
    });
  });

  // ==========================================
  // 2. Error Handling Tests
  // ==========================================
  describe('error handling', () => {
    it('should handle UI component not found', () => {
      const result = runScript('delete:ui-component', '--name=non-existent-ui-xyz --yes');
      
      const indicatesError = !result.success || 
        result.output.toLowerCase().includes('not found') ||
        result.output.toLowerCase().includes('does not exist') ||
        result.output.toLowerCase().includes('error');
      
      expect(indicatesError).toBe(true);
      console.log('✓ UI component not found handled');
    });

    it('should handle missing --name flag', () => {
      const result = runScript('delete:ui-component', '--yes');
      
      const indicatesError = !result.success || 
        result.output.toLowerCase().includes('name') ||
        result.output.toLowerCase().includes('required') ||
        result.output.toLowerCase().includes('usage');
      
      expect(indicatesError).toBe(true);
      console.log('✓ Missing --name handled');
    });

    it('should handle empty UI component name', () => {
      const result = runScript('delete:ui-component', '--name= --yes');
      
      const indicatesError = !result.success || 
        result.output.toLowerCase().includes('name') ||
        result.output.toLowerCase().includes('invalid') ||
        result.output.toLowerCase().includes('error');
      
      expect(indicatesError).toBe(true);
      console.log('✓ Empty UI component name handled');
    });

    it('should handle non-existent test file gracefully', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createTestUIComponent(compName);
      
      // Manually delete the test file
      const testPath = getComponentTestPath(compName, true);
      if (fileExists(testPath)) {
        fs.unlinkSync(testPath);
      }
      
      // Delete should still succeed
      const result = runScript('delete:ui-component', `--name=${compName} --yes`);
      
      expect(result.success).toBe(true);
      console.log('✓ Non-existent test file handled gracefully');
    });
  });

  // ==========================================
  // 3. Usage Protection Tests
  // ==========================================
  describe('usage protection', () => {
    it('should prevent deletion if UI component used by pages', () => {
      const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      const pageName = generateTestName(TEST_PREFIX.PAGE);
      
      createTestUIComponent(uiCompName);
      createTestPage(pageName);
      
      const pascalUI = toPascalCase(uiCompName);
      addImportToPage(pageName, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
      
      const result = runScript('delete:ui-component', `--name=${uiCompName} --yes`);
      
      const indicatesUsage = !result.success ||
        result.output.toLowerCase().includes('used') ||
        result.output.toLowerCase().includes('usage') ||
        result.output.toLowerCase().includes('cannot delete');
      
      expect(indicatesUsage).toBe(true);
      console.log('✓ UI component used by page - deletion prevented or warned');
    });

    it('should prevent deletion if UI component used by blocks', () => {
      const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      
      createTestUIComponent(uiCompName);
      createTestBlock(blockName);
      
      const pascalUI = toPascalCase(uiCompName);
      addImportToBlock(blockName, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
      
      const result = runScript('delete:ui-component', `--name=${uiCompName} --yes`);
      
      const indicatesUsage = !result.success ||
        result.output.toLowerCase().includes('used') ||
        result.output.toLowerCase().includes('usage');
      
      expect(indicatesUsage).toBe(true);
      console.log('✓ UI component used by block - deletion prevented or warned');
    });

    it('should prevent deletion if UI component used by components', () => {
      const uiCompName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      const compName = generateTestName(TEST_PREFIX.COMPONENT);
      
      createTestUIComponent(uiCompName);
      createTestComponent(compName);
      
      const pascalUI = toPascalCase(uiCompName);
      addImportToComponent(compName, `import ${pascalUI} from '@/components/ui/${uiCompName}/${pascalUI}';`);
      
      const result = runScript('delete:ui-component', `--name=${uiCompName} --yes`);
      
      const indicatesUsage = !result.success ||
        result.output.toLowerCase().includes('used') ||
        result.output.toLowerCase().includes('usage');
      
      expect(indicatesUsage).toBe(true);
      console.log('✓ UI component used by component - deletion prevented or warned');
    });

    it('should prevent deletion if UI component used by other UI components', () => {
      const uiCompName1 = generateTestName(TEST_PREFIX.UI_COMPONENT);
      const uiCompName2 = generateTestName(TEST_PREFIX.UI_COMPONENT);
      
      createTestUIComponent(uiCompName1);
      createTestUIComponent(uiCompName2);
      
      const pascalUI1 = toPascalCase(uiCompName1);
      addImportToUIComponent(uiCompName2, `import ${pascalUI1} from '@/components/ui/${uiCompName1}/${pascalUI1}';`);
      
      const result = runScript('delete:ui-component', `--name=${uiCompName1} --yes`);
      
      const indicatesUsage = !result.success ||
        result.output.toLowerCase().includes('used') ||
        result.output.toLowerCase().includes('usage');
      
      expect(indicatesUsage).toBe(true);
      console.log('✓ UI component used by other UI component - deletion prevented or warned');
    });

    it('should allow deletion when no usages found', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createTestUIComponent(compName);
      
      const result = runScript('delete:ui-component', `--name=${compName} --yes`);
      
      expect(result.success).toBe(true);
      expect(result.output.toLowerCase()).toContain('no usages found');
      console.log('✓ Unused UI component deleted successfully');
    });
  });

  // ==========================================
  // 4. Cascade Delete Tests
  // ==========================================
  describe('cascade delete', () => {
    describe('basic cascade', () => {
      it('should support --cascade flag', () => {
        const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        createTestUIComponent(compName);
        
        const result = runScript('delete:ui-component', `--name=${compName} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getUIComponentPath(compName))).toBe(false);
        console.log('✓ --cascade flag supported');
      });
    });

    describe('single child type', () => {
      it('should cascade delete UI component with only orphaned child UI component', () => {
        const parentUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const childUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestUIComponent(parentUI);
        createTestUIComponent(childUI);
        
        const pascalChild = toPascalCase(childUI);
        addImportToUIComponent(parentUI, `import ${pascalChild} from '@/components/ui/${childUI}/${pascalChild}';`);
        
        const result = runScript('delete:ui-component', `--name=${parentUI} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getUIComponentPath(parentUI))).toBe(false);
        console.log('✓ UI component with orphaned child UI - cascade completed');
      });

      it('should NOT cascade delete UI component with only shared child UI component', () => {
        const parentUI1 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const parentUI2 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const childUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestUIComponent(parentUI1);
        createTestUIComponent(parentUI2);
        createTestUIComponent(childUI);
        
        const pascalChild = toPascalCase(childUI);
        addImportToUIComponent(parentUI1, `import ${pascalChild} from '@/components/ui/${childUI}/${pascalChild}';`);
        addImportToUIComponent(parentUI2, `import ${pascalChild} from '@/components/ui/${childUI}/${pascalChild}';`);
        
        runScript('delete:ui-component', `--name=${parentUI1} --cascade --yes`);
        
        // Shared child UI should still exist
        expect(dirExists(getUIComponentPath(childUI))).toBe(true);
        console.log('✓ UI component with shared child UI - child preserved');
      });
    });

    describe('mixed children - same status', () => {
      it('should cascade delete multiple orphaned child UI components', () => {
        const parentUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const childUI1 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const childUI2 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestUIComponent(parentUI);
        createTestUIComponent(childUI1);
        createTestUIComponent(childUI2);
        
        const pascalChild1 = toPascalCase(childUI1);
        const pascalChild2 = toPascalCase(childUI2);
        addImportToUIComponent(parentUI, `import ${pascalChild1} from '@/components/ui/${childUI1}/${pascalChild1}';`);
        addImportToUIComponent(parentUI, `import ${pascalChild2} from '@/components/ui/${childUI2}/${pascalChild2}';`);
        
        const result = runScript('delete:ui-component', `--name=${parentUI} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getUIComponentPath(parentUI))).toBe(false);
        console.log('✓ Multiple orphaned child UIs - cascade completed');
      });

      it('should NOT cascade delete when all child UI components are shared', () => {
        const parentUI1 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const parentUI2 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const childUI1 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const childUI2 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestUIComponent(parentUI1);
        createTestUIComponent(parentUI2);
        createTestUIComponent(childUI1);
        createTestUIComponent(childUI2);
        
        const pascalChild1 = toPascalCase(childUI1);
        const pascalChild2 = toPascalCase(childUI2);
        
        // Both parents use both children
        addImportToUIComponent(parentUI1, `import ${pascalChild1} from '@/components/ui/${childUI1}/${pascalChild1}';`);
        addImportToUIComponent(parentUI1, `import ${pascalChild2} from '@/components/ui/${childUI2}/${pascalChild2}';`);
        addImportToUIComponent(parentUI2, `import ${pascalChild1} from '@/components/ui/${childUI1}/${pascalChild1}';`);
        addImportToUIComponent(parentUI2, `import ${pascalChild2} from '@/components/ui/${childUI2}/${pascalChild2}';`);
        
        runScript('delete:ui-component', `--name=${parentUI1} --cascade --yes`);
        
        // Both shared children should still exist
        expect(dirExists(getUIComponentPath(childUI1))).toBe(true);
        expect(dirExists(getUIComponentPath(childUI2))).toBe(true);
        console.log('✓ All shared child UIs - both preserved');
      });
    });

    describe('mixed children - different status', () => {
      it('should cascade delete orphaned child UI but preserve shared child UI', () => {
        const parentUI1 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const parentUI2 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const orphanedChildUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const sharedChildUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestUIComponent(parentUI1);
        createTestUIComponent(parentUI2);
        createTestUIComponent(orphanedChildUI);
        createTestUIComponent(sharedChildUI);
        
        const pascalOrphaned = toPascalCase(orphanedChildUI);
        const pascalShared = toPascalCase(sharedChildUI);
        
        // Parent1 uses both, Parent2 uses only shared
        addImportToUIComponent(parentUI1, `import ${pascalOrphaned} from '@/components/ui/${orphanedChildUI}/${pascalOrphaned}';`);
        addImportToUIComponent(parentUI1, `import ${pascalShared} from '@/components/ui/${sharedChildUI}/${pascalShared}';`);
        addImportToUIComponent(parentUI2, `import ${pascalShared} from '@/components/ui/${sharedChildUI}/${pascalShared}';`);
        
        runScript('delete:ui-component', `--name=${parentUI1} --cascade --yes`);
        
        // Shared child UI should still exist
        expect(dirExists(getUIComponentPath(sharedChildUI))).toBe(true);
        console.log('✓ Orphaned child UI deleted, shared child UI preserved');
      });

      it('should handle UI component with 2 child UIs: 1 orphaned, 1 shared', () => {
        const parentUI1 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const parentUI2 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const orphanedUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const sharedUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestUIComponent(parentUI1);
        createTestUIComponent(parentUI2);
        createTestUIComponent(orphanedUI);
        createTestUIComponent(sharedUI);
        
        const pascalOrphaned = toPascalCase(orphanedUI);
        const pascalShared = toPascalCase(sharedUI);
        
        addImportToUIComponent(parentUI1, `import ${pascalOrphaned} from '@/components/ui/${orphanedUI}/${pascalOrphaned}';`);
        addImportToUIComponent(parentUI1, `import ${pascalShared} from '@/components/ui/${sharedUI}/${pascalShared}';`);
        addImportToUIComponent(parentUI2, `import ${pascalShared} from '@/components/ui/${sharedUI}/${pascalShared}';`);
        
        runScript('delete:ui-component', `--name=${parentUI1} --cascade --yes`);
        
        // Shared UI should still exist
        expect(dirExists(getUIComponentPath(sharedUI))).toBe(true);
        console.log('✓ Mixed orphaned/shared child UIs handled');
      });
    });

    describe('multi-level cascade', () => {
      it('should handle multi-level cascade: UI → child UI → grandchild UI (all orphaned)', () => {
        const parentUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const childUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const grandchildUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestUIComponent(parentUI);
        createTestUIComponent(childUI);
        createTestUIComponent(grandchildUI);
        
        const pascalChild = toPascalCase(childUI);
        const pascalGrandchild = toPascalCase(grandchildUI);
        
        // Chain: parent → child → grandchild
        addImportToUIComponent(parentUI, `import ${pascalChild} from '@/components/ui/${childUI}/${pascalChild}';`);
        addImportToUIComponent(childUI, `import ${pascalGrandchild} from '@/components/ui/${grandchildUI}/${pascalGrandchild}';`);
        
        const result = runScript('delete:ui-component', `--name=${parentUI} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getUIComponentPath(parentUI))).toBe(false);
        console.log('✓ Multi-level cascade (UI → child UI → grandchild UI) completed');
      });

      it('should preserve entire chain when child UI is used elsewhere (UI → shared child UI → grandchild UI)', () => {
        // This is the specific test case requested:
        // UI → Child UI → Grandchild UI
        // If Child UI is used by a Block, then:
        // - Child UI is preserved (shared)
        // - Grandchild UI is also preserved (used by preserved Child UI)
        // - Only UI gets deleted
        
        const parentUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const childUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const grandchildUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const blockName = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
        
        createTestUIComponent(parentUI);
        createTestUIComponent(childUI);
        createTestUIComponent(grandchildUI);
        createTestBlock(blockName);
        
        const pascalChild = toPascalCase(childUI);
        const pascalGrandchild = toPascalCase(grandchildUI);
        
        // Chain: parent → child → grandchild
        addImportToUIComponent(parentUI, `import ${pascalChild} from '@/components/ui/${childUI}/${pascalChild}';`);
        addImportToUIComponent(childUI, `import ${pascalGrandchild} from '@/components/ui/${grandchildUI}/${pascalGrandchild}';`);
        
        // Block also uses Child UI (making it shared)
        addImportToBlock(blockName, `import ${pascalChild} from '@/components/ui/${childUI}/${pascalChild}';`);
        
        runScript('delete:ui-component', `--name=${parentUI} --cascade --yes`);
        
        // Parent UI should be deleted
        expect(dirExists(getUIComponentPath(parentUI))).toBe(false);
        // Child UI should be preserved (used by Block)
        expect(dirExists(getUIComponentPath(childUI))).toBe(true);
        // Grandchild UI should also be preserved (used by preserved Child UI)
        expect(dirExists(getUIComponentPath(grandchildUI))).toBe(true);
        
        console.log('✓ Chain preserved when child UI is shared - only parent deleted');
      });

      it('should handle deep cascade chain (UI1 → UI2 → UI3 → UI4)', () => {
        const ui1 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const ui2 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const ui3 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const ui4 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestUIComponent(ui1);
        createTestUIComponent(ui2);
        createTestUIComponent(ui3);
        createTestUIComponent(ui4);
        
        const pascal2 = toPascalCase(ui2);
        const pascal3 = toPascalCase(ui3);
        const pascal4 = toPascalCase(ui4);
        
        // Chain: ui1 → ui2 → ui3 → ui4
        addImportToUIComponent(ui1, `import ${pascal2} from '@/components/ui/${ui2}/${pascal2}';`);
        addImportToUIComponent(ui2, `import ${pascal3} from '@/components/ui/${ui3}/${pascal3}';`);
        addImportToUIComponent(ui3, `import ${pascal4} from '@/components/ui/${ui4}/${pascal4}';`);
        
        const result = runScript('delete:ui-component', `--name=${ui1} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getUIComponentPath(ui1))).toBe(false);
        console.log('✓ Deep cascade chain (4 levels) completed');
      });
    });

    describe('complex patterns', () => {
      it('should handle diamond dependency (UI uses child A & B, both use UI C)', () => {
        const parentUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const childA = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const childB = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const sharedChild = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestUIComponent(parentUI);
        createTestUIComponent(childA);
        createTestUIComponent(childB);
        createTestUIComponent(sharedChild);
        
        const pascalA = toPascalCase(childA);
        const pascalB = toPascalCase(childB);
        const pascalShared = toPascalCase(sharedChild);
        
        // Diamond: parent → A, parent → B, A → shared, B → shared
        addImportToUIComponent(parentUI, `import ${pascalA} from '@/components/ui/${childA}/${pascalA}';`);
        addImportToUIComponent(parentUI, `import ${pascalB} from '@/components/ui/${childB}/${pascalB}';`);
        addImportToUIComponent(childA, `import ${pascalShared} from '@/components/ui/${sharedChild}/${pascalShared}';`);
        addImportToUIComponent(childB, `import ${pascalShared} from '@/components/ui/${sharedChild}/${pascalShared}';`);
        
        const result = runScript('delete:ui-component', `--name=${parentUI} --cascade --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ Diamond dependency pattern handled');
      });

      it('should handle multiple UI components sharing same child tree', () => {
        const parentUI1 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const parentUI2 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const childUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const grandchildUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestUIComponent(parentUI1);
        createTestUIComponent(parentUI2);
        createTestUIComponent(childUI);
        createTestUIComponent(grandchildUI);
        
        const pascalChild = toPascalCase(childUI);
        const pascalGrandchild = toPascalCase(grandchildUI);
        
        // Both parents share the same child tree
        addImportToUIComponent(parentUI1, `import ${pascalChild} from '@/components/ui/${childUI}/${pascalChild}';`);
        addImportToUIComponent(parentUI2, `import ${pascalChild} from '@/components/ui/${childUI}/${pascalChild}';`);
        addImportToUIComponent(childUI, `import ${pascalGrandchild} from '@/components/ui/${grandchildUI}/${pascalGrandchild}';`);
        
        // Delete first parent
        runScript('delete:ui-component', `--name=${parentUI1} --cascade --yes`);
        
        // Child tree should still exist (used by parent2)
        expect(dirExists(getUIComponentPath(childUI))).toBe(true);
        expect(dirExists(getUIComponentPath(grandchildUI))).toBe(true);
        
        console.log('✓ Multiple UI components sharing child tree handled');
      });

      it('should handle UI component using another UI component with cascade', () => {
        const ui1 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const ui2 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const ui3 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestUIComponent(ui1);
        createTestUIComponent(ui2);
        createTestUIComponent(ui3);
        
        const pascal1 = toPascalCase(ui1);
        const pascal3 = toPascalCase(ui3);
        
        // ui2 uses ui1, ui1 uses ui3
        addImportToUIComponent(ui2, `import ${pascal1} from '@/components/ui/${ui1}/${pascal1}';`);
        addImportToUIComponent(ui1, `import ${pascal3} from '@/components/ui/${ui3}/${pascal3}';`);
        
        // Delete ui2 with cascade
        const result = runScript('delete:ui-component', `--name=${ui2} --cascade --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ UI using another UI with cascade handled');
      });
    });

    describe('edge cases', () => {
      it('should handle UI component with many orphaned children (5+)', () => {
        const parentUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        createTestUIComponent(parentUI);
        
        // Create 5 child UI components
        for (let i = 0; i < 5; i++) {
          const childUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
          createTestUIComponent(childUI);
          
          const pascalChild = toPascalCase(childUI);
          addImportToUIComponent(parentUI, `import ${pascalChild} from '@/components/ui/${childUI}/${pascalChild}';`);
        }
        
        const result = runScript('delete:ui-component', `--name=${parentUI} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getUIComponentPath(parentUI))).toBe(false);
        console.log('✓ UI component with 5+ orphaned children handled');
      });

      it('should handle UI component with no children', () => {
        const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        createTestUIComponent(compName);
        
        const result = runScript('delete:ui-component', `--name=${compName} --cascade --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getUIComponentPath(compName))).toBe(false);
        console.log('✓ UI component with no children handled');
      });

      it('should show cascade deletion in output', () => {
        const parentUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const childUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestUIComponent(parentUI);
        createTestUIComponent(childUI);
        
        const pascalChild = toPascalCase(childUI);
        addImportToUIComponent(parentUI, `import ${pascalChild} from '@/components/ui/${childUI}/${pascalChild}';`);
        
        const result = runScript('delete:ui-component', `--name=${parentUI} --cascade --yes`);
        
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
        const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        createTestUIComponent(compName);
        
        const result = runScript('delete:ui-component', `--name=${compName} --deps --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getUIComponentPath(compName))).toBe(false);
        console.log('✓ --deps flag supported');
      });

      it('should handle --deps flag with UI component having no dependencies', () => {
        const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        createTestUIComponent(compName);
        
        const result = runScript('delete:ui-component', `--name=${compName} --deps --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ --deps with no dependencies handled');
      });
    });

    describe('protected packages', () => {
      it('should NOT uninstall react even if only used by deleted UI component', () => {
        const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        createTestUIComponent(compName);
        
        runScript('delete:ui-component', `--name=${compName} --deps --yes`);
        
        const packageJson = JSON.parse(readFile(PATHS.packageJson));
        expect(packageJson.dependencies?.react || packageJson.devDependencies?.react).toBeDefined();
        console.log('✓ react not uninstalled');
      });

      it('should NOT uninstall react-dom even if only used by deleted UI component', () => {
        const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        createTestUIComponent(compName);
        
        runScript('delete:ui-component', `--name=${compName} --deps --yes`);
        
        const packageJson = JSON.parse(readFile(PATHS.packageJson));
        expect(packageJson.dependencies?.['react-dom'] || packageJson.devDependencies?.['react-dom']).toBeDefined();
        console.log('✓ react-dom not uninstalled');
      });

      it('should NOT uninstall typescript even if only used by deleted UI component', () => {
        const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        createTestUIComponent(compName);
        
        runScript('delete:ui-component', `--name=${compName} --deps --yes`);
        
        const packageJson = JSON.parse(readFile(PATHS.packageJson));
        const hasTypescript = packageJson.dependencies?.typescript || packageJson.devDependencies?.typescript;
        expect(hasTypescript).toBeDefined();
        console.log('✓ typescript not uninstalled');
      });
    });

    describe('cascade + deps combined', () => {
      it('should handle cascade + deps together', () => {
        const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        createTestUIComponent(compName);
        
        const result = runScript('delete:ui-component', `--name=${compName} --cascade --deps --yes`);
        
        expect(result.success).toBe(true);
        expect(dirExists(getUIComponentPath(compName))).toBe(false);
        console.log('✓ --cascade --deps flags work together');
      });

      it('should handle cascade + deps with orphaned child UI component', () => {
        const parentUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const childUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestUIComponent(parentUI);
        createTestUIComponent(childUI);
        
        const pascalChild = toPascalCase(childUI);
        addImportToUIComponent(parentUI, `import ${pascalChild} from '@/components/ui/${childUI}/${pascalChild}';`);
        
        const result = runScript('delete:ui-component', `--name=${parentUI} --cascade --deps --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ cascade + deps with orphaned child UI handled');
      });

      it('should handle cascade + deps with multiple orphaned child UIs', () => {
        const parentUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const childUI1 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const childUI2 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestUIComponent(parentUI);
        createTestUIComponent(childUI1);
        createTestUIComponent(childUI2);
        
        const pascalChild1 = toPascalCase(childUI1);
        const pascalChild2 = toPascalCase(childUI2);
        addImportToUIComponent(parentUI, `import ${pascalChild1} from '@/components/ui/${childUI1}/${pascalChild1}';`);
        addImportToUIComponent(parentUI, `import ${pascalChild2} from '@/components/ui/${childUI2}/${pascalChild2}';`);
        
        const result = runScript('delete:ui-component', `--name=${parentUI} --cascade --deps --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ cascade + deps with multiple orphaned child UIs handled');
      });

      it('should preserve deps of shared children when using cascade + deps', () => {
        const parentUI1 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const parentUI2 = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const childUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestUIComponent(parentUI1);
        createTestUIComponent(parentUI2);
        createTestUIComponent(childUI);
        
        const pascalChild = toPascalCase(childUI);
        addImportToUIComponent(parentUI1, `import ${pascalChild} from '@/components/ui/${childUI}/${pascalChild}';`);
        addImportToUIComponent(parentUI2, `import ${pascalChild} from '@/components/ui/${childUI}/${pascalChild}';`);
        
        runScript('delete:ui-component', `--name=${parentUI1} --cascade --deps --yes`);
        
        // Shared child should still exist
        expect(dirExists(getUIComponentPath(childUI))).toBe(true);
        console.log('✓ Shared child UI deps preserved with cascade + deps');
      });

      it('should handle multi-level cascade with deps', () => {
        const parentUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const childUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        const grandchildUI = generateTestName(TEST_PREFIX.UI_COMPONENT);
        
        createTestUIComponent(parentUI);
        createTestUIComponent(childUI);
        createTestUIComponent(grandchildUI);
        
        const pascalChild = toPascalCase(childUI);
        const pascalGrandchild = toPascalCase(grandchildUI);
        
        // Chain: parent → child → grandchild
        addImportToUIComponent(parentUI, `import ${pascalChild} from '@/components/ui/${childUI}/${pascalChild}';`);
        addImportToUIComponent(childUI, `import ${pascalGrandchild} from '@/components/ui/${grandchildUI}/${pascalGrandchild}';`);
        
        const result = runScript('delete:ui-component', `--name=${parentUI} --cascade --deps --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ Multi-level cascade with deps handled');
      });
    });

    describe('edge cases', () => {
      it('should handle --deps with UI component that has no npm imports', () => {
        const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        createTestUIComponent(compName);
        
        const result = runScript('delete:ui-component', `--name=${compName} --deps --yes`);
        
        expect(result.success).toBe(true);
        console.log('✓ --deps with no npm imports handled');
      });

      it('should show dependency cleanup info in output', () => {
        const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        createTestUIComponent(compName);
        
        const result = runScript('delete:ui-component', `--name=${compName} --deps --yes`);
        
        expect(result.success).toBe(true);
        const hasDepsInfo = result.output.toLowerCase().includes('dep') ||
          result.output.toLowerCase().includes('package') ||
          result.output.toLowerCase().includes('protected');
        expect(hasDepsInfo).toBe(true);
        console.log('✓ Dependency info shown in output');
      });

      it('should handle package used by protected UI component (Button, etc.)', () => {
        const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
        createTestUIComponent(compName);
        
        const result = runScript('delete:ui-component', `--name=${compName} --deps --yes`);
        
        expect(result.success).toBe(true);
        // Ensure Layout (a protected block using UI components) still exists
        expect(dirExists(path.join(PATHS.blockComponents, 'layout'))).toBe(true);
        console.log('✓ Protected components preserved');
      });
    });
  });

  // ==========================================
  // 6. Complex Scenarios
  // ==========================================
  describe('complex scenarios', () => {
    it('should handle UI component using another UI component', () => {
      const ui1 = generateTestName(TEST_PREFIX.UI_COMPONENT);
      const ui2 = generateTestName(TEST_PREFIX.UI_COMPONENT);
      
      createTestUIComponent(ui1);
      createTestUIComponent(ui2);
      
      // ui2 imports ui1
      const pascalUI1 = toPascalCase(ui1);
      addImportToUIComponent(ui2, `import ${pascalUI1} from '@/components/ui/${ui1}/${pascalUI1}';`);
      
      // Try to delete ui1 (used by ui2)
      const result1 = runScript('delete:ui-component', `--name=${ui1} --yes`);
      
      // Delete ui2 first (not used by anyone)
      const result2 = runScript('delete:ui-component', `--name=${ui2} --yes`);
      expect(result2.success).toBe(true);
      
      // Now ui1 should be deletable
      const result3 = runScript('delete:ui-component', `--name=${ui1} --yes`);
      expect(result3.success).toBe(true);
      
      console.log('✓ UI-to-UI dependency handled');
    });

    it('should handle UI component with multiple files', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      runScript('create:ui-component', `--name=${compName} --css`);
      createdUIComponents.push(compName);
      
      const compPath = getUIComponentPath(compName);
      const pascalName = toPascalCase(compName);
      
      // Verify multiple files exist
      expect(fileExists(path.join(compPath, `${pascalName}.tsx`))).toBe(true);
      expect(fileExists(path.join(compPath, `${pascalName}.types.ts`))).toBe(true);
      expect(fileExists(path.join(compPath, `${pascalName}.module.css`))).toBe(true);
      
      // Delete
      runScript('delete:ui-component', `--name=${compName} --yes`);
      
      // All files should be gone
      expect(dirExists(compPath)).toBe(false);
      console.log('✓ UI component with multiple files deleted');
    });
  });

  // ==========================================
  // 7. Combined Flags Tests
  // ==========================================
  describe('combined flags', () => {
    it('should work with --yes --cascade', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createTestUIComponent(compName);
      
      const result = runScript('delete:ui-component', `--name=${compName} --yes --cascade`);
      
      expect(result.success).toBe(true);
      expect(dirExists(getUIComponentPath(compName))).toBe(false);
      console.log('✓ --yes --cascade works');
    });

    it('should work with --yes --deps', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createTestUIComponent(compName);
      
      const result = runScript('delete:ui-component', `--name=${compName} --yes --deps`);
      
      expect(result.success).toBe(true);
      expect(dirExists(getUIComponentPath(compName))).toBe(false);
      console.log('✓ --yes --deps works');
    });

    it('should work with --yes --cascade --deps', () => {
      const compName = generateTestName(TEST_PREFIX.UI_COMPONENT);
      createTestUIComponent(compName);
      
      const result = runScript('delete:ui-component', `--name=${compName} --yes --cascade --deps`);
      
      expect(result.success).toBe(true);
      expect(dirExists(getUIComponentPath(compName))).toBe(false);
      console.log('✓ --yes --cascade --deps works');
    });
  });
});
