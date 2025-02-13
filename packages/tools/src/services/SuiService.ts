import {
  getFullnodeUrl,
  SuiClient,
  SuiTransactionBlockResponse,
} from '@mysten/sui/client'
import { Signer } from '@mysten/sui/cryptography'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1'
import { Secp256r1Keypair } from '@mysten/sui/keypairs/secp256r1'
import { Transaction } from '@mysten/sui/transactions'
import { isValidSuiAddress } from '@mysten/sui/utils'
import { getSetting } from '../core/utils/environment'
import { TSuiNetwork } from '../types/TSuiNetwork'

export class SuiService {
  private signer: Signer
  private client: SuiClient

  constructor() {
    this.signer = this.parseAccount()

    this.client = new SuiClient({
      url: getFullnodeUrl(getSetting('SUI_NETWORK') as TSuiNetwork),
    })
  }

  /**
   * Execute a transaction.
   *
   * @param transaction - The transaction block to execute.
   * @returns The transaction response.
   */
  public async executeTransaction(
    transaction: Transaction
  ): Promise<SuiTransactionBlockResponse> {
    if (!this.signer) {
      throw new Error('Signer not found')
    }

    return this.client.signAndExecuteTransaction({
      transaction,
      signer: this.signer,
    })
  }

  /**
   * Get the address of the wallet.
   *
   * @returns The address of the wallet.
   */
  public getAddress(): string {
    return this.signer.toSuiAddress()
  }

  /**
   * Gets the balance of the wallet.
   *
   * @returns The balance of the wallet in MIST (smallest Sui unit).
   */
  public async getBalance(): Promise<bigint> {
    const address = this.getAddress()
    if (!address) {
      throw new Error('Address not found')
    }

    const balance = await this.client.getBalance({
      owner: address,
    })

    return BigInt(balance.totalBalance)
  }

  /**
   * Waits for a transaction receipt.
   *
   * @param digest - The digest of the transaction to wait for.
   * @returns The transaction receipt.
   */
  public async waitForTransactionReceipt(
    digest: string
  ): Promise<SuiTransactionBlockResponse> {
    return this.client.waitForTransaction({
      digest,
      options: {
        // showEvents: true,
        // showEffects: true,
      },
    })
  }

  /**
   * Transfer the given amount of SUI to the given address.
   *
   * @param to - The destination address.
   * @param value - The amount to transfer in whole SUI units
   * @returns The transaction digest.
   */
  public async nativeTransfer(
    to: `0x${string}`,
    value: string | number
  ): Promise<`0x${string}`> {
    // Convert whole SUI units to MIST (1 SUI = 1e9 MIST)
    const amountInMist =
      (typeof value === 'string' ? parseFloat(value) : value) * 1e9

    const tx = new Transaction()

    // first, split the gas coin into multiple coins
    const [coin] = tx.splitCoins(tx.gas, [amountInMist])

    tx.transferObjects([coin], to)

    const response = await this.executeTransaction(tx)

    if (!response.digest) {
      throw new Error('Transaction failed')
    }

    return response.digest as `0x${string}`
  }

  public static isValidPrivateKey(privateKey: string | null) {
    return privateKey && privateKey.startsWith('suiprivkey')
  }

  public static isValidSuiAddress(address: string) {
    return isValidSuiAddress(address)
  }

  private parseAccount(): Signer {
    const privateKey = getSetting('SUI_PRIVATE_KEY')

    if (!SuiService.isValidPrivateKey(privateKey)) {
      throw new Error('Invalid SUI_PRIVATE_KEY in the config')
    }

    return this.loadFromSecretKey(privateKey!)
  }

  private loadFromSecretKey(privateKey: string) {
    const keypairClasses = [Ed25519Keypair, Secp256k1Keypair, Secp256r1Keypair]
    for (const KeypairClass of keypairClasses) {
      try {
        return KeypairClass.fromSecretKey(privateKey)
      } catch {}
    }
    throw new Error('Failed to initialize keypair from secret key')
  }
}
