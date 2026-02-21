import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import { visualizer } from 'rollup-plugin-visualizer';
import { cachedObfuscation } from './scripts/cached-obfuscation-plugin.js';
import viteCompression from 'vite-plugin-compression';

// Custom plugin to flatten HTML output paths
function htmlOutputPlugin(): Plugin {
  return {
    name: 'html-output-plugin',
    generateBundle(_options, bundle) {
      Object.keys(bundle).forEach((fileName) => {
        const file = bundle[fileName];
        if (file.type === 'asset' && fileName.endsWith('.html')) {
          let newFileName = fileName;
          if (fileName.includes('src/pages/index/')) {
            newFileName = 'index.html';
          } else if (fileName.includes('src/pages/page-not-found/')) {
            newFileName = 'page-not-found/index.html';
          }
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
      server.middlewares.use((req, _res, next) => {
        const url = req.url || '';
        const pathname = url.split('?')[0].split('#')[0];

        if (pathname === '/' || pathname === '/index.html') {
          req.url = url.replace(pathname, '/src/pages/index/index.html');
        } else if (pathname === '/page-not-found' || pathname === '/page-not-found/') {
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
    // Base path — override via BASE_URL env var for GitHub Pages sub-path deployments
    base: process.env.BASE_URL ?? '/',

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
      sourcemap: false,
      minify: isProduction ? 'terser' : false,
      target: 'es2020',
      chunkSizeWarningLimit: 500,
      cssCodeSplit: true,

      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'src/pages/index/index.html'),
          'page-not-found': path.resolve(__dirname, 'src/pages/page-not-found/index.html'),
        
        
        
        
        
        
        
        
        
        },
        output: {
          // Smart code splitting - separates vendors for better caching
          manualChunks(id) {
            // React core libraries (changes rarely, cache aggressively)
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'react-vendor';
            }
            // Data fetching library
            if (id.includes('node_modules/@tanstack/react-query')) {
              return 'query-vendor';
            }
            // UI utility libraries
            if (
              id.includes('node_modules/lucide-react') ||
              id.includes('node_modules/react-icons') ||
              id.includes('node_modules/class-variance-authority') ||
              id.includes('node_modules/clsx') ||
              id.includes('node_modules/tailwind-merge') ||
              id.includes('node_modules/tailwind-variants')
            ) {
              return 'ui-vendor';
            }
            // All other node_modules into a general vendor chunk
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },

          // Asset file naming
          assetFileNames: (assetInfo) => {
            if (isProduction) {
              if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name ?? '')) return `static/img/[hash][extname]`;
              if (/\.css$/i.test(assetInfo.name ?? '')) return `static/css/[hash][extname]`;
              if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name ?? '')) return `static/fonts/[hash][extname]`;
              return `static/assets/[hash][extname]`;
            } else {
              if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name ?? '')) return `static/images/[name].[hash][extname]`;
              if (/\.css$/i.test(assetInfo.name ?? '')) return `static/css/[name].[hash][extname]`;
              if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name ?? '')) return `static/fonts/[name].[hash][extname]`;
              return `static/[ext]/[name].[hash][extname]`;
            }
          },

          // JS chunk naming
          chunkFileNames: isProduction ? 'static/js/[hash].js' : 'static/js/[name].[hash].js',
          entryFileNames: isProduction ? 'static/js/[hash].js' : 'static/js/[name].[hash].js',
        },
      },

      // Terser options - Aggressive obfuscation in production
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
          passes: 2,
          unsafe: true,
          unsafe_arrows: true,
          unsafe_comps: true,
          unsafe_math: true,
          unsafe_methods: true,
          booleans_as_integers: false,
        },
        mangle: {
          toplevel: true,
          properties: false,
          keep_classnames: false,
          keep_fnames: false,
        },
        format: {
          comments: false,
          ecma: 2020,
          ascii_only: true,
          beautify: false,
          preamble: '',
        },
        nameCache: {},
      } : undefined,
    },

    // Dependency optimization
    optimizeDeps: {
      include: ['react', 'react-dom', '@tanstack/react-query'],
      exclude: [],
    },

    // Plugins
    plugins: [
      react(),
      devServerMiddleware(),
      htmlOutputPlugin(),

      // Cached JavaScript Obfuscation - ENABLED in production
      ...(isProduction ? [
        cachedObfuscation({
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.75,
          deadCodeInjection: true,
          deadCodeInjectionThreshold: 0.4,
          debugProtection: false,
          debugProtectionInterval: 0,
          disableConsoleOutput: true,
          identifierNamesGenerator: 'hexadecimal',
          identifiersPrefix: '',
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
          splitStrings: true,
          splitStringsChunkLength: 10,
          transformObjectKeys: true,
          renameGlobals: false,
          selfDefending: false,
          simplify: true,
          unicodeEscapeSequence: false,
          log: false,
          seed: 0,
          reservedStrings: ['@/', '\\./', 'components', 'pages', '/src/'],
        }),
      ] : []),

      // Brotli + gzip compression for production assets
      ...(isProduction ? [
        viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
        viteCompression({ algorithm: 'gzip', ext: '.gz' }),
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
        generateScopedName: isProduction
          ? '[hash:base64:8]'
          : '[name]__[local]__[hash:base64:5]',
      },
      postcss: './postcss.config.js',
      devSourcemap: false,
    },

    // Define environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },

    // Performance optimizations
    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : [],
      legalComments: 'none',
      treeShaking: true,
    },
  };
})
