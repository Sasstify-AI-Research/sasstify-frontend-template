/**
 * Shared test utilities for script functional tests
 */

import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';
import fs from 'fs';
import path from 'path';

// Test naming prefixes to avoid conflicts
export const TEST_PREFIX = {
  PAGE: 'script-test-page',
  COMPONENT: 'script-test-comp',
  UI_COMPONENT: 'script-test-ui',
  BLOCK_COMPONENT: 'script-test-block',
};

// Project root directory (use process.cwd() for consistency with script execution)
export const PROJECT_ROOT = process.cwd();

// Common paths
export const PATHS = {
  src: path.join(PROJECT_ROOT, 'src'),
  pages: path.join(PROJECT_ROOT, 'src/pages'),
  components: path.join(PROJECT_ROOT, 'src/components'),
  uiComponents: path.join(PROJECT_ROOT, 'src/components/ui'),
  blockComponents: path.join(PROJECT_ROOT, 'src/components/blocks'),
  testsUnit: path.join(PROJECT_ROOT, 'tests/unit'),
  testsE2e: path.join(PROJECT_ROOT, 'tests/e2e'),
  blockTests: path.join(PROJECT_ROOT, 'tests/unit/components/blocks'),
  viteConfig: path.join(PROJECT_ROOT, 'vite.config.ts'),
  packageJson: path.join(PROJECT_ROOT, 'package.json'),
};

/**
 * Execute an npm script and return the output
 */
export function runScript(
  scriptName: string,
  args: string = '',
  options: { throwOnError?: boolean } = {}
): { success: boolean; output: string; exitCode: number } {
  const { throwOnError = false } = options;
  
  try {
    const output = execSync(`npm run ${scriptName} -- ${args}`, {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      stdio: 'pipe',
    } as ExecSyncOptionsWithStringEncoding);
    
    return { success: true, output, exitCode: 0 };
  } catch (error: unknown) {
    const execError = error as { stdout?: string; stderr?: string; status?: number };
    const output = execError.stdout || execError.stderr || String(error);
    const exitCode = execError.status || 1;
    
    if (throwOnError) {
      throw error;
    }
    
    return { success: false, output, exitCode };
  }
}

/**
 * Check if a file or directory exists
 */
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Check if a directory exists and is a directory
 */
export function dirExists(dirPath: string): boolean {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

/**
 * Read file contents
 */
export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Read and parse JSON file
 */
export function readJsonFile<T = unknown>(filePath: string): T {
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content) as T;
}

/**
 * Clean up test artifacts (files/folders)
 */
export function cleanupTestArtifacts(paths: string[]): void {
  for (const p of paths) {
    if (fs.existsSync(p)) {
      const stat = fs.statSync(p);
      if (stat.isDirectory()) {
        fs.rmSync(p, { recursive: true, force: true });
      } else {
        fs.unlinkSync(p);
      }
    }
  }
}

/**
 * Get page path
 */
export function getPagePath(pageName: string): string {
  return path.join(PATHS.pages, pageName);
}

/**
 * Get component path
 */
export function getComponentPath(componentName: string): string {
  return path.join(PATHS.components, componentName);
}

/**
 * Get UI component path
 */
export function getUIComponentPath(componentName: string): string {
  return path.join(PATHS.uiComponents, componentName);
}

/**
 * Get block component path
 */
export function getBlockComponentPath(componentName: string): string {
  return path.join(PATHS.blockComponents, componentName);
}


/**
 * Get unit test path for a block component
 */
export function getBlockComponentTestPath(componentName: string): string {
  return path.join(PATHS.blockTests, `${toPascalCase(componentName)}.test.tsx`);
}

/**
 * Get unit test path for a component
 */
export function getComponentTestPath(
  componentName: string, 
  isUI: boolean = false,
  isBlock: boolean = false
): string {
  if (isBlock) {
    return getBlockComponentTestPath(componentName);
  }
  if (isUI) {
    return path.join(PATHS.testsUnit, 'components/ui', `${toPascalCase(componentName)}.test.tsx`);
  }
  return path.join(PATHS.testsUnit, 'components', `${toPascalCase(componentName)}.test.tsx`);
}

/**
 * Get unit test path for a page sub-component
 */
export function getPageComponentTestPath(pageName: string, componentName: string): string {
  return path.join(PATHS.testsUnit, 'pages', pageName, `${toPascalCase(componentName)}.test.tsx`);
}

/**
 * Get e2e test path for a page
 */
export function getE2eTestPath(pageName: string): string {
  return path.join(PATHS.testsE2e, `${pageName}.spec.ts`);
}

/**
 * Convert kebab-case to PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Convert string to kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Generate a unique test name with timestamp and random suffix
 */
export function generateTestName(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${prefix}-${timestamp}${random}`;
}

/**
 * Wait for a condition to be true (useful for async operations)
 */
export async function waitFor(
  condition: () => boolean,
  timeout: number = 5000,
  interval: number = 100
): Promise<boolean> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (condition()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  return false;
}

/**
 * Check if vite.config.ts contains a page entry
 */
export function viteConfigHasPage(pageName: string): boolean {
  const content = readFile(PATHS.viteConfig);
  return content.includes(`'${pageName}'`) || content.includes(`"${pageName}"`);
}

/**
 * Check if package.json has a dependency
 */
export function hasDependency(depName: string): boolean {
  const pkg = readJsonFile<{ dependencies?: Record<string, string>; devDependencies?: Record<string, string> }>(PATHS.packageJson);
  return !!(pkg.dependencies?.[depName] || pkg.devDependencies?.[depName]);
}

/**
 * Install an npm dependency
 * @param depName - The dependency name (e.g., 'lodash', 'dayjs')
 * @param isDev - Whether to install as devDependency (default: false)
 * @returns Object with success status and output
 */
export function installDependency(
  depName: string,
  isDev: boolean = false
): { success: boolean; output: string } {
  try {
    const flag = isDev ? '--save-dev' : '--save';
    const output = execSync(`npm install ${depName} ${flag}`, {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      stdio: 'pipe',
    } as ExecSyncOptionsWithStringEncoding);
    
    return { success: true, output };
  } catch (error: unknown) {
    const execError = error as { stdout?: string; stderr?: string };
    const output = execError.stdout || execError.stderr || String(error);
    return { success: false, output };
  }
}

/**
 * Uninstall an npm dependency
 * @param depName - The dependency name to uninstall
 * @returns Object with success status and output
 */
export function uninstallDependency(depName: string): { success: boolean; output: string } {
  try {
    const output = execSync(`npm uninstall ${depName}`, {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      stdio: 'pipe',
    } as ExecSyncOptionsWithStringEncoding);
    
    return { success: true, output };
  } catch (error: unknown) {
    const execError = error as { stdout?: string; stderr?: string };
    const output = execError.stdout || execError.stderr || String(error);
    return { success: false, output };
  }
}

/**
 * Install multiple npm dependencies
 * @param deps - Array of dependency names
 * @param isDev - Whether to install as devDependencies (default: false)
 * @returns Object with success status, installed deps, and failed deps
 */
export function installDependencies(
  deps: string[],
  isDev: boolean = false
): { success: boolean; installed: string[]; failed: string[] } {
  const installed: string[] = [];
  const failed: string[] = [];
  
  for (const dep of deps) {
    const result = installDependency(dep, isDev);
    if (result.success) {
      installed.push(dep);
    } else {
      failed.push(dep);
    }
  }
  
  return {
    success: failed.length === 0,
    installed,
    failed,
  };
}

/**
 * Uninstall multiple npm dependencies
 * @param deps - Array of dependency names to uninstall
 * @returns Object with success status, uninstalled deps, and failed deps
 */
export function uninstallDependencies(
  deps: string[]
): { success: boolean; uninstalled: string[]; failed: string[] } {
  const uninstalled: string[] = [];
  const failed: string[] = [];
  
  for (const dep of deps) {
    const result = uninstallDependency(dep);
    if (result.success) {
      uninstalled.push(dep);
    } else {
      failed.push(dep);
    }
  }
  
  return {
    success: failed.length === 0,
    uninstalled,
    failed,
  };
}

/**
 * Add an import statement to a file
 * @param filePath - Path to the file
 * @param importStatement - The import statement to add (e.g., "import dayjs from 'dayjs';")
 */
export function addImportToFile(filePath: string, importStatement: string): boolean {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    content = `${importStatement}\n${content}`;
    fs.writeFileSync(filePath, content);
    return true;
  } catch {
    return false;
  }
}

/**
 * Add code to use an imported dependency in a component
 * @param filePath - Path to the component file
 * @param usageCode - The code to add that uses the dependency
 */
export function addDependencyUsage(filePath: string, usageCode: string): boolean {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the return statement and add usage before it
    const returnIndex = content.indexOf('return (');
    if (returnIndex === -1) {
      return false;
    }
    
    content = content.slice(0, returnIndex) + usageCode + '\n  ' + content.slice(returnIndex);
    fs.writeFileSync(filePath, content);
    return true;
  } catch {
    return false;
  }
}

/**
 * List files in a directory
 */
export function listFiles(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  return fs.readdirSync(dirPath);
}

/**
 * Create a test cleanup function for use in afterEach
 */
export function createCleanup(paths: string[]): () => void {
  return () => {
    cleanupTestArtifacts(paths);
  };
}

/**
 * Clean up all test artifacts matching patterns
 * This is a comprehensive cleanup that finds artifacts by pattern
 */
export function cleanupAllTestArtifacts(): void {
  // Match both hyphenated and non-hyphenated versions
  const matchesTestPattern = (name: string): boolean => {
    const lower = name.toLowerCase();
    return lower.includes('script-test') || 
           lower.includes('scripttest') ||
           lower.includes('invalidname') ||
           lower.startsWith('script');
  };
  
  // Clean up pages
  const pagesDir = PATHS.pages;
  if (fs.existsSync(pagesDir)) {
    for (const dir of fs.readdirSync(pagesDir)) {
      if (matchesTestPattern(dir)) {
        try {
          fs.rmSync(path.join(pagesDir, dir), { recursive: true, force: true });
        } catch { /* ignore */ }
      }
    }
  }
  
  // Clean up components
  const componentsDir = PATHS.components;
  if (fs.existsSync(componentsDir)) {
    for (const dir of fs.readdirSync(componentsDir)) {
      if (matchesTestPattern(dir)) {
        try {
          fs.rmSync(path.join(componentsDir, dir), { recursive: true, force: true });
        } catch { /* ignore */ }
      }
    }
  }
  
  // Clean up UI components
  const uiDir = PATHS.uiComponents;
  if (fs.existsSync(uiDir)) {
    for (const dir of fs.readdirSync(uiDir)) {
      if (matchesTestPattern(dir)) {
        try {
          fs.rmSync(path.join(uiDir, dir), { recursive: true, force: true });
        } catch { /* ignore */ }
      }
    }
  }
  
  // Clean up e2e tests
  const e2eDir = PATHS.testsE2e;
  if (fs.existsSync(e2eDir)) {
    for (const file of fs.readdirSync(e2eDir)) {
      if (matchesTestPattern(file)) {
        try {
          fs.unlinkSync(path.join(e2eDir, file));
        } catch { /* ignore */ }
      }
    }
  }
  
  // Clean up unit tests for pages
  const unitPagesDir = path.join(PATHS.testsUnit, 'pages');
  if (fs.existsSync(unitPagesDir)) {
    for (const dir of fs.readdirSync(unitPagesDir)) {
      if (matchesTestPattern(dir)) {
        try {
          fs.rmSync(path.join(unitPagesDir, dir), { recursive: true, force: true });
        } catch { /* ignore */ }
      }
    }
  }
  
  // Clean up unit tests for components (including subdirectories like blocks/ and ui/)
  const unitComponentsDir = path.join(PATHS.testsUnit, 'components');
  if (fs.existsSync(unitComponentsDir)) {
    // Clean up files directly in components directory
    for (const file of fs.readdirSync(unitComponentsDir)) {
      if (matchesTestPattern(file)) {
        try {
          const filePath = path.join(unitComponentsDir, file);
          if (fs.statSync(filePath).isDirectory()) {
            fs.rmSync(filePath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(filePath);
          }
        } catch { /* ignore */ }
      }
    }
    
    // Clean up test files in subdirectories (blocks/, ui/, etc.)
    const subdirs = ['blocks', 'ui'];
    for (const subdir of subdirs) {
      const subdirPath = path.join(unitComponentsDir, subdir);
      if (fs.existsSync(subdirPath)) {
        for (const file of fs.readdirSync(subdirPath)) {
          if (matchesTestPattern(file)) {
            try {
              const filePath = path.join(subdirPath, file);
              fs.unlinkSync(filePath);
            } catch { /* ignore */ }
          }
        }
      }
    }
  }
  
  // Clean up vite.config.ts entries for test pages
  cleanupViteConfig(matchesTestPattern);
}

/**
 * Clean up vite.config.ts entries matching test patterns
 * Removes both rollupOptions.input entries and devServerMiddleware blocks
 */
export function cleanupViteConfig(matchesTestPattern: (name: string) => boolean): void {
  const viteConfigPath = PATHS.viteConfig;
  if (!fs.existsSync(viteConfigPath)) return;
  
  try {
    let content = fs.readFileSync(viteConfigPath, 'utf8');
    const originalContent = content;
    
    // Find all page names in rollupOptions.input that match test pattern
    const inputEntryRegex = /['"]([^'"]+)['"]:\s*path\.resolve\(__dirname,\s*['"]src\/pages\/([^'"]+)\/index\.html['"]\)/g;
    const testPageNames: string[] = [];
    
    let match;
    while ((match = inputEntryRegex.exec(content)) !== null) {
      const pageName = match[1];
      if (matchesTestPattern(pageName)) {
        testPageNames.push(pageName);
      }
    }
    
    // Remove each test page entry from rollupOptions.input and devServerMiddleware
    for (const pageNameKebab of testPageNames) {
      // Remove from rollupOptions.input (handles various formats with optional trailing comma and newlines)
      const inputPattern = new RegExp(
        `\\s*['"]?${escapeRegex(pageNameKebab)}['"]?:\\s*path\\.resolve\\(__dirname,\\s*['"]src/pages/${escapeRegex(pageNameKebab)}/index\\.html['"]\\),?\\s*\\n`,
        'g'
      );
      content = content.replace(inputPattern, '\n');
      
      // Remove from devServerMiddleware
      // Convert kebab-case to Title Case for comment matching
      const pageNameTitle = pageNameKebab
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Pattern to match the entire middleware block including comment
      const middlewarePattern = new RegExp(
        `\\n[ \\t]*\\/\\/\\s*${escapeRegex(pageNameTitle)}\\s+page[^\\n]*\\n` +
        `[ \\t]*else\\s+if\\s*\\(pathname\\s*===\\s*['"]/${escapeRegex(pageNameKebab)}['"]\\s*\\|\\|\\s*pathname\\s*===\\s*['"]/${escapeRegex(pageNameKebab)}/['"]\\)\\s*\\{[^}]*\\}\\s*` +
        `else\\s+if\\s*\\(pathname\\s*===\\s*['"]/${escapeRegex(pageNameKebab)}/index\\.html['"]\\)\\s*\\{[^}]*\\}\\s*` +
        `(?:\\n[ \\t]*\\n)*`,
        'gm'
      );
      content = content.replace(middlewarePattern, '\n');
    }
    
    // Only write if content changed
    if (content !== originalContent) {
      // Clean up multiple consecutive blank lines
      content = content.replace(/\n{3,}/g, '\n\n');
      fs.writeFileSync(viteConfigPath, content);
    }
  } catch {
    // Ignore errors during cleanup
  }
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Parse JSON output from npm script output
 * Extracts JSON from the output, skipping npm logs and other noise
 * @param output - The raw output from runScript
 * @returns Parsed JSON object or null if parsing fails
 */
export function parseJsonOutput<T = unknown>(output: string): T | null {
  try {
    const lines = output.split('\n');
    
    // Find the first line that starts with '{' (JSON object start)
    const jsonStart = lines.findIndex(l => l.trim().startsWith('{'));
    if (jsonStart === -1) return null;
    
    // Find the last line that ends with '}' (JSON object end)
    let jsonEnd = -1;
    for (let i = lines.length - 1; i >= jsonStart; i--) {
      if (lines[i].trim().endsWith('}')) {
        jsonEnd = i;
        break;
      }
    }
    if (jsonEnd === -1) return null;
    
    // Extract and parse JSON
    const jsonString = lines.slice(jsonStart, jsonEnd + 1).join('\n');
    return JSON.parse(jsonString) as T;
  } catch {
    return null;
  }
}

