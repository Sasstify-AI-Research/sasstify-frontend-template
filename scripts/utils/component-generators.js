/**
 * Shared code generators for components
 */

import fs from 'fs';
import path from 'path';

/**
 * Generate component file based on type
 * @param {string} componentPath - Component directory path
 * @param {string} componentNamePascal - Component name in PascalCase
 * @param {string} componentDescription - Component description
 * @param {boolean} withCss - Whether to include CSS module
 * @param {string} componentType - Component type ('regular', 'ui', 'block')
 * @returns {string} Created filename
 */
export function generateComponentFile(componentPath, componentNamePascal, componentDescription, withCss, componentType) {
  const cssImport = withCss ? `import styles from './${componentNamePascal}.module.css';\n` : '';
  
  let content;
  let typeLabel;
  
  if (componentType === 'block') {
    typeLabel = 'block component';
    content = `import React from 'react';
import { ${componentNamePascal}Props } from './${componentNamePascal}.types';
${cssImport}
// Import UI components that this block composes
// import Button from '@/components/ui/button/Button';
// import Input from '@/components/ui/input/Input';

/**
 * ${componentDescription || `${componentNamePascal} ${typeLabel}`}
 */
const ${componentNamePascal}: React.FC<${componentNamePascal}Props> = ({ children, className = '' }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default ${componentNamePascal};
`;
  } else if (componentType === 'ui') {
    typeLabel = 'UI component';
    content = `import React from 'react';
import { ${componentNamePascal}Props } from './${componentNamePascal}.types';
${cssImport}
/**
 * ${componentDescription || `${componentNamePascal} ${typeLabel}`}
 */
const ${componentNamePascal}: React.FC<${componentNamePascal}Props> = ({ children, className = '' }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default ${componentNamePascal};
`;
  } else {
    typeLabel = 'component';
    content = `import React from 'react';
import { ${componentNamePascal}Props } from './${componentNamePascal}.types';
${cssImport}
/**
 * ${componentDescription || `${componentNamePascal} ${typeLabel}`}
 */
const ${componentNamePascal}: React.FC<${componentNamePascal}Props> = ({ children, className = '' }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default ${componentNamePascal};
`;
  }
  
  fs.writeFileSync(path.join(componentPath, `${componentNamePascal}.tsx`), content);
  return `${componentNamePascal}.tsx`;
}

/**
 * Generate types file based on component type
 * @param {string} componentPath - Component directory path
 * @param {string} componentNamePascal - Component name in PascalCase
 * @param {string} componentDescription - Component description
 * @param {string} componentType - Component type ('regular', 'ui', 'block')
 * @returns {string} Created filename
 */
export function generateTypesFile(componentPath, componentNamePascal, componentDescription, componentType) {
  let typeLabel;
  
  if (componentType === 'block') {
    typeLabel = 'Block Component Types';
  } else if (componentType === 'ui') {
    typeLabel = 'UI Component Types';
  } else {
    typeLabel = 'Component Types';
  }
  
  const content = `/**
 * ${componentNamePascal} ${typeLabel}
 * ${componentDescription || ''}
 */

import { ReactNode } from 'react';

export interface ${componentNamePascal}Props {
  /**
   * Child elements to render inside the component
   */
  children?: ReactNode;
  
  /**
   * Additional CSS classes to apply
   */
  className?: string;
}
`;
  
  fs.writeFileSync(path.join(componentPath, `${componentNamePascal}.types.ts`), content);
  return `${componentNamePascal}.types.ts`;
}

/**
 * Generate test file based on component type
 * @param {string} testPath - Test directory path
 * @param {string} componentNamePascal - Component name in PascalCase
 * @param {string} componentNameKebab - Component name in kebab-case
 * @param {string} componentType - Component type ('regular', 'ui', 'block')
 * @returns {string} Created filename
 */
export function generateTestFile(testPath, componentNamePascal, componentNameKebab, componentType) {
  let importPath;
  
  if (componentType === 'block') {
    importPath = `@/components/blocks/${componentNameKebab}/${componentNamePascal}`;
  } else if (componentType === 'ui') {
    importPath = `@/components/ui/${componentNameKebab}/${componentNamePascal}`;
  } else {
    importPath = `@/components/${componentNameKebab}/${componentNamePascal}`;
  }
  
  const content = `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ${componentNamePascal} from '${importPath}';

describe('${componentNamePascal}', () => {
  it('renders without crashing', () => {
    render(<${componentNamePascal} />);
  });

  it('renders children correctly', () => {
    render(<${componentNamePascal}>Test Content</${componentNamePascal}>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<${componentNamePascal} className="custom-class">Content</${componentNamePascal}>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
`;
  
  fs.writeFileSync(path.join(testPath, `${componentNamePascal}.test.tsx`), content);
  return `${componentNamePascal}.test.tsx`;
}

