import { tool } from 'ai'
import z from 'zod'
import { disableConsoleLog, enableConsoleLog } from '../../core/utils/utils'
import { NaviService } from '../../services/NaviService'

export const suiSwapTool = tool({
  description: 'Swap coins',
  parameters: z.object({
    amount: z.number().describe('The amount of source coin to swap'),
    sourceCoin: z
      .string()
      .refine((arg: string) => NaviService.isSupportedCoin(arg), {
        message: 'The source coin not supported',
      })
      .describe('The source coin'),
    targetCoin: z
      .string()
      .refine((arg: string) => NaviService.isSupportedCoin(arg), {
        message: 'The target coin not supported',
      })
      .describe('The target coin'),
  }),
  execute: async ({ amount, sourceCoin, targetCoin }) => {
    // We need to suppress the Navi's console log messages to prevent polluting the output.
    // See https://github.com/naviprotocol/navi-sdk/issues/82
    const originalConsoleLog = disableConsoleLog()

    const naviService = new NaviService()

    const transactionResult = await naviService.swap(
      sourceCoin,
      targetCoin,
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
