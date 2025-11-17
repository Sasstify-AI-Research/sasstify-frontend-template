#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility functions
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function toKebabCase(str) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

// List all available pages (excluding index and dashboard which are core)
function listAvailablePages() {
  const pagesDir = path.join(process.cwd(), 'src/pages');
  
  if (!fs.existsSync(pagesDir)) {
    return [];
  }
  
  const pages = fs.readdirSync(pagesDir)
    .filter(file => {
      const fullPath = path.join(pagesDir, file);
      return fs.statSync(fullPath).isDirectory();
    })
    // Exclude index page (protected)
    .filter(page => page !== 'index');
  
  return pages;
}

// Update vite.config.ts to remove page
function updateViteConfig(pageNameKebab) {
  const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');
  let content = fs.readFileSync(viteConfigPath, 'utf8');
  
  let updateCount = 0;
  let warnings = [];
  
  // 1. Remove from rollupOptions.input
  // Pattern to match the page entry (with or without trailing comma, with or without quotes on key)
  const inputEntryPattern = new RegExp(
    `\\s*['"]?${pageNameKebab}['"]?:\\s*path\\.resolve\\(__dirname,\\s*['"]src/pages/${pageNameKebab}/index\\.html['"]\\),?\\n`,
    'g'
  );
  
  if (content.match(inputEntryPattern)) {
    content = content.replace(inputEntryPattern, '');
    updateCount++;
  } else {
    warnings.push('Could not find page entry in rollupOptions.input');
  }
  
  // 2. Remove from devServerMiddleware
  // Pattern to match the entire middleware block for this page
  const pageNameTitle = pageNameKebab
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Build pattern to match the page-specific middleware block
  // Matches the comment line + the two else-if blocks for this page + trailing whitespace
  const middlewarePattern = new RegExp(
    // Newline + Comment line: // Page Name page
    `(\\n[ \\t]*\\/\\/\\s*${pageNameTitle}\\s+page[^\\n]*\\n)` +
    // First else if block: else if (pathname === '/page-name' || pathname === '/page-name/')
    `([ \\t]*else\\s+if\\s*\\(pathname\\s*===\\s*['"]/${pageNameKebab}['"]\\s*\\|\\|\\s*pathname\\s*===\\s*['"]/${pageNameKebab}/['"]\\)\\s*\\{[^}]*\\}\\s*)` +
    // Second else if block: else if (pathname === '/page-name/index.html')
    `(else\\s+if\\s*\\(pathname\\s*===\\s*['"]/${pageNameKebab}/index\\.html['"]\\)\\s*\\{[^}]*\\}\\s*)` +
    // Trailing blank line(s) - match complete blank lines only (don't capture final indentation)
    `(?:\\n[ \\t]*\\n)+`,
    'gm'
  );
  
  if (content.match(middlewarePattern)) {
    content = content.replace(middlewarePattern, '\n');
    updateCount++;
  } else {
    warnings.push('Could not find page middleware in devServerMiddleware');
  }
  
  // 3. Write file
  fs.writeFileSync(viteConfigPath, content);
  
  if (updateCount === 2) {
    console.log(`  ✅ Updated vite.config.ts (removed ${updateCount}/2 sections)`);
  } else {
    console.log(`  ⚠️  Partially updated vite.config.ts (removed ${updateCount}/2 sections)`);
    if (warnings.length > 0) {
      console.log(`\n  ⚠️  Warnings:`);
      warnings.forEach(warning => console.log(`     - ${warning}`));
      console.log(`\n  📝 Manual cleanup required in vite.config.ts:`);
      if (updateCount < 1) {
        console.log(`     1. Remove from rollupOptions.input:`);
        console.log(`        ${pageNameKebab}: path.resolve(__dirname, 'src/pages/${pageNameKebab}/index.html'),`);
      }
      if (updateCount < 2) {
        console.log(`     2. Remove from devServerMiddleware:`);
        console.log(`        The entire block for /${pageNameKebab}/ routing`);
      }
    }
  }
}

// Main function
async function deletePage() {
  console.log('\n🗑️  Delete Page from MPA\n');

  try {
    // List available pages
    const availablePages = listAvailablePages();
    
    if (availablePages.length === 0) {
      console.log('❌ No deletable pages found!');
      console.log('   (only the index page is protected and cannot be deleted)\n');
      rl.close();
      process.exit(0);
    }
    
    console.log('📋 Available pages to delete:');
    availablePages.forEach((page, index) => {
      console.log(`   ${index + 1}. ${page}`);
    });
    console.log('');
    
    // Get page name
    const pageName = await question('? Page name to delete (kebab-case): ');
    const pageNameKebab = toKebabCase(pageName.trim());
    
    if (!pageNameKebab) {
      console.error('❌ Page name is required!');
      rl.close();
      process.exit(1);
    }
    
    // Check if it's a protected page
    if (pageNameKebab === 'index') {
      console.error(`❌ Cannot delete the index page!`);
      console.error('   The index page is required for the application.');
      rl.close();
      process.exit(1);
    }
    
    // Check if page exists
    const pagePath = path.join(process.cwd(), 'src/pages', pageNameKebab);
    if (!fs.existsSync(pagePath)) {
      console.error(`❌ Page "${pageNameKebab}" does not exist!`);
      rl.close();
      process.exit(1);
    }
    
    // Show what will be deleted
    console.log(`\n⚠️  This will DELETE the following:`);
    console.log(`   📁 src/pages/${pageNameKebab}/ (entire directory)`);
    
    // List files in the directory
    const listFiles = (dir, prefix = '   ') => {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const relativePath = fullPath.replace(process.cwd() + '/', '');
        if (fs.statSync(fullPath).isDirectory()) {
          console.log(`${prefix}📁 ${relativePath}/`);
          listFiles(fullPath, prefix + '   ');
        } else {
          console.log(`${prefix}📄 ${relativePath}`);
        }
      });
    };
    listFiles(pagePath);
    
    console.log(`   ⚙️  vite.config.ts (will be updated)`);
    console.log('');
    
    // Confirmation
    const confirm1 = await question(`? Are you sure you want to delete "${pageNameKebab}"? (yes/no): `);
    if (confirm1.toLowerCase() !== 'yes') {
      console.log('❌ Deletion cancelled.');
      rl.close();
      process.exit(0);
    }
    
    const confirm2 = await question('? Type the page name again to confirm: ');
    if (confirm2.trim() !== pageNameKebab) {
      console.log('❌ Page name did not match. Deletion cancelled.');
      rl.close();
      process.exit(0);
    }
    
    rl.close();
    
    console.log('\n🗑️  Deleting page...\n');
    
    // 1. Delete page directory
    fs.rmSync(pagePath, { recursive: true, force: true });
    console.log(`  ✅ Deleted src/pages/${pageNameKebab}/`);
    
    // 2. Update vite.config.ts
    updateViteConfig(pageNameKebab);
    
    // 3. Check dist folder (in case it was built)
    const distPagePath = path.join(process.cwd(), 'dist', pageNameKebab);
    if (fs.existsSync(distPagePath)) {
      fs.rmSync(distPagePath, { recursive: true, force: true });
      console.log(`  ✅ Deleted dist/${pageNameKebab}/`);
    }
    
    // Success message
    console.log('\n✅ Success! Page deleted!\n');
    console.log('📝 Next steps:');
    console.log('  1. Review vite.config.ts to ensure proper cleanup');
    console.log('  2. Restart dev server if running (npm run dev)');
    console.log('  3. Rebuild if needed (npm run build)\n');
    console.log('💡 Tip: You can recreate this page anytime with:');
    console.log(`     npm run create:page\n`);
    
  } catch (error) {
    console.error('\n❌ Error deleting page:', error.message);
    rl.close();
    process.exit(1);
  }
}

// Run
deletePage();

