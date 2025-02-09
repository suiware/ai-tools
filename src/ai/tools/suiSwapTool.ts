import { tool } from 'ai'
import { NAVISDKClient } from 'navi-sdk'
import z from 'zod'
import { getSetting } from '../../core/utils/environment'
import { disableConsoleLog, enableConsoleLog } from '../../core/utils/utils'
import { NaviService } from '../../sui/services/NaviService'
import { SuiService } from '../../sui/services/SuiService'
import { TSuiNetwork } from '../../sui/types/TSuiNetwork'

export const suiSwapTool = tool({
  description: 'Swap SUI to USDC or vice versa',
  parameters: z.object({
    amount: z.string().describe('The amount of source token to swap'),
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
    const privateKey = getSetting('SUI_PRIVATE_KEY') as string
    SuiService.isValidPrivateKey(privateKey)

    const suiNetwork = getSetting('SUI_NETWORK') as TSuiNetwork
    if (suiNetwork !== 'mainnet') {
      throw new Error('Only mainnet is supported for USDC swaps')
    }

    // We need to suppress the Navi's console log messages not to pollute the output.
    // See https://github.com/naviprotocol/navi-sdk/issues/82
    const originalConsoleLog = disableConsoleLog()

    const client = new NAVISDKClient({
      privateKeyList: [privateKey],
      networkType: suiNetwork,
    })

    const account = client.accounts[0]

    const sourceTokenMetadata = NaviService.getSwappableToken(sourceToken)
    const targetTokenMetadata = NaviService.getSwappableToken(targetToken)

    const amountIn = parseFloat(amount) * 10 ** sourceTokenMetadata!.decimal
    const minAmountOut = 0.8 * 10 ** targetTokenMetadata!.decimal

    const transactionResult = await account.swap(
      sourceTokenMetadata!.address,
      targetTokenMetadata!.address,
      amountIn,
      minAmountOut
    )

    const balances = await NaviService.getAllBalances(client)

    // Get logs back.
    enableConsoleLog(originalConsoleLog)

    return {
      digest: transactionResult.digest,
      balances,
    }
  },
})
