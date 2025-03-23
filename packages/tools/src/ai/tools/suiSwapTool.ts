import { tool } from 'ai'
import z from 'zod'
import { disableConsoleLog, enableConsoleLog } from '../../core/utils/utils'
import { NaviService } from '../../services/NaviService'

export const suiSwapTool = tool({
  description: 'Swap coins',
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
    // We need to suppress the Navi's console log messages to prevent polluting the output.
    // See https://github.com/naviprotocol/navi-sdk/issues/82
    const originalConsoleLog = disableConsoleLog()

    const naviService = new NaviService()

    const transactionResult = await naviService.swap(
      sourceToken,
      targetToken,
      amount
    )

    const balances = await naviService.getAllBalances()

    // Get the logs back.
    enableConsoleLog(originalConsoleLog)

    return {
      digest: transactionResult.digest,
      balances,
    }
  },
})
