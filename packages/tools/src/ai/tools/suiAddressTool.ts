import { tool } from 'ai'
import z from 'zod'
import { SuiService } from '../../services/SuiService'

export const suiAddressTool = tool({
  description: 'Get Sui address',
  parameters: z.object({}),
  execute: async () => {
    const suiService = SuiService.getInstance()
    const address = suiService.getAddress()

    return {
      address,
    }
  },
})
