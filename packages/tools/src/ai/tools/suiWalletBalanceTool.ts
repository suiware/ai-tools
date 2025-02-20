import { SUI_DECIMALS } from '@mysten/sui/utils'
import { tool } from 'ai'
import z from 'zod'
import { formatBalance } from '../../core/utils/utils'
import { SuiService } from '../../services/SuiService'

export const suiWalletBalanceTool = tool({
  description: 'Get my Sui Wallet balance',
  parameters: z.object({}),
  execute: async () => {
    const suiService = SuiService.getInstance()

    // @todo: Check if the sui settings are correct.

    const balance = await suiService.getBalance()
    const balanceInSui = formatBalance(balance, SUI_DECIMALS)

    return {
      balance: balanceInSui,
    }
  },
})
