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
      .describe(
        'The target address. Suins names starting with @ or ending with .sui are supported.'
      ),
  }),
  execute: async ({ amount, address }) => {
    const suiService = SuiService.getInstance()

    // @todo: Check if the sui settings are correct.

    let resolvedAddress: string | null = address

    // If it's a Suins name, try to resolve it a Sui address.
    if (SuinsService.isValidSuinsName(address)) {
      const suinsService = new SuinsService(suiService.getSuiClient())
      resolvedAddress = await suinsService.resolveSuinsName(address)
      if (!resolvedAddress) {
        throw new Error(`Suins name ${address} not found`)
      }
    }

    const txDigest = await suiService.nativeTransfer(
      resolvedAddress as `0x{string}`,
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
