import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// Library build configuration
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['components/**/*.tsx', 'hooks/**/*.ts', 'types.ts', 'index.ts'],
      exclude: ['**/*.test.ts', '**/*.test.tsx'],
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'HotmicVirtualizer',
      formats: ['es', 'umd'],
      fileName: (format) => `hotmic-virtualizer.${format === 'es' ? 'js' : 'umd.js'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'three', '@react-three/fiber', 'lucide-react'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          three: 'THREE',
          '@react-three/fiber': 'ReactThreeFiber',
          'lucide-react': 'LucideReact',
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
