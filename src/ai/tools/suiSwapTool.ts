import { tool } from 'ai'
import { NAVISDKClient } from 'navi-sdk'
import z from 'zod'
import { getSetting } from '../../core/utils/environment'
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
    SuiService.parseAccount()

    // @todo: Check that the private key is set.
    // @todo: Check that it's the mainnet, the only network supported by Navi for USDC.

    const client = new NAVISDKClient({
      privateKeyList: [getSetting('SUI_PRIVATE_KEY') as string],
      networkType: getSetting('SUI_NETWORK') as TSuiNetwork,
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

    return {
      digest: transactionResult.digest,
      balances,
    }
  },
})
