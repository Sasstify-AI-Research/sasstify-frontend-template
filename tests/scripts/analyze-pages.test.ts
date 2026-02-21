/**
 * Functional tests for analyze-pages.js script
 * Tests CLI behavior, output validation, analysis accuracy, and edge cases
 */

import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import {
  runScript,
  cleanupTestArtifacts,
  cleanupAllTestArtifacts,
  getPagePath,
  generateTestName,
  TEST_PREFIX,
  dirExists,
  fileExists,
  parseJsonOutput,
} from './helpers/test-utils';

// Type definitions for JSON output
interface PageData {
  name: string;
  isProtected: boolean;
  dependencies: string[];
  components: string[];
  uiComponents: string[];
  subComponents: string[];
}

interface AnalyzePagesJson {
  generated: string;
  summary: {
    totalPages: number;
    protectedPages: number;
    totalSubComponents: number;
  };
  pages: PageData[];
}

describe('analyze-pages script', () => {
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
      const result = runScript('analyze:pages', '--help');
      expect(result.success).toBe(true);
      expect(result.output).toContain('Usage:');
      expect(result.output).toContain('--json');
      expect(result.output).toContain('--help');
    });

    it('should exit successfully with no flags', () => {
      const result = runScript('analyze:pages');
      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
    });

    it('should output valid JSON with --json flag', () => {
      const result = runScript('analyze:pages', '--json');
      expect(result.success).toBe(true);
      
      const json = parseJsonOutput<AnalyzePagesJson>(result.output);
      expect(json).not.toBeNull();
      expect(json).toHaveProperty('generated');
      expect(json).toHaveProperty('summary');
      expect(json).toHaveProperty('pages');
    });

    it('should not create file with --json flag (outputs to console)', () => {
      const result = runScript('analyze:pages', '--json');
      expect(result.success).toBe(true);
      
      // Verify JSON is in output, not written to file
      const json = parseJsonOutput<AnalyzePagesJson>(result.output);
      expect(json).not.toBeNull();
      
      // Check that no JSON file was created in the project root
      expect(fileExists('pages-analysis.json')).toBe(false);
    });
  });

  // --- Console Output Validation ---
  describe('console output validation', () => {
    it('should display header banner', () => {
      const result = runScript('analyze:pages');
      expect(result.success).toBe(true);
      expect(result.output).toContain('PAGE ANALYSIS');
    });

    it('should list existing pages', () => {
      const result = runScript('analyze:pages');
      expect(result.success).toBe(true);
      
      // Check for common pages that should exist (index, page-not-found)
      expect(result.output).toMatch(/index|page-not-found/i);
    });

    it('should show page count summary', () => {
      const result = runScript('analyze:pages');
      expect(result.success).toBe(true);
      expect(result.output).toContain('Total Pages');
    });

    it('should contain ANSI color codes in output', () => {
      const result = runScript('analyze:pages');
      expect(result.success).toBe(true);
      // ANSI escape codes start with \x1b[ or \u001b[
      // eslint-disable-next-line no-control-regex
      expect(result.output).toMatch(/\x1b\[|\u001b\[/);
    });

    it('should display dependencies section for each page', () => {
      const result = runScript('analyze:pages');
      expect(result.success).toBe(true);
      expect(result.output).toContain('Dependencies:');
    });

    it('should display components section for each page', () => {
      const result = runScript('analyze:pages');
      expect(result.success).toBe(true);
      expect(result.output).toContain('Components:');
    });

    it('should display UI components section for each page', () => {
      const result = runScript('analyze:pages');
      expect(result.success).toBe(true);
      expect(result.output).toContain('UI Components:');
    });

  });

  // --- JSON Output Validation ---
  describe('JSON output validation', () => {
    it('should have valid JSON structure', () => {
      const result = runScript('analyze:pages', '--json');
      expect(result.success).toBe(true);
      
      const json = parseJsonOutput<AnalyzePagesJson>(result.output);
      expect(json).not.toBeNull();
      expect(typeof json).toBe('object');
    });

    it('should contain generated timestamp', () => {
      const result = runScript('analyze:pages', '--json');
      const json = parseJsonOutput<AnalyzePagesJson>(result.output);
      
      expect(json).not.toBeNull();
      expect(json!.generated).toBeDefined();
      // Verify it's a valid ISO date string
      expect(new Date(json!.generated).toISOString()).toBe(json!.generated);
    });

    it('should contain summary object with expected fields', () => {
      const result = runScript('analyze:pages', '--json');
      const json = parseJsonOutput<AnalyzePagesJson>(result.output);
      
      expect(json).not.toBeNull();
      expect(json!.summary).toBeDefined();
      expect(typeof json!.summary.totalPages).toBe('number');
      expect(typeof json!.summary.protectedPages).toBe('number');
    });

    it('should contain pages array', () => {
      const result = runScript('analyze:pages', '--json');
      const json = parseJsonOutput<AnalyzePagesJson>(result.output);
      
      expect(json).not.toBeNull();
      expect(Array.isArray(json!.pages)).toBe(true);
    });

    it('should have correct page object structure', () => {
      const result = runScript('analyze:pages', '--json');
      const json = parseJsonOutput<AnalyzePagesJson>(result.output);
      
      expect(json).not.toBeNull();
      expect(json!.pages.length).toBeGreaterThan(0);
      
      const page = json!.pages[0];
      expect(page).toHaveProperty('name');
      expect(page).toHaveProperty('isProtected');
      expect(page).toHaveProperty('dependencies');
      expect(page).toHaveProperty('components');
      expect(page).toHaveProperty('uiComponents');
      
      expect(typeof page.name).toBe('string');
      expect(typeof page.isProtected).toBe('boolean');
      expect(Array.isArray(page.dependencies)).toBe(true);
      expect(Array.isArray(page.components)).toBe(true);
      expect(Array.isArray(page.uiComponents)).toBe(true);
    });

    it('should mark index page as protected', () => {
      const result = runScript('analyze:pages', '--json');
      const json = parseJsonOutput<AnalyzePagesJson>(result.output);
      
      expect(json).not.toBeNull();
      
      const indexPage = json!.pages.find(p => p.name === 'index');
      expect(indexPage).toBeDefined();
      expect(indexPage!.isProtected).toBe(true);
    });

    it('should not mark non-index pages as protected', () => {
      const result = runScript('analyze:pages', '--json');
      const json = parseJsonOutput<AnalyzePagesJson>(result.output);
      
      expect(json).not.toBeNull();
      
      const nonIndexPages = json!.pages.filter(p => p.name !== 'index');
      nonIndexPages.forEach(page => {
        expect(page.isProtected).toBe(false);
      });
    });
  });

  // --- Page Analysis Accuracy ---
  describe('page analysis accuracy', () => {
    let testPagePath: string;

    afterEach(() => {
      // Clean up test page if created
      if (testPagePath) {
        cleanupTestArtifacts([testPagePath]);
      }
    });

    it('should detect all existing pages', () => {
      const result = runScript('analyze:pages', '--json');
      const json = parseJsonOutput<AnalyzePagesJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // At minimum, index page should exist
      const pageNames = json!.pages.map(p => p.name);
      expect(pageNames).toContain('index');
    });

    it('should count protected pages correctly', () => {
      const result = runScript('analyze:pages', '--json');
      const json = parseJsonOutput<AnalyzePagesJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Only index is protected
      const protectedCount = json!.pages.filter(p => p.isProtected).length;
      expect(json!.summary.protectedPages).toBe(protectedCount);
    });

    it('should sort dependencies alphabetically', () => {
      const result = runScript('analyze:pages', '--json');
      const json = parseJsonOutput<AnalyzePagesJson>(result.output);
      
      expect(json).not.toBeNull();
      
      json!.pages.forEach(page => {
        if (page.dependencies.length > 1) {
          const sorted = [...page.dependencies].sort();
          expect(page.dependencies).toEqual(sorted);
        }
      });
    });

    it('should sort components alphabetically', () => {
      const result = runScript('analyze:pages', '--json');
      const json = parseJsonOutput<AnalyzePagesJson>(result.output);
      
      expect(json).not.toBeNull();
      
      json!.pages.forEach(page => {
        if (page.components.length > 1) {
          const sorted = [...page.components].sort();
          expect(page.components).toEqual(sorted);
        }
      });
    });

  });

  // --- Edge Cases ---
  describe('edge cases', () => {
    it('should handle pages with no dependencies', () => {
      const result = runScript('analyze:pages', '--json');
      const json = parseJsonOutput<AnalyzePagesJson>(result.output);
      
      expect(json).not.toBeNull();
      // The script should complete without errors
      expect(result.success).toBe(true);
      
      // Verify all pages have dependencies array (even if empty)
      json!.pages.forEach(page => {
        expect(Array.isArray(page.dependencies)).toBe(true);
      });
    });

    it('should handle pages with no components', () => {
      const result = runScript('analyze:pages', '--json');
      const json = parseJsonOutput<AnalyzePagesJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Verify all pages have components array (even if empty)
      json!.pages.forEach(page => {
        expect(Array.isArray(page.components)).toBe(true);
      });
    });

    it('should count total pages correctly', () => {
      const result = runScript('analyze:pages', '--json');
      const json = parseJsonOutput<AnalyzePagesJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Total pages should match pages array length
      expect(json!.summary.totalPages).toBe(json!.pages.length);
    });

    it('should handle empty UI components gracefully', () => {
      const result = runScript('analyze:pages', '--json');
      const json = parseJsonOutput<AnalyzePagesJson>(result.output);
      
      expect(json).not.toBeNull();
      
      // Verify all pages have uiComponents array (even if empty)
      json!.pages.forEach(page => {
        expect(Array.isArray(page.uiComponents)).toBe(true);
      });
    });
  });

  // --- Integration Tests with Test Fixtures ---
  describe('integration with test fixtures', () => {
    let testPageName: string;
    let testPagePath: string;
    afterEach(() => {
      // Clean up test artifacts
      const pathsToClean = [testPagePath].filter(Boolean);
      if (pathsToClean.length > 0) {
        cleanupTestArtifacts(pathsToClean);
      }
    });

    it('should create and analyze test page', () => {
      testPageName = generateTestName(TEST_PREFIX.PAGE);
      const createResult = runScript('create:page', `--name=${testPageName} --title="Test Page"`);
      expect(createResult.success).toBe(true);
      
      testPagePath = getPagePath(testPageName);
      expect(dirExists(testPagePath)).toBe(true);
      
      // Run analysis and verify page appears
      const result = runScript('analyze:pages', '--json');
      const json = parseJsonOutput<AnalyzePagesJson>(result.output);
      
      expect(json).not.toBeNull();
      const found = json!.pages.find(p => p.name === testPageName);
      expect(found).toBeDefined();
      expect(found!.isProtected).toBe(false);
    });

  });
});

