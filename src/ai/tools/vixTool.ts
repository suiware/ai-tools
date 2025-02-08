import { tool } from 'ai'
import z from 'zod'
import { getCurrentVIX } from '../../core/utils/vix'

export const vixTool = tool({
  description: 'Get current CBOE Volatility Index (VIX) index value',
  parameters: z.object({}),
  execute: async () => {
    const vixValue = await getCurrentVIX()

    return {
      vixValue,
    }
  },
})
