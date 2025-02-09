import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entryPoints: [
    'src/index.ts',
    'src/ai/tools/suiSwapTool.ts',
    'src/ai/tools/suiTransferTool.ts',
    'src/ai/tools/suiWalletBalanceTool.ts',
    'src/ai/tools/vixTool.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  treeshake: true,
  ...options,
}))
