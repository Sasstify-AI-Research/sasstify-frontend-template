import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import { visualizer } from 'rollup-plugin-visualizer';
import { cachedObfuscation } from './scripts/cached-obfuscation-plugin.js';

// Custom plugin to flatten HTML output paths
function htmlOutputPlugin(): Plugin {
  return {
    name: 'html-output-plugin',
    generateBundle(_options, bundle) {
      // Rename HTML files to flatten the directory structure
      Object.keys(bundle).forEach((fileName) => {
        const file = bundle[fileName];

        if (file.type === 'asset' && fileName.endsWith('.html')) {
          let newFileName = fileName;

          // Transform src/pages/index/index.html -> index.html
          if (fileName.includes('src/pages/index/')) {
            newFileName = 'index.html';
          }
          // Transform src/pages/dashboard/index.html -> dashboard/index.html
          else if (fileName.includes('src/pages/dashboard/')) {
            newFileName = 'dashboard/index.html';
          }

          // Rename the file in the bundle
          if (newFileName !== fileName) {
            delete bundle[fileName];
            bundle[newFileName] = file;
            file.fileName = newFileName;
          }
        }
      });
    }
  };
}

// Custom middleware for dev server URL rewriting
function devServerMiddleware(): Plugin {
  return {
    name: 'dev-server-middleware',
    configureServer(server) {
      // Register middleware to run BEFORE Vite's internal middlewares
      server.middlewares.use((req, _res, next) => {
        const url = req.url || '';

        // Extract path without query params and hash
        const pathname = url.split('?')[0].split('#')[0];

        // Rewrite URLs for dev server to match source directory structure
        if (pathname === '/' || pathname === '/index.html') {
          req.url = url.replace(pathname, '/src/pages/index/index.html');
        } else if (pathname === '/dashboard' || pathname === '/dashboard/') {
          req.url = url.replace(pathname, '/src/pages/dashboard/index.html');
        } else if (pathname === '/dashboard/index.html') {
          req.url = url.replace(pathname, '/src/pages/dashboard/index.html');
        }
        

        // Page Not Found page
        else if (pathname === '/page-not-found' || pathname === '/page-not-found/') {
          req.url = url.replace(pathname, '/src/pages/page-not-found/index.html');
        } else if (pathname === '/page-not-found/index.html') {
          req.url = url.replace(pathname, '/src/pages/page-not-found/index.html');
        }
        
        // Add more page rewrites here as needed for new pages

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    // Development server configuration
    server: {
      host: "::",
      port: 8080,
      open: false,
    },

    // Preview server configuration (for testing production builds)
    preview: {
      host: "::",
      port: 8080,
    },

    // Build configuration
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: false, // Never generate sourcemaps for obfuscated builds
      minify: isProduction ? 'terser' : false, // Use terser for better obfuscation

      // Target modern browsers for better optimization
      target: 'es2020',

      // Chunk size warnings
      chunkSizeWarningLimit: 500,

      // CSS code splitting
      cssCodeSplit: true,

      // Rollup options for Multi-Page Application
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'src/pages/index/index.html'),
          dashboard: path.resolve(__dirname, 'src/pages/dashboard/index.html'),        
          'page-not-found': path.resolve(__dirname, 'src/pages/page-not-found/index.html'),
        },
        output: {
          // Smart code splitting - separates vendors for better caching
          manualChunks(id) {
            // React core libraries (changes rarely, cache aggressively)
            if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/')) {
              return 'react-vendor';
            }

            // Data fetching library
            if (id.includes('node_modules/@tanstack/react-query')) {
              return 'query-vendor';
            }

            // UI utility libraries
            if (id.includes('node_modules/lucide-react') ||
              id.includes('node_modules/react-icons') ||
              id.includes('node_modules/class-variance-authority') ||
              id.includes('node_modules/clsx') ||
              id.includes('node_modules/tailwind-merge') ||
              id.includes('node_modules/tailwind-variants')) {
              return 'ui-vendor';
            }

            // All other node_modules into a general vendor chunk
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },

          // Asset file naming - Obfuscated in production
          assetFileNames: (assetInfo) => {
            if (isProduction) {
              // In production, use only hash for complete obfuscation
              if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name ?? '')) {
                return `static/img/[hash][extname]`;
              }
              if (/\.css$/i.test(assetInfo.name ?? '')) {
                return `static/css/[hash][extname]`;
              }
              if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name ?? '')) {
                return `static/fonts/[hash][extname]`;
              }
              return `static/assets/[hash][extname]`;
            } else {
              // Development: keep readable names
              if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name ?? '')) {
                return `static/images/[name].[hash][extname]`;
              }
              if (/\.css$/i.test(assetInfo.name ?? '')) {
                return `static/css/[name].[hash][extname]`;
              }
              if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name ?? '')) {
                return `static/fonts/[name].[hash][extname]`;
              }
              return `static/[ext]/[name].[hash][extname]`;
            }
          },

          // JS chunk naming - Obfuscated in production
          chunkFileNames: isProduction ? 'static/js/[hash].js' : 'static/js/[name].[hash].js',
          entryFileNames: isProduction ? 'static/js/[hash].js' : 'static/js/[name].[hash].js',
        },
      },

      // Terser options - Aggressive obfuscation in production
      terserOptions: isProduction ? {
        compress: {
          drop_console: true, // Remove all console statements
          drop_debugger: true, // Remove debugger statements
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
          passes: 2, // Multiple compression passes for better minification
          unsafe: true, // Enable unsafe transformations for smaller output
          unsafe_arrows: true, // Convert arrow functions
          unsafe_comps: true, // Compress comparisons
          unsafe_math: true, // Optimize math operations
          unsafe_methods: true, // Optimize method calls
          booleans_as_integers: false, // Keep booleans as true/false (prevents React rendering "0")
        },
        mangle: {
          toplevel: true, // Mangle top-level variable names
          properties: false, // Don't mangle properties (can break code)
          keep_classnames: false, // Mangle class names
          keep_fnames: false, // Mangle function names
        },
        format: {
          comments: false, // Remove all comments
          ecma: 2020, // Use modern JS for smaller output
          ascii_only: true, // Escape unicode characters
          beautify: false, // No formatting
          preamble: '', // No preamble comment
        },
        nameCache: {}, // Enable name cache for consistent mangling
      } : undefined,
    },

    // Dependency optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@tanstack/react-query',
      ],
      exclude: [],
    },

    // Plugins
    plugins: [
      // React plugin with Fast Refresh
      react(),

      // Dev server middleware for URL rewriting
      devServerMiddleware(),

      // Custom plugin to flatten HTML output paths (production build)
      htmlOutputPlugin(),

      // Cached JavaScript Obfuscation - ENABLED
      // 
      // Uses intelligent caching to achieve BOTH obfuscation AND cache efficiency:
      // - First build: Obfuscates all code
      // - Subsequent builds: Reuses cached obfuscated code for unchanged files
      // - Changed files: Re-obfuscates and updates cache
      //
      // Benefits:
      // ✅ 100% obfuscation coverage (all code obfuscated, including old code)
      // ✅ 100% hash stability (unchanged files reuse exact cached output)
      // ✅ ~95% cache efficiency (only re-obfuscate what changed)
      // ✅ Maximum security (aggressive obfuscation settings enabled)
      //
      // Result: Best of both worlds - full security with optimal performance!
      ...(isProduction ? [
        cachedObfuscation({
          // Maximum obfuscation settings (aggressive)
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.75,
          deadCodeInjection: true,
          deadCodeInjectionThreshold: 0.4,
          debugProtection: false, // Keep disabled (causes issues)
          debugProtectionInterval: 0,
          disableConsoleOutput: true,
          
          // Identifier obfuscation
          identifierNamesGenerator: 'hexadecimal',
          identifiersPrefix: '',
          
          // String transformations (ALL ENABLED for maximum security)
          stringArray: true,
          stringArrayCallsTransform: true,
          stringArrayCallsTransformThreshold: 0.75,
          stringArrayEncoding: ['base64'],
          stringArrayIndexShift: true,
          stringArrayRotate: true,
          stringArrayShuffle: true,
          stringArrayWrappersCount: 2,
          stringArrayWrappersChainedCalls: true,
          stringArrayWrappersParametersMaxCount: 4,
          stringArrayWrappersType: 'function',
          stringArrayThreshold: 0.75,
          
          // Additional transforms
          splitStrings: true,
          splitStringsChunkLength: 10,
          transformObjectKeys: true,
          
          // Keep these disabled (cause runtime issues)
          renameGlobals: false,
          selfDefending: false,
          
          // Other settings
          simplify: true,
          unicodeEscapeSequence: false,
          log: false,
          seed: 0, // Fixed seed for consistency within same source
          
          // Reserved strings for imports (don't obfuscate these patterns)
          reservedStrings: [
            '@/',
            '\\./',
            'components',
            'pages',
            '/src/',
          ],
        }),
      ] : []),

      // Bundle analyzer (only in production when enabled)
      ...(isProduction && process.env.ANALYZE === 'true' ? [
        visualizer({
          filename: './dist/stats.html',
          open: true,
          gzipSize: true,
          brotliSize: true,
        })
      ] : []),
    ],

    // Path resolution
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },

    // CSS configuration
    css: {
      modules: {
        localsConvention: 'camelCase',
        // Obfuscate CSS class names in production
        generateScopedName: isProduction
          ? '[hash:base64:8]' // Production: 8-char hash only
          : '[name]__[local]__[hash:base64:5]', // Dev: readable names
      },
      postcss: './postcss.config.js',
      devSourcemap: false, // Never generate CSS sourcemaps for security
    },

    // Define environment variables
    // Note: Only use static/deterministic values to ensure content-based hashing works
    // Using dynamic values like timestamps will cause all bundles to get new hashes on every build
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      // __BUILD_TIME__ removed - was causing hash changes on every build
      // Use __APP_VERSION__ or git commit hash if you need build tracking
    },

    // Performance optimizations
    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : [],
      legalComments: 'none',
      treeShaking: true,
    },
  };
})
