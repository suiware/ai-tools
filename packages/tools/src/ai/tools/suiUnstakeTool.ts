import { tool } from 'ai'
import z from 'zod'
import { SuiStakingService } from '../../services/SuiStakingService'

export const suiUnstakeTool = tool({
  description: 'Unstake Sui',
  parameters: z.object({}),
  execute: async () => {
    const suiStakingService = new SuiStakingService()

    const digests = await suiStakingService.unstake()

    return { digests }
  },
})
