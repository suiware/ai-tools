import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { SUI_DECIMALS } from '@mysten/sui/utils'
import { tool } from 'ai'
import z from 'zod'
import { formatBalance } from '../../core/utils/utils'
import { SuiAccount } from '../../sui/SuiAccount'
import { SuiServerWalletProvider } from '../../sui/wallets/SuiServerWalletProvider'

// the `tool` helper function ensures correct type inference:
export const suiWalletBalanceTool = tool({
  description: 'Get my Sui Wallet balance',
  parameters: z.object({}),
  execute: async () => {
    const suiClient = new SuiClient({ url: getFullnodeUrl('localnet') })
    const signer = new SuiAccount().parseAccount()
    const walletProvider = new SuiServerWalletProvider(signer, suiClient)

    const balance = await walletProvider.getBalance()
    const balanceInSui = formatBalance(balance, SUI_DECIMALS)

    return {
      balance: `${balanceInSui} SUI`,
    }
  },
})
