# Build Configuration Reference

Complete reference for all build configuration options in `vite.config.ts`.

---

## Table of Contents

**Quick Navigation** - Jump to the section you need:

### ⚙️ Core Settings
- [Core Configuration](#core-configuration) - Base build options
- [Entry Points](#entry-points) - Multi-page configuration
- [Output Configuration](#output-configuration) - Asset file naming

### 📦 Code & Assets
- [Code Splitting](#code-splitting) - Manual chunks strategy
- [Terser Options](#terser-options) - Minification settings
- [CSS Configuration](#css-configuration) - CSS modules & PostCSS

### 🔌 Plugins & Tools
- [TypeScript Configuration](#typescript-configuration) - esbuild settings
- [Plugins](#plugins) - Obfuscation & React plugins
- [Environment Variables](#environment-variables) - Define constants

### 🌐 Servers & Paths
- [Server Configuration](#server-configuration) - Dev server settings
- [Preview Server](#preview-server) - Preview configuration
- [Resolve Configuration](#resolve-configuration) - Path aliases

### 📝 Reference
- [Complete Example](#complete-example) - Full config file
- [Related Documentation](#related-documentation) - Additional resources

---

## Core Configuration

### Build Options

```typescript
export default defineConfig({
  build: {
    outDir: 'dist',                      // Output directory
    assetsDir: 'static',                 // Assets subdirectory
    sourcemap: false,                    // No source maps (security)
    minify: 'terser',                    // Advanced minification
    target: 'es2020',                    // Modern browsers
    chunkSizeWarningLimit: 500,          // Warn if chunk > 500KB
    cssCodeSplit: true,                  // Split CSS per page
  }
});
```

---

## Entry Points

### Multi-Page Configuration

```typescript
build: {
  rollupOptions: {
    input: {
      main: resolve(__dirname, 'src/pages/index/index.html'),
      dashboard: resolve(__dirname, 'src/pages/dashboard/index.html'),
      profile: resolve(__dirname, 'src/pages/profile/index.html'),
      page: resolve(__dirname, 'src/pages/page/index.html'),
    }
  }
}
```

**Adding New Pages:**
```typescript
// Add to input object
newpage: resolve(__dirname, 'src/pages/newpage/index.html')
```

---

## Output Configuration

### Asset File Names

```typescript
build: {
  rollupOptions: {
    output: {
      // CSS and other assets
      assetFileNames: 'static/[ext]/[hash][extname]',
      
      // Code-split chunks
      chunkFileNames: 'static/js/[hash].js',
      
      // Entry point bundles
      entryFileNames: 'static/js/[hash].js'
    }
  }
}
```

---

## Code Splitting

### Manual Chunks

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: (id) => {
        if (id.includes('node_modules')) {
          // TanStack Query
          if (id.includes('@tanstack/react-query')) {
            return 'query-vendor';
          }
          
          // React core
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          
          // UI utilities
          if (id.includes('lucide-react') || id.includes('clsx')) {
            return 'ui-vendor';
          }
          
          // Other dependencies
          return 'vendor';
        }
      }
    }
  }
}
```

---

## Terser Options

### Minification Settings

```typescript
build: {
  terserOptions: {
    compress: {
      drop_console: true,              // Remove console statements
      drop_debugger: true,             // Remove debugger statements
      passes: 2,                       // Two-pass compression
      pure_funcs: [
        'console.log',
        'console.info',
        'console.debug'
      ]
    },
    mangle: {
      safari10: true,                  // Safari 10+ compatibility
      toplevel: true                   // Mangle top-level names
    },
    format: {
      comments: false                  // Remove all comments
    }
  }
}
```

---

## CSS Configuration

### CSS Modules

```typescript
css: {
  modules: {
    generateScopedName: isProduction 
      ? '[hash:8]'                     // Production: hash only
      : '[name]__[local]__[hash:5]'    // Development: readable
  }
}
```

### PostCSS

```typescript
css: {
  postcss: {
    plugins: [
      tailwindcss,
      autoprefixer,
    ]
  }
}
```

---

## TypeScript Configuration

### esbuild Settings

```typescript
esbuild: {
  target: 'es2020',
  logOverride: {
    'this-is-undefined-in-esm': 'silent'
  }
}
```

---

## Plugins

### Cached Obfuscation

```typescript
plugins: [
  ...(isProduction ? [
    cachedObfuscation({
      compact: true,
      controlFlowFlattening: true,
      stringArray: true,
      // ... see docs/scripts/obfuscation/ for complete config
    })
  ] : [])
]
```

### React Plugin

```typescript
plugins: [
  react({
    babel: {
      plugins: [
        // Add Babel plugins if needed
      ]
    }
  })
]
```

---

## Environment Variables

### Define Constants

```typescript
define: {
  __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  // Note: __BUILD_TIME__ removed for hash stability
}
```

---

## Server Configuration

### Development Server

```typescript
server: {
  port: 3000,
  open: true,
  cors: true,
  hmr: {
    overlay: true
  }
}
```

---

## Preview Server

```typescript
preview: {
  port: 4173,
  open: true
}
```

---

## Resolve Configuration

### Path Aliases

```typescript
resolve: {
  alias: {
    '@': resolve(__dirname, './src'),
    '@components': resolve(__dirname, './src/components'),
    '@hooks': resolve(__dirname, './src/hooks'),
    '@utils': resolve(__dirname, './src/utils'),
  }
}
```

---

## Complete Example

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { cachedObfuscation } from './scripts/cached-obfuscation-plugin';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [
    react(),
    ...(isProduction ? [cachedObfuscation({
      // Obfuscation settings
    })] : [])
  ],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    }
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    sourcemap: false,
    minify: 'terser',
    target: 'es2020',
    
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/pages/index/index.html'),
        dashboard: resolve(__dirname, 'src/pages/dashboard/index.html'),
      },
      output: {
        assetFileNames: 'static/[ext]/[hash][extname]',
        chunkFileNames: 'static/js/[hash].js',
        entryFileNames: 'static/js/[hash].js',
        manualChunks: (id) => {
          // Vendor splitting logic
        }
      }
    },
    
    terserOptions: {
      compress: {
        drop_console: true,
        passes: 2
      }
    }
  },
  
  css: {
    modules: {
      generateScopedName: isProduction 
        ? '[hash:8]' 
        : '[name]__[local]__[hash:5]'
    }
  },
  
  esbuild: {
    target: 'es2020'
  }
});
```

---

## Related Documentation

- **[Vite Build Phase](./vite-build-phase.md)** - How configuration is used
- **[Obfuscation Documentation](../scripts/obfuscation/README.md)** - Obfuscation plugin settings
- **[Performance](./performance.md)** - Performance optimization

---

**Last Updated:** November 2025
