import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { SUI_DECIMALS } from '@mysten/sui/utils'
import { tool } from 'ai'
import z from 'zod'
import { getSetting } from '../../core/utils/environment'
import { formatBalance } from '../../core/utils/utils'
import { SuiService } from '../../sui/services/SuiService'
import { TSuiNetwork } from '../../sui/types/TSuiNetwork'
import { SuiServerWalletProvider } from '../../sui/wallets/SuiServerWalletProvider'

export const suiWalletBalanceTool = tool({
  description: 'Get my Sui Wallet balance',
  parameters: z.object({}),
  execute: async () => {
    const suiClient = new SuiClient({
      url: getFullnodeUrl(getSetting('SUI_NETWORK') as TSuiNetwork),
    })
    const signer = SuiService.parseAccount()
    const walletProvider = new SuiServerWalletProvider(signer, suiClient)

    const balance = await walletProvider.getBalance()
    const balanceInSui = formatBalance(balance, SUI_DECIMALS)

    return {
      balance: `${balanceInSui} SUI`,
    }
  },
})
