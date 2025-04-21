import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entryPoints: [
    'src/index.ts',
    'src/ai/tools/suiAddressTool.ts',
    'src/ai/tools/suiSwapTool.ts',
    'src/ai/tools/suiTransferTool.ts',
    'src/ai/tools/suiWalletBalanceTool.ts',
    'src/ai/tools/suiStakeTool.ts',
    'src/ai/tools/suiUnstakeTool.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  ...options,
}))
