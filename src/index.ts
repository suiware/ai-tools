import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { SuiAccount } from './core/sui/SuiAccount'
import { SuiServerWalletProvider } from './core/sui/wallets/SuiServerWalletProvider'

async function main() {
  try {
    const suiClient = new SuiClient({ url: getFullnodeUrl('localnet') })
    const signer = new SuiAccount().parseAccount()
    console.log(signer.getPublicKey().toSuiAddress())
    const walletProvider = new SuiServerWalletProvider(signer, suiClient)

    let balance = await walletProvider.getBalance()
    console.log(`Balance: ${balance}`)

    const recipientAddress =
      '0x'
    const amount = '1'
    const txDigest = await walletProvider.nativeTransfer(
      recipientAddress,
      amount
    )
    console.log(`Transaction successful! Digest: ${txDigest}`)
    // Wait for transaction receipt
    const receipt = await walletProvider.waitForTransactionReceipt(txDigest)
    // console.log('Transaction receipt:', receipt)

    balance = await walletProvider.getBalance()
    console.log(`Balance: ${balance}`)
  } catch (error) {
    console.error('Error performing transfer:', error)
  }
}

main().catch(console.error)
