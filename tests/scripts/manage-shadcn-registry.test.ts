/**
 * Functional tests for manage-shadcn-registry.js script
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  runScript,
  fileExists,
  readFile,
  PROJECT_ROOT,
} from './helpers/test-utils';

// Path to components.json
const COMPONENTS_JSON_PATH = path.join(PROJECT_ROOT, 'components.json');

// Backup of original components.json
let originalComponentsJson: string | null = null;

/**
 * Read and parse components.json
 */
function readComponentsJson(): Record<string, unknown> {
  if (!fileExists(COMPONENTS_JSON_PATH)) {
    throw new Error('components.json not found');
  }
  return JSON.parse(readFile(COMPONENTS_JSON_PATH));
}

/**
 * Write components.json
 */
function writeComponentsJson(config: Record<string, unknown>): void {
  fs.writeFileSync(COMPONENTS_JSON_PATH, JSON.stringify(config, null, 2) + '\n');
}

describe('manage-shadcn-registry script', () => {
  beforeEach(() => {
    // Backup original components.json
    if (fileExists(COMPONENTS_JSON_PATH)) {
      originalComponentsJson = readFile(COMPONENTS_JSON_PATH);
    }
  });

  afterEach(() => {
    // Restore original components.json
    if (originalComponentsJson !== null) {
      fs.writeFileSync(COMPONENTS_JSON_PATH, originalComponentsJson);
    }
    originalComponentsJson = null;
  });

  describe('help and usage', () => {
    it('should display help with --help flag', () => {
      const result = runScript('manage:registry', '--help');
      
      expect(result.success).toBe(true);
      expect(result.output).toContain('Usage:');
      expect(result.output).toContain('--list');
      expect(result.output).toContain('--add');
      expect(result.output).toContain('--url');
      expect(result.output).toContain('--remove');
    });

    it('should display help with -h flag', () => {
      const result = runScript('manage:registry', '-h');
      
      expect(result.success).toBe(true);
      expect(result.output).toContain('Usage:');
    });
  });

  describe('list available registries', () => {
    it('should list available registries with --list flag', () => {
      const result = runScript('manage:registry', '--list');
      
      expect(result.success).toBe(true);
      expect(result.output).toContain('Available Registries');
      // Should show at least the fallback registries
      expect(result.output).toContain('@shadcn');
      expect(result.output).toContain('@magicui');
      expect(result.output).toContain('magicui.design');
    });

    it('should output JSON with --list --json flags', () => {
      const result = runScript('manage:registry', '--list --json');
      
      expect(result.success).toBe(true);
      
      // Extract JSON from output
      const lines = result.output.split('\n');
      const jsonStartIndex = lines.findIndex(line => line.trim().startsWith('{'));
      const jsonLines = lines.slice(jsonStartIndex).join('\n');
      
      const json = JSON.parse(jsonLines);
      expect(json).toHaveProperty('registries');
      expect(json).toHaveProperty('total');
      expect(Array.isArray(json.registries)).toBe(true);
      
      // Each registry should have namespace, url, description
      if (json.registries.length > 0) {
        const registry = json.registries[0];
        expect(registry).toHaveProperty('namespace');
        expect(registry).toHaveProperty('url');
        expect(registry).toHaveProperty('description');
      }
    });
  });

  describe('list current registries', () => {
    it('should show no registries when none configured', () => {
      // Ensure no registries in config
      const config = readComponentsJson();
      delete config.registries;
      writeComponentsJson(config);
      
      const result = runScript('manage:registry', '--current');
      
      expect(result.success).toBe(true);
      expect(result.output).toContain('No registries configured');
    });

    it('should list current registries when configured', () => {
      // Add a test registry
      const config = readComponentsJson();
      config.registries = {
        '@test': { url: 'https://test.com/r/{name}.json' }
      };
      writeComponentsJson(config);
      
      const result = runScript('manage:registry', '--current');
      
      expect(result.success).toBe(true);
      expect(result.output).toContain('@test');
      expect(result.output).toContain('https://test.com/r/{name}.json');
    });

    it('should output JSON with --current --json flags', () => {
      // Add a test registry
      const config = readComponentsJson();
      config.registries = {
        '@testjson': 'https://testjson.com/r/{name}.json'
      };
      writeComponentsJson(config);
      
      const result = runScript('manage:registry', '--current --json');
      
      expect(result.success).toBe(true);
      
      // Extract JSON from output
      const lines = result.output.split('\n');
      const jsonStartIndex = lines.findIndex(line => line.trim().startsWith('{'));
      const jsonLines = lines.slice(jsonStartIndex).join('\n');
      
      const json = JSON.parse(jsonLines);
      expect(json).toHaveProperty('registries');
      expect(json).toHaveProperty('total');
      expect(Array.isArray(json.registries)).toBe(true);
      
      // Should contain the test registry
      const testRegistry = json.registries.find((r: { namespace: string }) => r.namespace === '@testjson');
      expect(testRegistry).toBeDefined();
      expect(testRegistry.url).toBe('https://testjson.com/r/{name}.json');
    });

    it('should output empty array as JSON when no registries configured', () => {
      // Ensure no registries in config
      const config = readComponentsJson();
      delete config.registries;
      writeComponentsJson(config);
      
      const result = runScript('manage:registry', '--current --json');
      
      expect(result.success).toBe(true);
      
      // Extract JSON from output
      const lines = result.output.split('\n');
      const jsonStartIndex = lines.findIndex(line => line.trim().startsWith('{'));
      const jsonLines = lines.slice(jsonStartIndex).join('\n');
      
      const json = JSON.parse(jsonLines);
      expect(json.registries).toEqual([]);
      expect(json.total).toBe(0);
    });
  });

  describe('add registry', () => {
    it('should add registry with @namespace and URL', () => {
      const result = runScript('manage:registry', '--add=@magicui --url=https://magicui.design/r/{name}.json');
      
      expect(result.success).toBe(true);
      expect(result.output).toContain('added successfully');
      expect(result.output).toContain('@magicui');
      
      // Verify registry was added to components.json (stored as string, shadcn format)
      const config = readComponentsJson();
      expect(config.registries).toBeDefined();
      const registries = config.registries as Record<string, string>;
      expect(registries['@magicui']).toBeDefined();
      expect(registries['@magicui']).toBe('https://magicui.design/r/{name}.json');
    });

    it('should add custom registry with @namespace and URL', () => {
      const result = runScript('manage:registry', '--add=@myteam --url=https://my-registry.com/r/{name}.json');
      
      expect(result.success).toBe(true);
      expect(result.output).toContain('added successfully');
      expect(result.output).toContain('@myteam');
      
      const config = readComponentsJson();
      const registries = config.registries as Record<string, string>;
      expect(registries['@myteam']).toBeDefined();
      expect(registries['@myteam']).toBe('https://my-registry.com/r/{name}.json');
    });
  });

  describe('validation', () => {
    it('should require URL when adding registry', () => {
      const result = runScript('manage:registry', '--add=@magicui');
      
      expect(result.success).toBe(false);
      expect(result.output).toContain('URL is required');
    });

    it('should reject namespace without @ prefix', () => {
      const result = runScript('manage:registry', '--add=magicui --url=https://magicui.design/r/{name}.json');
      
      expect(result.success).toBe(false);
      expect(result.output).toContain('must start with @');
    });

    it('should reject invalid URL without {name} placeholder', () => {
      const result = runScript('manage:registry', '--add=@invalid --url=https://invalid.com/r/component.json');
      
      expect(result.success).toBe(false);
      expect(result.output).toContain('Invalid URL');
      expect(result.output).toContain('{name}');
    });

    it('should reject malformed URL', () => {
      const result = runScript('manage:registry', '--add=@bad --url=not-a-valid-url');
      
      expect(result.success).toBe(false);
      expect(result.output).toContain('Invalid URL');
    });
  });

  describe('duplicate handling', () => {
    it('should handle duplicate registry gracefully', () => {
      // Add registry first time
      runScript('manage:registry', '--add=@magicui --url=https://magicui.design/r/{name}.json');
      
      // Try to add same registry again
      const result = runScript('manage:registry', '--add=@magicui --url=https://magicui.design/r/{name}.json');
      
      expect(result.success).toBe(false);
      expect(result.output).toContain('already exists');
    });
  });

  describe('remove registry', () => {
    it('should remove existing registry', () => {
      // Add registry first
      runScript('manage:registry', '--add=@magicui --url=https://magicui.design/r/{name}.json');
      
      // Verify it was added
      let config = readComponentsJson();
      expect((config.registries as Record<string, unknown>)['@magicui']).toBeDefined();
      
      // Remove registry
      const result = runScript('manage:registry', '--remove=@magicui');
      
      expect(result.success).toBe(true);
      expect(result.output).toContain('removed successfully');
      
      // Verify it was removed
      config = readComponentsJson();
      if (config.registries) {
        expect((config.registries as Record<string, unknown>)['@magicui']).toBeUndefined();
      }
    });

    it('should handle removal of non-existent registry', () => {
      const result = runScript('manage:registry', '--remove=@nonexistent');
      
      expect(result.success).toBe(false);
      expect(result.output).toContain('not found');
    });

    it('should reject removal without @ prefix', () => {
      // Add registry first
      runScript('manage:registry', '--add=@aceternity --url=https://ui.aceternity.com/r/{name}.json');
      
      // Try to remove without @ prefix
      const result = runScript('manage:registry', '--remove=aceternity');
      
      expect(result.success).toBe(false);
      expect(result.output).toContain('must start with @');
    });

    it('should clean up empty registries object', () => {
      // First, ensure no registries exist
      let config = readComponentsJson();
      if (config.registries) {
        delete config.registries;
        writeComponentsJson(config);
      }
      
      // Add a registry
      runScript('manage:registry', '--add=@testcleanup --url=https://test-cleanup.com/r/{name}.json');
      
      // Verify registries object exists
      config = readComponentsJson();
      expect(config.registries).toBeDefined();
      expect((config.registries as Record<string, unknown>)['@testcleanup']).toBeDefined();
      
      // Remove the registry
      runScript('manage:registry', '--remove=@testcleanup');
      
      // Verify registries object is removed when empty
      config = readComponentsJson();
      expect(config.registries).toBeUndefined();
    });
  });

  describe('preserve existing config', () => {
    it('should preserve existing registries when adding new', () => {
      // Add first registry
      runScript('manage:registry', '--add=@magicui --url=https://magicui.design/r/{name}.json');
      
      // Add second registry
      runScript('manage:registry', '--add=@aceternity --url=https://ui.aceternity.com/r/{name}.json');
      
      // Verify both exist
      const config = readComponentsJson();
      const registries = config.registries as Record<string, { url: string }>;
      expect(registries['@magicui']).toBeDefined();
      expect(registries['@aceternity']).toBeDefined();
    });

    it('should preserve other components.json fields', () => {
      // Read original config
      const originalConfig = readComponentsJson();
      const originalStyle = originalConfig.style;
      const originalTsx = originalConfig.tsx;
      
      // Add registry
      runScript('manage:registry', '--add=@magicui --url=https://magicui.design/r/{name}.json');
      
      // Verify other fields preserved
      const config = readComponentsJson();
      expect(config.style).toBe(originalStyle);
      expect(config.tsx).toBe(originalTsx);
      expect(config.$schema).toBeDefined();
      expect(config.tailwind).toBeDefined();
      expect(config.aliases).toBeDefined();
    });
  });

  describe('URL patterns', () => {
    it('should accept various valid URL patterns', () => {
      const validUrls = [
        'https://registry.com/r/{name}.json',
        'https://api.example.com/components/{name}',
        'https://cdn.test.io/registry/v1/{name}.json',
        'http://localhost:3000/r/{name}.json',
      ];
      
      for (let i = 0; i < validUrls.length; i++) {
        const result = runScript('manage:registry', `--add=@test${i} --url=${validUrls[i]}`);
        expect(result.success).toBe(true);
        
        // Clean up
        runScript('manage:registry', `--remove=@test${i}`);
      }
    });
  });
});
