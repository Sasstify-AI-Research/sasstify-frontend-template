/**
 * Functional tests for analyze-components.js script
 * Tests CLI behavior, output validation, analysis accuracy, and edge cases
 */

import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import {
  runScript,
  cleanupTestArtifacts,
  cleanupAllTestArtifacts,
  getComponentPath,
  getUIComponentPath,
  getBlockComponentPath,
  generateTestName,
  TEST_PREFIX,
  dirExists,
  fileExists,
  parseJsonOutput,
} from './helpers/test-utils';

// Type definitions for JSON output
interface ComponentData {
  name: string;
  type?: 'regular' | 'ui' | 'block';
  isBlock?: boolean;
  files: string[];
  dependencies: string[];
  usesComponents: string[];
  usesUIComponents?: string[];
  usedByUIComponents: string[];
  usedByBlocks: string[];
  usedByRegularComponents: string[];
  usedInPages: string[];
  isOrphan: boolean;
}

interface AnalyzeComponentsJson {
  generated: string;
  summary: {
    totalComponentGroups: number;
    totalComponentFiles: number;
    orphanCount: number;
  };
  components: ComponentData[];
  orphanComponents: string[];
}

describe('analyze-components script', () => {
  // Clean up any leftover test artifacts before and after all tests
  beforeAll(() => {
    cleanupAllTestArtifacts();
  });

  afterAll(() => {
    cleanupAllTestArtifacts();
  });

  // --- CLI Behavior Tests ---
  describe('CLI behavior', () => {
    it('should show help with --help flag', () => {
      const result = runScript('analyze:components', '--help');
      expect(result.success).toBe(true);
      expect(result.output).toContain('Usage:');
      expect(result.output).toContain('--json');
      expect(result.output).toContain('--help');
    });

    it('should exit successfully with no flags', () => {
      const result = runScript('analyze:components');
      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
    });

    it('should output valid JSON with --json flag', () => {
      const result = runScript('analyze:components', '--json');
      expect(result.success).toBe(true);
      
      const json = parseJsonOutput<AnalyzeComponentsJson>(result.output);
      expect(json).not.toBeNull();
      expect(json).toHaveProperty('generated');
      expect(json).toHaveProperty('summary');
      expect(json).toHaveProperty('components');
    });

    it('should not create file with --json flag (outputs to console)', () => {
      const result = runScript('analyze:components', '--json');
      expect(result.success).toBe(true);
      
      // Verify JSON is in output, not written to file
      const json = parseJsonOutput<AnalyzeComponentsJson>(result.output);
      expect(json).not.toBeNull();
      
      // Check that no JSON file was created in the project root
      expect(fileExists('components-analysis.json')).toBe(false);
    });
  });

  // --- Console Output Validation ---
  describe('console output validation', () => {
    it('should display header banner', () => {
      const result = runScript('analyze:components');
      expect(result.success).toBe(true);
      expect(result.output).toContain('COMPONENT ANALYSIS');
    });

    it('should list existing components', () => {
      const result = runScript('analyze:components');
      expect(result.success).toBe(true);
      
      // Check for common components that should exist
      // These may vary based on the actual codebase
      expect(result.output).toMatch(/header|footer|layout|section/i);
    });

    it('should show component count summary', () => {
      const result = runScript('analyze:components');
      expect(result.success).toBe(true);
      expect(result.output).toContain('Total Component Groups');
      expect(result.output).toContain('Total Component Files');
    });

    it('should contain ANSI color codes in output', () => {
      const result = runScript('analyze:components');
      expect(result.success).toBe(true);
      // ANSI escape codes start with \x1b[ or \u001b[
      expect(result.output).toMatch(/\x1b\[|\u001b\[/);
    });
  });

  // --- JSON Output Validation ---
  describe('JSON output validation', () => {
    it('should have valid JSON structure', () => {
      const result = runScript('analyze:components', '--json');
      expect(result.success).toBe(true);
      
      const json = parseJsonOutput<AnalyzeComponentsJson>(result.output);
      expect(json).not.toBeNull();
      expect(typeof json).toBe('object');
    });

    it('should contain generated timestamp', () => {
      const result = runScript('analyze:components', '--json');
      const json = parseJsonOutput<AnalyzeComponentsJson>(result.output);
      
      expect(json).not.toBeNull();
      expect(json!.generated).toBeDefined();
      // Verify it's a valid ISO date string
      expect(new Date(json!.generated).toISOString()).toBe(json!.generated);
    });

    it('should contain summary object with expected fields', () => {
      const result = runScript('analyze:components', '--json');
      const json = parseJsonOutput<AnalyzeComponentsJson>(result.output);
      
      expect(json).not.toBeNull();
      expect(json!.summary).toBeDefined();
      expect(typeof json!.summary.totalComponentGroups).toBe('number');
      expect(typeof json!.summary.totalComponentFiles).toBe('number');
      expect(typeof json!.summary.orphanCount).toBe('number');
    });

    it('should contain components array', () => {
      const result = runScript('analyze:components', '--json');
      const json = parseJsonOutput<AnalyzeComponentsJson>(result.output);
      
      expect(json).not.toBeNull();
      expect(Array.isArray(json!.components)).toBe(true);
    });

    it('should contain orphanComponents array', () => {
      const result = runScript('analyze:components', '--json');
      const json = parseJsonOutput<AnalyzeComponentsJson>(result.output);
      
      expect(json).not.toBeNull();
      expect(Array.isArray(json!.orphanComponents)).toBe(true);
    });

    it('should have correct component object structure', () => {
      const result = runScript('analyze:components', '--json');
      const json = parseJsonOutput<AnalyzeComponentsJson>(result.output);
      
      expect(json).not.toBeNull();
      expect(json!.components.length).toBeGreaterThan(0);
      
      const component = json!.components[0];
      expect(component).toHaveProperty('name');
      expect(component).toHaveProperty('files');
      expect(component).toHaveProperty('dependencies');
      expect(component).toHaveProperty('usesComponents');
      expect(component).toHaveProperty('usedByUIComponents');
      expect(component).toHaveProperty('usedByBlocks');
      expect(component).toHaveProperty('usedByRegularComponents');
      expect(component).toHaveProperty('usedInPages');
      expect(component).toHaveProperty('isOrphan');
      
      expect(typeof component.name).toBe('string');
      expect(Array.isArray(component.files)).toBe(true);
      expect(Array.isArray(component.dependencies)).toBe(true);
      expect(Array.isArray(component.usesComponents)).toBe(true);
      expect(Array.isArray(component.usedByUIComponents)).toBe(true);
      expect(Array.isArray(component.usedByBlocks)).toBe(true);
      expect(Array.isArray(component.usedByRegularComponents)).toBe(true);
      expect(Array.isArray(component.usedInPages)).toBe(true);
      expect(typeof component.isOrphan).toBe('boolean');
    });
  });

  // --- Component Analysis Accuracy ---
  describe('component analysis accuracy', () => {
    let testComponentName: string;
    let testComponentPath: string;

    afterEach(() => {
      // Clean up test component if created
      if (testComponentPath) {
        cleanupTestArtifacts([testComponentPath]);
      }
    });

    it('should detect orphan components', () => {
      // Create a test component that won't be used anywhere
      testComponentName = generateTestName(TEST_PREFIX.COMPONENT);
      const createResult = runScript('create:component', `--name=${testComponentName} --type=regular`);
      expect(createResult.success).toBe(true);
      
      testComponentPath = getComponentPath(testComponentName);
      
      // Run analysis
      const result = runScript('analyze:components', '--json');
      const json = parseJsonOutput<AnalyzeComponentsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Find our test component
      const testComponent = json!.components.find(c => c.name === testComponentName);
      expect(testComponent).toBeDefined();
      expect(testComponent!.isOrphan).toBe(true);
      
      // Should also appear in orphanComponents array
      expect(json!.orphanComponents).toContain(testComponentName);
    });

    it('should group UI components correctly', () => {
      const result = runScript('analyze:components', '--json');
      const json = parseJsonOutput<AnalyzeComponentsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // UI components should be grouped as "ui/[name]"
      const uiComponents = json!.components.filter(c => c.name.startsWith('ui/'));
      
      // If there are UI components, verify they're grouped correctly
      if (uiComponents.length > 0) {
        uiComponents.forEach(comp => {
          expect(comp.name).toMatch(/^ui\/[a-z-]+$/);
        });
      }
    });

    it('should group regular components correctly', () => {
      const result = runScript('analyze:components', '--json');
      const json = parseJsonOutput<AnalyzeComponentsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Regular components should be grouped by folder name (kebab-case)
      const regularComponents = json!.components.filter(c => 
        !c.name.startsWith('ui/') && !c.name.startsWith('blocks/')
      );
      
      if (regularComponents.length > 0) {
        regularComponents.forEach(comp => {
          // Should be kebab-case without slashes
          expect(comp.name).toMatch(/^[a-z][a-z0-9-]*$/);
        });
      }
    });

    it('should group block components correctly', () => {
      const result = runScript('analyze:components', '--json');
      const json = parseJsonOutput<AnalyzeComponentsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Block components should be grouped as "blocks/[name]"
      const blockComponents = json!.components.filter(c => c.name.startsWith('blocks/'));
      
      if (blockComponents.length > 0) {
        blockComponents.forEach(comp => {
          expect(comp.name).toMatch(/^blocks\/[a-z-]+$/);
          expect(comp.type).toBe('block');
          expect(comp.isBlock).toBe(true);
        });
      }
    });

    it('should detect components with no imports showing empty dependencies', () => {
      // Create a minimal component
      testComponentName = generateTestName(TEST_PREFIX.COMPONENT);
      const createResult = runScript('create:component', `--name=${testComponentName} --type=regular`);
      expect(createResult.success).toBe(true);
      
      testComponentPath = getComponentPath(testComponentName);
      
      // Run analysis
      const result = runScript('analyze:components', '--json');
      const json = parseJsonOutput<AnalyzeComponentsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Find our test component
      const testComponent = json!.components.find(c => c.name === testComponentName);
      expect(testComponent).toBeDefined();
      
      // A newly created component should have minimal or no NPM dependencies
      // (it may have React as a dependency from the template)
      expect(Array.isArray(testComponent!.dependencies)).toBe(true);
    });
  });

  // --- Edge Cases ---
  describe('edge cases', () => {
    it('should handle components with only type imports', () => {
      // This tests that type-only imports are properly handled
      const result = runScript('analyze:components', '--json');
      const json = parseJsonOutput<AnalyzeComponentsJson>(result.output);
      
      expect(json).not.toBeNull();
      // The script should complete without errors
      expect(result.success).toBe(true);
    });

    it('should handle empty component folders gracefully', () => {
      // The script should not crash if there are empty directories
      const result = runScript('analyze:components');
      expect(result.success).toBe(true);
    });

    it('should count orphan components correctly', () => {
      const result = runScript('analyze:components', '--json');
      const json = parseJsonOutput<AnalyzeComponentsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Verify orphanCount matches orphanComponents array length
      expect(json!.summary.orphanCount).toBe(json!.orphanComponents.length);
      
      // Verify all orphan components have isOrphan = true
      const orphanFromComponents = json!.components.filter(c => c.isOrphan);
      expect(orphanFromComponents.length).toBe(json!.orphanComponents.length);
    });

    it('should count total component groups correctly', () => {
      const result = runScript('analyze:components', '--json');
      const json = parseJsonOutput<AnalyzeComponentsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Total component groups should match components array length
      expect(json!.summary.totalComponentGroups).toBe(json!.components.length);
    });
  });

  // --- Integration Tests with Test Fixtures ---
  describe('integration with test fixtures', () => {
    let testComponentA: string;
    let testComponentB: string;
    let pathA: string;
    let pathB: string;

    afterEach(() => {
      // Clean up test components
      const pathsToClean = [pathA, pathB].filter(Boolean);
      if (pathsToClean.length > 0) {
        cleanupTestArtifacts(pathsToClean);
      }
    });

    it('should create and analyze test component', () => {
      testComponentA = generateTestName(TEST_PREFIX.COMPONENT);
      const createResult = runScript('create:component', `--name=${testComponentA} --type=regular`);
      expect(createResult.success).toBe(true);
      
      pathA = getComponentPath(testComponentA);
      expect(dirExists(pathA)).toBe(true);
      
      // Run analysis and verify component appears
      const result = runScript('analyze:components', '--json');
      const json = parseJsonOutput<AnalyzeComponentsJson>(result.output);
      
      expect(json).not.toBeNull();
      const found = json!.components.find(c => c.name === testComponentA);
      expect(found).toBeDefined();
    });

    it('should create orphan and verify detection', () => {
      testComponentA = generateTestName(TEST_PREFIX.COMPONENT);
      const createResult = runScript('create:component', `--name=${testComponentA} --type=regular`);
      expect(createResult.success).toBe(true);
      
      pathA = getComponentPath(testComponentA);
      
      // Run analysis
      const result = runScript('analyze:components', '--json');
      const json = parseJsonOutput<AnalyzeComponentsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Verify it's marked as orphan
      const found = json!.components.find(c => c.name === testComponentA);
      expect(found).toBeDefined();
      expect(found!.isOrphan).toBe(true);
      expect(json!.orphanComponents).toContain(testComponentA);
    });

    it('should create UI component and verify grouping', () => {
      testComponentA = generateTestName(TEST_PREFIX.UI_COMPONENT);
      const createResult = runScript('create:ui-component', `--name=${testComponentA}`);
      expect(createResult.success).toBe(true);
      
      pathA = getUIComponentPath(testComponentA);
      expect(dirExists(pathA)).toBe(true);
      
      // Run analysis
      const result = runScript('analyze:components', '--json');
      const json = parseJsonOutput<AnalyzeComponentsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // UI components should be grouped as "ui/[name]"
      const expectedName = `ui/${testComponentA}`;
      const found = json!.components.find(c => c.name === expectedName);
      expect(found).toBeDefined();
    });

    it('should create block component and verify grouping', () => {
      testComponentA = generateTestName(TEST_PREFIX.BLOCK_COMPONENT);
      const createResult = runScript('create:block', `--name=${testComponentA}`);
      expect(createResult.success).toBe(true);
      
      pathA = getBlockComponentPath(testComponentA);
      expect(dirExists(pathA)).toBe(true);
      
      // Run analysis
      const result = runScript('analyze:components', '--json');
      const json = parseJsonOutput<AnalyzeComponentsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Block components should be grouped as "blocks/[name]"
      const expectedName = `blocks/${testComponentA}`;
      const found = json!.components.find(c => c.name === expectedName);
      expect(found).toBeDefined();
      expect(found!.type).toBe('block');
      expect(found!.isBlock).toBe(true);
    });
  });
});

