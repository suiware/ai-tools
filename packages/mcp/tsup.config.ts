import { defineConfig } from 'tsup'

export default defineConfig((options) => [
  {
    entry: ['src/index.ts'],
    splitting: true,
    minify: !options.watch,
    format: ['cjs', 'esm'],
    dts: true,
    treeshake: true,
    sourcemap: true,
    clean: true,
    platform: 'node',
    target: 'node20',
  },
  {
    entry: ['src/server.ts'],
    outDir: 'dist',
    splitting: false,
    minify: !options.watch,
    format: ['cjs'],
    treeshake: true,
    sourcemap: false,
    dts: false,
    clean: true,
    platform: 'node',
    target: 'node20',
  },
])
