import { tool } from 'ai'
import z from 'zod'
import { VixService } from '../../sui/services/VixService'

export const vixTool = tool({
  description: 'Get current CBOE Volatility Index (VIX) index value',
  parameters: z.object({}),
  execute: async () => {
    const vixService = new VixService()
    const vixValue = await vixService.getCurrentVix()

    return {
      vixValue,
    }
  },
})
