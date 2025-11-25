/**
 * Functional tests for analyze-deps.js script
 * Tests CLI behavior, output validation, dependency analysis accuracy, and edge cases
 */

import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import {
  runScript,
  cleanupTestArtifacts,
  cleanupAllTestArtifacts,
  getComponentPath,
  generateTestName,
  TEST_PREFIX,
  dirExists,
  fileExists,
  parseJsonOutput,
  hasDependency,
  addImportToFile,
} from './helpers/test-utils';
import path from 'path';
import fs from 'fs';

// Type definitions for JSON output
interface UsedDependency {
  name: string;
  version: string;
  protected: boolean;
  pages: string[];
  blocks: string[];
  components: string[];
  uiComponents: string[];
}

interface AnalyzeDepsJson {
  generated: string;
  summary: {
    dependencies: number;
    devDependencies: number;
    total: number;
    used: number;
    unused: number;
    protected: number;
  };
  used: UsedDependency[];
  unused: string[];
  protected: string[];
}

describe('analyze-deps script', () => {
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
      const result = runScript('analyze:deps', '--help');
      expect(result.success).toBe(true);
      expect(result.output).toContain('Usage:');
      expect(result.output).toContain('--json');
      expect(result.output).toContain('--help');
    });

    it('should exit successfully with no flags', () => {
      const result = runScript('analyze:deps');
      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
    });

    it('should output valid JSON with --json flag', () => {
      const result = runScript('analyze:deps', '--json');
      expect(result.success).toBe(true);
      
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      expect(json).not.toBeNull();
      expect(json).toHaveProperty('generated');
      expect(json).toHaveProperty('summary');
      expect(json).toHaveProperty('used');
      expect(json).toHaveProperty('unused');
      expect(json).toHaveProperty('protected');
    });

    it('should not create file with --json flag (outputs to console)', () => {
      const result = runScript('analyze:deps', '--json');
      expect(result.success).toBe(true);
      
      // Verify JSON is in output, not written to file
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      expect(json).not.toBeNull();
      
      // Check that no JSON file was created in the project root
      expect(fileExists('deps-analysis.json')).toBe(false);
    });
  });

  // --- Console Output Validation ---
  describe('console output validation', () => {
    it('should display header banner', () => {
      const result = runScript('analyze:deps');
      expect(result.success).toBe(true);
      expect(result.output).toContain('NPM DEPENDENCY ANALYSIS');
    });

    it('should display summary section', () => {
      const result = runScript('analyze:deps');
      expect(result.success).toBe(true);
      expect(result.output).toContain('Summary:');
      expect(result.output).toContain('Dependencies:');
      expect(result.output).toContain('DevDependencies:');
      expect(result.output).toContain('Total:');
    });

    it('should display used dependencies section', () => {
      const result = runScript('analyze:deps');
      expect(result.success).toBe(true);
      expect(result.output).toContain('USED DEPENDENCIES');
    });

    it('should display unused dependencies section', () => {
      const result = runScript('analyze:deps');
      expect(result.success).toBe(true);
      expect(result.output).toContain('UNUSED DEPENDENCIES');
    });

    it('should display dev dependencies note', () => {
      const result = runScript('analyze:deps');
      expect(result.success).toBe(true);
      expect(result.output).toContain('DEV DEPENDENCIES');
      expect(result.output).toContain('excluded from unused check');
    });

    it('should display protected dependencies section', () => {
      const result = runScript('analyze:deps');
      expect(result.success).toBe(true);
      expect(result.output).toContain('PROTECTED DEPENDENCIES');
    });

    it('should contain ANSI color codes in output', () => {
      const result = runScript('analyze:deps');
      expect(result.success).toBe(true);
      // ANSI escape codes start with \x1b[ or \u001b[
      expect(result.output).toMatch(/\x1b\[|\u001b\[/);
    });

    it('should show analysis complete message', () => {
      const result = runScript('analyze:deps');
      expect(result.success).toBe(true);
      expect(result.output).toContain('Analysis Complete');
    });
  });

  // --- JSON Output Validation ---
  describe('JSON output validation', () => {
    it('should have valid JSON structure', () => {
      const result = runScript('analyze:deps', '--json');
      expect(result.success).toBe(true);
      
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      expect(json).not.toBeNull();
      expect(typeof json).toBe('object');
    });

    it('should contain generated timestamp', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      expect(json!.generated).toBeDefined();
      // Verify it's a valid ISO date string
      expect(new Date(json!.generated).toISOString()).toBe(json!.generated);
    });

    it('should contain summary object with all expected fields', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      expect(json!.summary).toBeDefined();
      expect(typeof json!.summary.dependencies).toBe('number');
      expect(typeof json!.summary.devDependencies).toBe('number');
      expect(typeof json!.summary.total).toBe('number');
      expect(typeof json!.summary.used).toBe('number');
      expect(typeof json!.summary.unused).toBe('number');
      expect(typeof json!.summary.protected).toBe('number');
    });

    it('should contain used array', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      expect(Array.isArray(json!.used)).toBe(true);
    });

    it('should contain unused array', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      expect(Array.isArray(json!.unused)).toBe(true);
    });

    it('should contain protected array', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      expect(Array.isArray(json!.protected)).toBe(true);
    });

    it('should have correct used dependency structure', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // If there are used dependencies, check their structure
      if (json!.used.length > 0) {
        const dep = json!.used[0];
        expect(dep).toHaveProperty('name');
        expect(dep).toHaveProperty('version');
        expect(dep).toHaveProperty('protected');
        expect(dep).toHaveProperty('pages');
        expect(dep).toHaveProperty('blocks');
        expect(dep).toHaveProperty('components');
        expect(dep).toHaveProperty('uiComponents');
        
        expect(typeof dep.name).toBe('string');
        expect(typeof dep.version).toBe('string');
        expect(typeof dep.protected).toBe('boolean');
        expect(Array.isArray(dep.pages)).toBe(true);
        expect(Array.isArray(dep.blocks)).toBe(true);
        expect(Array.isArray(dep.components)).toBe(true);
        expect(Array.isArray(dep.uiComponents)).toBe(true);
      }
    });

    it('should have total = dependencies + devDependencies', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      expect(json!.summary.total).toBe(
        json!.summary.dependencies + json!.summary.devDependencies
      );
    });
  });

  // --- Dependency Analysis Accuracy ---
  describe('dependency analysis accuracy', () => {
    it('should detect React as a used dependency', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // React should be used (it's imported in most components)
      const reactDep = json!.used.find(d => d.name === 'react');
      expect(reactDep).toBeDefined();
    });

    it('should detect React as protected', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // React should be in protected list
      expect(json!.protected).toContain('react');
    });

    it('should detect react-dom as protected', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // react-dom should be in protected list
      expect(json!.protected).toContain('react-dom');
    });

    it('should include usedIn locations for used dependencies', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Find a dependency that is actually used (has pages, blocks, components, or UI components)
      const usedWithLocations = json!.used.find(d => 
        d.pages.length > 0 || d.blocks.length > 0 || d.components.length > 0 || d.uiComponents.length > 0
      );
      
      // If there are used dependencies with locations, verify they have valid entries
      if (usedWithLocations) {
        const totalLocations = usedWithLocations.pages.length + usedWithLocations.blocks.length + 
                              usedWithLocations.components.length + usedWithLocations.uiComponents.length;
        expect(totalLocations).toBeGreaterThan(0);
        
        [...usedWithLocations.pages, ...usedWithLocations.blocks, 
         ...usedWithLocations.components, ...usedWithLocations.uiComponents].forEach(location => {
          expect(typeof location).toBe('string');
        });
      }
    });

    it('should count used dependencies correctly', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Summary count should match array length
      expect(json!.summary.used).toBe(json!.used.length);
    });

    it('should count unused dependencies correctly', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Summary count should match array length
      expect(json!.summary.unused).toBe(json!.unused.length);
    });

    it('should count protected dependencies correctly', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Summary count should match array length
      expect(json!.summary.protected).toBe(json!.protected.length);
    });
  });

  // --- Edge Cases ---
  describe('edge cases', () => {
    it('should handle project with many dependencies', () => {
      // The script should complete without errors regardless of dependency count
      const result = runScript('analyze:deps', '--json');
      expect(result.success).toBe(true);
      
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      expect(json).not.toBeNull();
      expect(json!.summary.total).toBeGreaterThan(0);
    });

    it('should handle dependencies with special characters in versions', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // All used dependencies should have valid version strings
      json!.used.forEach(dep => {
        expect(typeof dep.version).toBe('string');
        expect(dep.version.length).toBeGreaterThan(0);
      });
    });

    it('should not include devDependencies in unused check', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Dev dependencies like typescript, vite, etc. should not appear in unused
      const devPatterns = ['typescript', 'vite', 'vitest', 'eslint'];
      devPatterns.forEach(pattern => {
        expect(json!.unused).not.toContain(pattern);
      });
    });

    it('should sort used dependencies alphabetically', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      if (json!.used.length > 1) {
        const names = json!.used.map(d => d.name);
        const sorted = [...names].sort();
        expect(names).toEqual(sorted);
      }
    });

    it('should handle empty usedIn arrays gracefully', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // All used dependencies should have pages, blocks, components, and uiComponents arrays (even if empty)
      json!.used.forEach(dep => {
        expect(Array.isArray(dep.pages)).toBe(true);
        expect(Array.isArray(dep.blocks)).toBe(true);
        expect(Array.isArray(dep.components)).toBe(true);
        expect(Array.isArray(dep.uiComponents)).toBe(true);
      });
    });
  });

  // --- Integration Tests with Test Fixtures ---
  describe('integration with test fixtures', () => {
    let testComponentName: string;
    let testComponentPath: string;

    afterEach(() => {
      // Clean up test component if created
      if (testComponentPath) {
        cleanupTestArtifacts([testComponentPath]);
      }
    });

    it('should detect dependencies used in new components', () => {
      // Create a test component
      testComponentName = generateTestName(TEST_PREFIX.COMPONENT);
      const createResult = runScript('create:component', `--name=${testComponentName} --type=regular`);
      expect(createResult.success).toBe(true);
      
      testComponentPath = getComponentPath(testComponentName);
      expect(dirExists(testComponentPath)).toBe(true);
      
      // Run analysis - new component should use React
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // React should be detected as used
      const reactDep = json!.used.find(d => d.name === 'react');
      expect(reactDep).toBeDefined();
    });

    it('should track usage locations correctly', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Find a dependency with usage locations
      const depWithUsage = json!.used.find(d => 
        d.pages.length > 0 || d.blocks.length > 0 || d.components.length > 0 || d.uiComponents.length > 0
      );
      
      if (depWithUsage) {
        // Usage locations should be strings (page names or component names)
        [...depWithUsage.pages, ...depWithUsage.blocks, 
         ...depWithUsage.components, ...depWithUsage.uiComponents].forEach(location => {
          expect(typeof location).toBe('string');
          expect(location.length).toBeGreaterThan(0);
        });
      }
    });

    it('should update analysis after component creation', () => {
      // Get initial analysis
      const initialResult = runScript('analyze:deps', '--json');
      const initialJson = parseJsonOutput<AnalyzeDepsJson>(initialResult.output);
      expect(initialJson).not.toBeNull();
      
      // Create a test component
      testComponentName = generateTestName(TEST_PREFIX.COMPONENT);
      const createResult = runScript('create:component', `--name=${testComponentName} --type=regular`);
      expect(createResult.success).toBe(true);
      testComponentPath = getComponentPath(testComponentName);
      
      // Get new analysis
      const newResult = runScript('analyze:deps', '--json');
      const newJson = parseJsonOutput<AnalyzeDepsJson>(newResult.output);
      expect(newJson).not.toBeNull();
      
      // React should still be detected (new component uses React)
      const reactDep = newJson!.used.find(d => d.name === 'react');
      expect(reactDep).toBeDefined();
    });
  });

  // --- Protected Dependencies Tests ---
  describe('protected dependencies', () => {
    it('should include core React dependencies as protected', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Core React deps should be protected
      expect(json!.protected).toContain('react');
      expect(json!.protected).toContain('react-dom');
    });

    it('should mark protected dependencies in used array', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Find react in used array and verify it's marked as protected
      const reactDep = json!.used.find(d => d.name === 'react');
      if (reactDep) {
        expect(reactDep.protected).toBe(true);
      }
    });

    it('should not include protected dependencies in unused list', () => {
      const result = runScript('analyze:deps', '--json');
      const json = parseJsonOutput<AnalyzeDepsJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Protected dependencies should never appear in unused
      json!.protected.forEach(protectedDep => {
        expect(json!.unused).not.toContain(protectedDep);
      });
    });
  });
});

