import { readdirSync, statSync, copyFileSync, rmSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distPath = join(__dirname, '../dist');

console.log('🔨 Starting post-build cleanup...');

/**
 * Recursively copy directory contents
 */
function copyDirectory(src, dest) {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Check if directory exists
 */
function dirExists(dirPath) {
  return existsSync(dirPath) && statSync(dirPath).isDirectory();
}

/**
 * Step 1: Copy everything from dist/src/pages/* to dist/
 */
const srcPagesPath = join(distPath, 'src/pages');
if (existsSync(srcPagesPath) && dirExists(srcPagesPath)) {
  console.log('📦 Copying dist/src/pages/* to dist/...');
  
  const pages = readdirSync(srcPagesPath, { withFileTypes: true });
  
  for (const page of pages) {
    const pagePath = join(srcPagesPath, page.name);
    
    if (page.isDirectory()) {
      if (page.name === 'index') {
        // index page contents go to root
        console.log(`  ✓ Copying ${page.name}/ to dist/`);
        const files = readdirSync(pagePath, { withFileTypes: true });
        
        for (const file of files) {
          const srcFile = join(pagePath, file.name);
          const destFile = join(distPath, file.name);
          
          if (file.isDirectory()) {
            copyDirectory(srcFile, destFile);
          } else {
            copyFileSync(srcFile, destFile);
          }
        }
      } else {
        // Other pages go to dist/[page-name]/
        const destPagePath = join(distPath, page.name);
        console.log(`  ✓ Copying ${page.name}/ to dist/${page.name}/`);
        copyDirectory(pagePath, destPagePath);
      }
    }
  }
} else {
  console.log('ℹ️  No dist/src/pages/ directory found, skipping...');
}

/**
 * Step 2: Move everything from dist/index to dist/ (if it exists)
 */
const indexPath = join(distPath, 'index');
if (existsSync(indexPath) && dirExists(indexPath)) {
  console.log('📦 Moving dist/index/* to dist/...');
  
  const indexFiles = readdirSync(indexPath, { withFileTypes: true });
  
  for (const file of indexFiles) {
    const srcFile = join(indexPath, file.name);
    const destFile = join(distPath, file.name);
    
    if (file.isDirectory()) {
      copyDirectory(srcFile, destFile);
    } else {
      copyFileSync(srcFile, destFile);
    }
  }
} else {
  console.log('ℹ️  No dist/index/ directory found, skipping...');
}

/**
 * Step 3: Delete dist/src and dist/index directories
 */
console.log('🗑️  Cleaning up temporary directories...');

const srcPath = join(distPath, 'src');
if (existsSync(srcPath)) {
  console.log('  ✓ Removing dist/src/');
  rmSync(srcPath, { recursive: true, force: true });
}

if (existsSync(indexPath) && dirExists(indexPath)) {
  console.log('  ✓ Removing dist/index/');
  rmSync(indexPath, { recursive: true, force: true });
}

console.log('✅ Post-build cleanup complete!');

