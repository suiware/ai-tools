import { SUI_DECIMALS } from '@mysten/sui/utils'
import { tool } from 'ai'
import z from 'zod'
import { formatBalance } from '../../core/utils/utils'
import { SuiService } from '../../sui/services/SuiService'

export const suiTransferTool = tool({
  description: 'Transfer the amount of SUI to the specified address',
  parameters: z.object({
    amount: z.number().describe('The amount of SUI'),
    address: z
      .string()
      .refine(SuiService.isValidSuiAddress, { message: 'Invalid Sui address' })
      .describe('The target address'),
  }),
  execute: async ({ amount, address }) => {
    const suiService = new SuiService()

    const txDigest = await suiService.nativeTransfer(
      address as `0x{string}`,
      amount
    )

    await suiService.waitForTransactionReceipt(txDigest)

    const balance = await suiService.getBalance()
    const balanceInSui = formatBalance(balance, SUI_DECIMALS)

    return {
      digest: txDigest,
      balance: balanceInSui,
    }
  },
})
