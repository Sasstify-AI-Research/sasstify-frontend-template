#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  parseArgs,
  hasArgs,
  createPrompt,
  question,
  toPascalCase,
  toKebabCase,
  validateKebabCase,
  getKebabCaseError
} from './utils/cli.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File generators
function generateIndexHtml(pagePath, pageNameKebab, pageTitle, pageDescription) {
  const content = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${pageTitle}</title>
    <meta name="description" content="${pageDescription}" />
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/pages/${pageNameKebab}/main.tsx"></script>
  </body>
</html>
`;
  
  fs.writeFileSync(path.join(pagePath, 'index.html'), content);
  console.log(`  ✅ Created src/pages/${pageNameKebab}/index.html`);
}

function generateMainTsx(pagePath, pageNameKebab, pageNamePascal) {
  const content = `import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ${pageNamePascal} from './${pageNamePascal}'

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <${pageNamePascal} />
  </QueryClientProvider>
);
`;
  
  fs.writeFileSync(path.join(pagePath, 'main.tsx'), content);
  console.log(`  ✅ Created src/pages/${pageNameKebab}/main.tsx`);
}

function generatePageComponent(pagePath, pageNamePascal, pageNameKebab, pageTitle, needsCss) {
  const cssImport = needsCss ? `import styles from './${pageNamePascal}.module.css';\n` : '';
  const cssClass = needsCss ? ` className={styles.container}` : '';
  
  const content = `import Layout from '@/components/layout/Layout';
import Section from '@/components/section/Section';
${cssImport}
const ${pageNamePascal} = () => {
  return (
    <Layout fixedHeader={true}>
      <Section id="${pageNameKebab}" variant="white"${cssClass}>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">${pageTitle}</h1>
        <p className="text-xl text-gray-600 mb-8">
          Welcome to ${pageTitle}. Edit this content in src/pages/${pageNameKebab}/${pageNamePascal}.tsx
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-1">Getting Started</h4>
          <p className="text-blue-800 text-sm">
            This page was created using the create:page script. 
            Replace this content with your actual page content.
          </p>
        </div>
      </Section>
    </Layout>
  );
};

export default ${pageNamePascal};
`;
  
  fs.writeFileSync(path.join(pagePath, `${pageNamePascal}.tsx`), content);
  console.log(`  ✅ Created src/pages/${pageNameKebab}/${pageNamePascal}.tsx`);
}

function generateCssFile(pagePath, pageNameKebab, pageNamePascal) {
  const content = `.container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #ffffff, #f9fafb);
}

/* Section Spacing */
.section {
  padding: 3rem 0;
}

/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fadeIn {
  animation: fadeIn 0.6s ease-out;
}

/* Hover effects */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Responsive utilities */
@media (max-width: 768px) {
  .section {
    padding: 2rem 0;
  }
}
`;
  
  fs.writeFileSync(path.join(pagePath, `${pageNamePascal}.module.css`), content);
  console.log(`  ✅ Created src/pages/${pageNameKebab}/${pageNamePascal}.module.css`);
}

function generateE2eTest(pageNameKebab, pageNamePascal, pageTitle) {
  const testsPath = path.join(process.cwd(), 'tests/e2e');
  
  // Ensure tests/e2e directory exists
  if (!fs.existsSync(testsPath)) {
    fs.mkdirSync(testsPath, { recursive: true });
  }
  
  const content = `import { test, expect } from '@playwright/test';

test.describe('${pageTitle} page', () => {
  test('renders page heading', async ({ page }) => {
    await page.goto('/${pageNameKebab}/');

    // Check page title heading is visible
    await expect(
      page.getByRole('heading', { level: 1, name: /${pageTitle}/i }),
    ).toBeVisible();
  });
});
`;
  
  fs.writeFileSync(path.join(testsPath, `${pageNameKebab}.spec.ts`), content);
  console.log(`  ✅ Created tests/e2e/${pageNameKebab}.spec.ts`);
}

function generateComponentFile(componentsPath, componentName) {
  const content = `import { LucideIcon } from 'lucide-react';

interface ${componentName}Props {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

const ${componentName} = ({ 
  title = "Component Title",
  description = "This is a test component generated by the create:page script.",
  icon: Icon,
  variant = 'default' 
}: ${componentName}Props) => {
  
  const variantClasses = {
    default: 'bg-gray-50 border-gray-200 text-gray-900',
    primary: 'bg-blue-50 border-blue-200 text-blue-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  };

  return (
    <div className={\`p-6 rounded-lg border-2 \${variantClasses[variant]} transition-all hover:shadow-lg\`}>
      {Icon && (
        <div className="mb-4">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-80">{description}</p>
      
      {/* Example usage area */}
      <div className="mt-4 pt-4 border-t border-current/10">
        <p className="text-xs opacity-60">
          Edit this component in components/${componentName}.tsx
        </p>
      </div>
    </div>
  );
};

export default ${componentName};
`;
  
  fs.writeFileSync(path.join(componentsPath, `${componentName}.tsx`), content);
  console.log(`  ✅ Created component: ${componentName}.tsx`);
}

function updateViteConfig(pageNameKebab) {
  const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');
  let content = fs.readFileSync(viteConfigPath, 'utf8');
  
  let updateCount = 0;
  let warnings = [];
  
  // 1. Add to rollupOptions.input
  const inputPattern = /input:\s*{([^}]+)}/s;
  const inputMatch = content.match(inputPattern);
  
  if (inputMatch) {
    const newEntry = `\n          '${pageNameKebab}': path.resolve(__dirname, 'src/pages/${pageNameKebab}/index.html'),`;
    content = content.replace(inputPattern, (match, entries) => {
      updateCount++;
      return `input: {${entries}${newEntry}\n        }`;
    });
  } else {
    warnings.push('Could not find rollupOptions.input section');
  }
  
  // 2. Add to devServerMiddleware
  // Convert kebab-case to Title Case (e.g., "user-profile" -> "User Profile")
  const pageNameTitle = pageNameKebab
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // More robust pattern: looks for the comment with flexible spacing
  const middlewarePattern = /([ \t]*)(\/\/\s*Add more page rewrites here[^\n]*)/;
  const middlewareMatch = content.match(middlewarePattern);
  
  if (middlewareMatch) {
    const indent = middlewareMatch[1] || '        '; // Capture only spaces/tabs, default to 8 spaces
    const newMiddleware = `${indent}// ${pageNameTitle} page
${indent}else if (pathname === '/${pageNameKebab}' || pathname === '/${pageNameKebab}/') {
${indent}  req.url = url.replace(pathname, '/src/pages/${pageNameKebab}/index.html');
${indent}} else if (pathname === '/${pageNameKebab}/index.html') {
${indent}  req.url = url.replace(pathname, '/src/pages/${pageNameKebab}/index.html');
${indent}}
${indent}
${indent}${middlewareMatch[2]}`;
    
    content = content.replace(middlewarePattern, newMiddleware);
    updateCount++;
  } else {
    warnings.push('Could not find devServerMiddleware section');
  }
  
  // 3. Write file and report results
  fs.writeFileSync(viteConfigPath, content);
  
  if (updateCount === 2) {
    console.log(`  ✅ Updated vite.config.ts (${updateCount}/2 sections)`);
  } else {
    console.log(`  ⚠️  Partially updated vite.config.ts (${updateCount}/2 sections)`);
    if (warnings.length > 0) {
      console.log(`\n  ⚠️  Warnings:`);
      warnings.forEach(warning => console.log(`     - ${warning}`));
      console.log(`\n  📝 Manual steps required:`);
      console.log(`     1. Open vite.config.ts`);
      if (updateCount === 0) {
        console.log(`     2. Add to rollupOptions.input:`);
        console.log(`        ${pageNameKebab}: path.resolve(__dirname, 'src/pages/${pageNameKebab}/index.html'),`);
      }
      if (updateCount < 2) {
        console.log(`     2. Add to devServerMiddleware before "// Add more page rewrites":`);
        console.log(`        else if (pathname === '/${pageNameKebab}' || pathname === '/${pageNameKebab}/') {`);
        console.log(`          req.url = url.replace(pathname, '/src/pages/${pageNameKebab}/index.html');`);
        console.log(`        }`);
      }
    }
  }
}

function printUsage() {
  console.log(`
Usage: npm run create:page [options]

Options:
  --name=<name>           Page name in kebab-case (required for non-interactive)
  --title=<title>         Page title (required for non-interactive)
  --description=<desc>    Page description (optional)
  --css                   Create CSS file (default: false)
  --components            Create components folder (default: false)
  --component=<name>      Initial component name (requires --components)
  --help / -h             Show this help message

Examples:
  npm run create:page
  npm run create:page -- --name=user-profile --title="User Profile"
  npm run create:page -- --name=settings --title="Settings" --css --components
  npm run create:page -- --name=dashboard --title="Dashboard" --css --components --component=DashboardCard
`);
}

// Main function
async function createPage() {
  const args = parseArgs();
  
  // Show help
  if (args.help || args.h) {
    printUsage();
    process.exit(0);
  }
  
  let rl = null;
  
  try {
    let pageNameKebab, pageTitle, pageDescription, needsCss, needsComponents, componentName;
    
    if (hasArgs() && args.name && args.title) {
      // Non-interactive mode with CLI arguments
      console.log('\n✨ Create New Page for MPA (CLI Mode)\n');
      
      pageNameKebab = toKebabCase(args.name);
      
      if (!validateKebabCase(pageNameKebab)) {
        console.error(`❌ ${getKebabCaseError('Page')}`);
        process.exit(1);
      }
      
      pageTitle = args.title;
      pageDescription = args.description || '';
      needsCss = args.css === true; // Default false, opt-in with --css
      needsComponents = args.components === true; // Default false, opt-in with --components
      componentName = args.component || '';
      
    } else {
      // Interactive mode
      console.log('\n✨ Create New Page for MPA\n');
      
      rl = createPrompt();
      
      // 1. Page name
      const pageName = await question(rl, '? Page name (kebab-case): ');
      if (!validateKebabCase(pageName.trim())) {
        console.error(`❌ ${getKebabCaseError('Page')}`);
        rl.close();
        process.exit(1);
      }
      
      pageNameKebab = toKebabCase(pageName.trim());
      
      // 2. Page title
      pageTitle = await question(rl, '? Page title: ');
      
      // 3. Page description
      pageDescription = await question(rl, '? Page description: ');
      
      // 4. Page-specific CSS
      const createCss = await question(rl, '? Create page-specific CSS file? (Y/n): ');
      needsCss = !createCss.trim() || createCss.toLowerCase() === 'y';
      
      // 5. Components folder
      const createComponents = await question(rl, '? Create components folder? (Y/n): ');
      needsComponents = !createComponents.trim() || createComponents.toLowerCase() === 'y';
      
      componentName = '';
      if (needsComponents) {
        componentName = await question(rl, '? Initial component name (optional, press Enter to skip): ');
      }
      
      rl.close();
    }
    
    const pageNamePascal = toPascalCase(pageNameKebab);
    
    // Check if page already exists
    const pagePath = path.join(process.cwd(), 'src/pages', pageNameKebab);
    if (fs.existsSync(pagePath)) {
      console.error(`❌ Page "${pageNameKebab}" already exists!`);
      process.exit(1);
    }
    
    console.log('\n📦 Creating page structure...\n');
    
    // Create directory
    fs.mkdirSync(pagePath, { recursive: true });
    console.log(`  ✅ Created src/pages/${pageNameKebab}/`);
    
    // Generate files
    generateIndexHtml(pagePath, pageNameKebab, pageTitle.trim(), pageDescription.trim());
    generateMainTsx(pagePath, pageNameKebab, pageNamePascal);
    generatePageComponent(pagePath, pageNamePascal, pageNameKebab, pageTitle.trim(), needsCss);
    
    if (needsCss) {
      generateCssFile(pagePath, pageNameKebab, pageNamePascal);
    }
    
    if (needsComponents) {
      const componentsPath = path.join(pagePath, 'components');
      fs.mkdirSync(componentsPath, { recursive: true });
      console.log(`  ✅ Created src/pages/${pageNameKebab}/components/`);
      
      if (componentName && componentName.trim()) {
        const compNamePascal = toPascalCase(toKebabCase(componentName.trim()));
        generateComponentFile(componentsPath, compNamePascal);
      }
    }
    
    // Update vite.config.ts
    updateViteConfig(pageNameKebab);
    
    // Generate e2e test
    generateE2eTest(pageNameKebab, pageNamePascal, pageTitle.trim() || pageNamePascal);
    
    // Success message
    console.log('\n🎉 Success! New page created!\n');
    console.log('📍 URLs:');
    console.log(`  Dev:  http://localhost:8080/${pageNameKebab}/`);
    console.log(`  Prod: /${pageNameKebab}/\n`);
    console.log('🚀 Next steps:');
    console.log('  1. npm run dev');
    console.log(`  2. Open http://localhost:8080/${pageNameKebab}/`);
    console.log(`  3. Start coding in src/pages/${pageNameKebab}/${pageNamePascal}.tsx\n`);
    
  } catch (error) {
    console.error('\n❌ Error creating page:', error.message);
    if (rl) rl.close();
    process.exit(1);
  }
}

// Run
createPage();
