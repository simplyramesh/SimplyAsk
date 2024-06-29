import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  envDir: './deploy',
  server: {
    open: true,
    port: 3000,
  },
  build: {
    outDir: './build',
    manifest: true,
    minify: true,
    sourcemap: true,
    modulePreload: {
      polyfill: false
    }
  },

  plugins: [
    svgr({
      plugins: ['@svgr/plugin-jsx'],
      include: '**/*.svg?component',
    }),
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    nodePolyfills({
      protocolImports: true,
    }),
  ],
});
