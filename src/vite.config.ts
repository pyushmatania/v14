import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    // 🚀 Memory optimization for large builds
    chunkSizeWarningLimit: 1000,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // 🚀 Simplified but effective chunking strategy
          if (id.includes('node_modules')) {
            // 🚀 Core React libraries
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            
            // 🚀 UI libraries
            if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('@heroicons')) {
              return 'ui-vendor';
            }
            
            // 🚀 Data libraries
            if (id.includes('@supabase') || id.includes('@tanstack')) {
              return 'data-vendor';
            }
            
            // 🚀 Other vendor libraries
            return 'vendor';
          }
          
          // 🚀 Split source code by major features
          if (id.includes('/src/components/')) {
            if (id.includes('/auth/') || id.includes('Auth')) {
              return 'auth';
            }
            if (id.includes('/admin/') || id.includes('Admin')) {
              return 'admin';
            }
            if (id.includes('/waitlist/') || id.includes('Waitlist')) {
              return 'waitlist';
            }
            if (id.includes('/community/') || id.includes('Community')) {
              return 'community';
            }
            if (id.includes('/profile/') || id.includes('Profile')) {
              return 'profile';
            }
            if (id.includes('Dashboard') || id.includes('Portfolio')) {
              return 'dashboard';
            }
            if (id.includes('Merchandise') || id.includes('Project')) {
              return 'projects';
            }
            if (id.includes('AboutUs') || id.includes('FAQ') || id.includes('Testimonials')) {
              return 'content';
            }
          }
          
          // 🚀 Split utilities and hooks
          if (id.includes('/src/hooks/') || id.includes('/src/utils/')) {
            return 'utils';
          }
          
          // 🚀 Split data and types
          if (id.includes('/src/data/') || id.includes('/src/types/')) {
            return 'data';
          }
          
          // 🚀 Split providers
          if (id.includes('/src/providers/')) {
            return 'providers';
          }
          
          // 🚀 Default case
          return undefined;
        },
        // 🚀 Optimize chunk naming for better caching
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || 'asset';
          // const info = name.split('.');
          // const ext = info[info.length - 1];
          if (/\.(css)$/.test(name)) {
            return `css/[name]-[hash].[ext]`;
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(name)) {
            return `images/[name]-[hash].[ext]`;
          }
          return `assets/[name]-[hash].[ext]`;
        }
      },
      // 🚀 Tree shaking optimization
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
    },
    // 🚀 Target modern browsers for better optimization
    target: 'esnext',
  },
  // 🚀 CSS optimization
  css: {
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('cssnano')({
          preset: ['default', {
            discardComments: { removeAll: true },
            normalizeWhitespace: true,
            colormin: true,
            minifyFontValues: true,
            minifySelectors: true,
          }]
        })
      ]
    }
  }
})
