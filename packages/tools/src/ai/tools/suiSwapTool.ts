import { tool } from 'ai'
import z from 'zod'
import { NaviService } from '../../services/NaviService'

export const suiSwapTool = tool({
  description: 'Swap SUI for USDC or vice versa',
  parameters: z.object({
    amount: z.number().describe('The amount of source token to swap'),
    sourceToken: z
      .string()
      .refine((arg: string) => NaviService.isSwappableToken(arg), {
        message: 'The source token not supported',
      })
      .describe('The source token'),
    targetToken: z
      .string()
      .refine((arg: string) => NaviService.isSwappableToken(arg), {
        message: 'The target token not supported',
      })
      .describe('The target token'),
  }),
  execute: async ({ amount, sourceToken, targetToken }) => {
    const naviService = new NaviService()

    const transactionResult = await naviService.swap(
      sourceToken,
      targetToken,
      amount
    )

    const balances = await naviService.getAllBalances()

    return {
      digest: transactionResult.digest,
      balances,
    }
  },
})
