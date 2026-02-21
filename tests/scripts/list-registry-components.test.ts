import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const COMPONENTS_JSON_PATH = path.join(PROJECT_ROOT, 'components.json');

// Helper to run npm scripts
function runScript(scriptName: string, args: string = ''): { output: string; exitCode: number } {
  try {
    const output = execSync(`npm run ${scriptName} -- ${args}`, {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      timeout: 30000,
    });
    return { output, exitCode: 0 };
  } catch (error: unknown) {
    const execError = error as { stdout?: string; stderr?: string; status?: number };
    return {
      output: (execError.stdout || '') + (execError.stderr || ''),
      exitCode: execError.status || 1,
    };
  }
}

// Backup and restore components.json
let originalComponentsJson: string;

describe('list-registry-components script', () => {
  beforeEach(() => {
    // Backup components.json
    if (fs.existsSync(COMPONENTS_JSON_PATH)) {
      originalComponentsJson = fs.readFileSync(COMPONENTS_JSON_PATH, 'utf-8');
    }
  });

  afterEach(() => {
    // Restore components.json
    if (originalComponentsJson) {
      fs.writeFileSync(COMPONENTS_JSON_PATH, originalComponentsJson);
    }
  });

  describe('help and usage', () => {
    it('should display help with --help flag', () => {
      const result = runScript('list:registry', '--help');
      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('Usage:');
      expect(result.output).toContain('--registry');
      expect(result.output).toContain('--type');
      expect(result.output).toContain('--search');
      expect(result.output).toContain('--json');
    });
  });

  describe('list from default registry', () => {
    it('should list components from shadcn registry', () => {
      const result = runScript('list:registry');
      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('Fetching components from @shadcn');
      expect(result.output).toContain('Components from @shadcn');
      // Should contain some common components
      expect(result.output).toContain('button');
      expect(result.output).toContain('Total:');
    });

    it('should group components by type', () => {
      const result = runScript('list:registry');
      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('Ui Components');
    });
  });

  describe('filter by type', () => {
    it('should filter by ui type', () => {
      const result = runScript('list:registry', '--type=ui');
      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('Type: ui');
      expect(result.output).toContain('button');
    });

    it('should handle no results for invalid type', () => {
      const result = runScript('list:registry', '--type=nonexistent');
      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('No components found');
    });
  });

  describe('search components', () => {
    it('should search components by name', () => {
      const result = runScript('list:registry', '--search=button');
      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('button');
      expect(result.output).toContain('Filtered by search: "button"');
    });

    it('should return empty for non-matching search', () => {
      const result = runScript('list:registry', '--search=xyznonexistent123');
      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('No components found');
    });
  });

  describe('JSON output', () => {
    it('should output valid JSON with --json flag', () => {
      const result = runScript('list:registry', '--json');
      expect(result.exitCode).toBe(0);
      
      // Extract JSON from output (skip npm run header)
      const lines = result.output.split('\n');
      const jsonStartIndex = lines.findIndex(line => line.trim().startsWith('{'));
      const jsonLines = lines.slice(jsonStartIndex).join('\n');
      
      const json = JSON.parse(jsonLines);
      expect(json).toHaveProperty('registry');
      expect(json).toHaveProperty('total');
      expect(json).toHaveProperty('components');
      expect(Array.isArray(json.components)).toBe(true);
    });

    it('should include component details in JSON output', () => {
      const result = runScript('list:registry', '--json --search=button');
      expect(result.exitCode).toBe(0);
      
      const lines = result.output.split('\n');
      const jsonStartIndex = lines.findIndex(line => line.trim().startsWith('{'));
      const jsonLines = lines.slice(jsonStartIndex).join('\n');
      
      const json = JSON.parse(jsonLines);
      const buttonComponent = json.components.find((c: { name: string }) => c.name === 'button');
      expect(buttonComponent).toBeDefined();
      expect(buttonComponent).toHaveProperty('name');
      expect(buttonComponent).toHaveProperty('type');
    });
  });

  describe('custom registry', () => {
    it('should list from configured custom registry', () => {
      // Add a test registry
      const config = JSON.parse(originalComponentsJson);
      config.registries = config.registries || {};
      config.registries['@aceternity'] = 'https://ui.aceternity.com/registry/{name}.json';
      fs.writeFileSync(COMPONENTS_JSON_PATH, JSON.stringify(config, null, 2));

      const result = runScript('list:registry', '--registry=@aceternity');
      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('Fetching components from @aceternity');
      expect(result.output).toContain('Components from @aceternity');
    });

    it('should fall back to shadcn for unconfigured registry', () => {
      const result = runScript('list:registry', '--registry=@nonexistent');
      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('not found');
      expect(result.output).toContain('Using default shadcn registry');
    });
  });

  describe('combined filters', () => {
    it('should combine type and search filters', () => {
      const result = runScript('list:registry', '--type=ui --search=button');
      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('button');
      expect(result.output).toContain('Filtered by search: "button"');
    });

    it('should combine registry and search filters', () => {
      const result = runScript('list:registry', '--search=button');
      expect(result.exitCode).toBe(0);
      expect(result.output).toContain('button');
    });
  });

  describe('component descriptions', () => {
    it('should show descriptions for components from local annotations', () => {
      // Use @8bitcn which has local annotations
      const result = runScript('list:registry', '--registry=@8bitcn --search=button');
      expect(result.exitCode).toBe(0);
      // Button should have a description from local annotations
      expect(result.output).toMatch(/button.*Clickable buttons/i);
    });
  });
});

