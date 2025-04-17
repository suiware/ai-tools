import { tool } from 'ai'
import z from 'zod'
import { disableConsoleLog, enableConsoleLog } from '../../core/utils/utils'
import { NaviService } from '../../services/NaviService'
import { SuiService } from '../../services/SuiService'
import { SuinsService } from '../../services/SuinsService'

export const suiTransferTool = tool({
  description:
    'Transfer the amount of the specified coin to the specified address',
  parameters: z.object({
    coin: z
      .string()
      .refine((value: string) => NaviService.isSupportedCoin(value), {
        message: 'The coin not supported',
      })
      .describe(
        'The target address. Suins names starting with @ or ending with .sui are supported.'
      ),
    amount: z.number().describe('The amount of SUI'),
    address: z
      .string()
      .refine(
        (value: string) =>
          SuiService.isValidSuiAddress(value) ||
          SuinsService.isValidSuinsName(value),
        { message: 'Invalid Sui address' }
      )
      .describe(
        'The target address. Suins names starting with @ or ending with .sui are supported.'
      ),
  }),
  execute: async ({ coin, amount, address }) => {
    // We need to suppress the Navi's console log messages to prevent polluting the output.
    // See https://github.com/naviprotocol/navi-sdk/issues/82
    const originalConsoleLog = disableConsoleLog()

    const naviService = new NaviService()

    const txDigest = await naviService.transfer(
      coin,
      address as `0x{string}`,
      amount
    )

    // Get the logs back.
    enableConsoleLog(originalConsoleLog)

    return {
      digest: txDigest,
    }
  },
})
