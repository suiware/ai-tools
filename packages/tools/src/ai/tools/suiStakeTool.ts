import { tool } from 'ai'
import z from 'zod'
import { SuiStakingService } from '../../services/SuiStakingService'

export const suiStakeTool = tool({
  description: 'Stake Sui',
  parameters: z.object({
    amount: z.number().min(1).describe('The amount of SUI to stake'),
  }),
  execute: async ({ amount }) => {
    const suiStakingService = new SuiStakingService()

    const digest = await suiStakingService.stake(amount)

    return { digest }
  },
})
