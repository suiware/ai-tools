import { SUI_DECIMALS } from '@mysten/sui/utils'
import { tool } from 'ai'
import z from 'zod'
import { formatBalance } from '../../core/utils/utils'
import { SuiService } from '../../services/SuiService'
import { SuinsService } from '../../services/SuinsService'

export const suiTransferTool = tool({
  description: 'Transfer the amount of SUI to the specified address',
  parameters: z.object({
    amount: z.number().describe('The amount of SUI'),
    address: z
      .string()
      .refine(
        (value: string) =>
          SuiService.isValidSuiAddress(value) ||
          SuinsService.isValidSuinsName(value),
        { message: 'Invalid Sui address' }
      )
      .describe('The target address'),
  }),
  execute: async ({ amount, address }) => {
    return console.log('address valid')

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
