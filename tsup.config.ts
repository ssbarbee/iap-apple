import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  target: 'node22',
  outDir: 'dist',
  splitting: false,
  sourcemap: false,
});
