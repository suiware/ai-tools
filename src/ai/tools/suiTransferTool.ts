import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { SUI_DECIMALS } from '@mysten/sui/utils'
import { tool } from 'ai'
import z from 'zod'
import { getSetting } from '../../core/utils/environment'
import { formatBalance } from '../../core/utils/utils'
import { SuiAccount } from '../../sui/SuiAccount'
import { TSuiNetwork } from '../../sui/types/TSuiNetwork'
import { SuiServerWalletProvider } from '../../sui/wallets/SuiServerWalletProvider'

export const suiTransferTool = tool({
  description: 'Transfer the amount of SUI to the specified address',
  parameters: z.object({
    amount: z.string().describe('The amount of SUI'),
    address: z.string().describe('The target address'),
  }),
  execute: async ({ amount, address }) => {
    const suiClient = new SuiClient({
      url: getFullnodeUrl(getSetting('SUI_NETWORK') as TSuiNetwork),
    })
    const signer = new SuiAccount().parseAccount()
    const walletProvider = new SuiServerWalletProvider(signer, suiClient)

    const txDigest = await walletProvider.nativeTransfer(
      address as `0x{string}`,
      amount
    )

    await walletProvider.waitForTransactionReceipt(txDigest)

    const balance = await walletProvider.getBalance()
    const balanceInSui = formatBalance(balance, SUI_DECIMALS)

    return {
      balance: `${balanceInSui} SUI`,
    }
  },
})
