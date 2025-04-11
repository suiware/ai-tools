import { tool } from 'ai'
import z from 'zod'
import { NaviService } from '../../services/NaviService'
import { SuiService } from '../../services/SuiService'
import { SuinsService } from '../../services/SuinsService'

export const suiTransferTool = tool({
  description:
    'Transfer the amount of the specified coin to the specified address',
  parameters: z.object({
    coin: z
      .string()
      .refine((value: string) => NaviService.isSupportedToken(value), {
        message: 'Coin not supported',
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
    const suiService = SuiService.getInstance()
    const naviService = new NaviService()

    let resolvedAddress: string | null = address
    // If it's a Suins name, try to resolve it a Sui address.
    if (SuinsService.isValidSuinsName(address)) {
      const suinsService = new SuinsService(suiService.getSuiClient())
      resolvedAddress = await suinsService.resolveSuinsName(address)
      if (!resolvedAddress) {
        throw new Error(`Suins name ${address} not found`)
      }
    }

    console.log(coin, amount, address)
    return

    const txDigest = await naviService.transfer(
      coin,
      resolvedAddress as `0x{string}`,
      amount
    )

    console.log(txDigest)

    const balances = await naviService.getAllBalances()

    return {
      digest: txDigest,
      balances,
    }
  },
})
