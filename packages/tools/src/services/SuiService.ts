import {
  CoinMetadata,
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
import { getSetting, saveSettings } from '../core/utils/environment'
import { TSuiNetwork } from '../types/TSuiNetwork'

export class SuiService {
  private static instance: SuiService

  private network: TSuiNetwork | undefined
  private privateKey: string | undefined
  private signer: Signer
  private client: SuiClient
  private coinInfoMap: Map<string, CoinMetadata> = new Map<
    string,
    CoinMetadata
  >()

  private constructor() {
    this.readAndValidateConfig()

    const network = this.getNetwork()
    const privateKey = this.getPrivateKey()

    this.signer = this.getSignerFromPrivateKey(privateKey!)

    this.client = new SuiClient({
      url: getFullnodeUrl(network!),
    })
  }

  // Singleton.
  public static getInstance(): SuiService {
    if (!SuiService.instance) {
      SuiService.instance = new SuiService()
    }
    return SuiService.instance
  }

  public getNetwork(): TSuiNetwork | undefined {
    return this.network
  }

  public getPrivateKey(): string | undefined {
    return this.privateKey
  }

  public getSuiClient(): SuiClient {
    return this.client
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
    const instance = SuiService.getInstance()
    if (!instance.signer) {
      throw new Error('Signer not found')
    }

    return instance.client.signAndExecuteTransaction({
      transaction,
      signer: instance.signer,
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

  public createAccount(network: TSuiNetwork): {
    address: string
    privateKey: string
    network: TSuiNetwork
  } {
    // Generate new keypair.
    const keypair = Ed25519Keypair.generate()
    const address = keypair.toSuiAddress()
    const privateKey = `suiprivkey${Buffer.from(keypair.getSecretKey()).toString('hex')}`

    // Save network and private key.
    this.network = network
    this.privateKey = privateKey
    this.signer = this.getSignerFromPrivateKey(privateKey)
    this.saveConfig()

    return {
      address,
      privateKey,
      network,
    }
  }

  public static isValidPrivateKey(privateKey: string | undefined) {
    return privateKey != null && privateKey.startsWith('suiprivkey')
  }

  public static isValidSuiAddress(address: string) {
    return isValidSuiAddress(address)
  }

  public async getCoinMetadata(coinType: string): Promise<CoinMetadata | null> {
    if (this.coinInfoMap.has(coinType)) {
      return this.coinInfoMap.get(coinType) || null
    }

    const metadata = await this.client.getCoinMetadata({ coinType: coinType })
    if (!metadata) {
      return null
    }

    this.coinInfoMap.set(coinType, metadata)

    return metadata
  }

  private getSignerFromPrivateKey(privateKey: string): Signer {
    const keypairClasses = [Ed25519Keypair, Secp256k1Keypair, Secp256r1Keypair]
    for (const KeypairClass of keypairClasses) {
      try {
        return KeypairClass.fromSecretKey(privateKey)
      } catch {}
    }
    throw new Error('Failed to initialize keypair from secret key')
  }

  private readAndValidateConfig(): void {
    const network = getSetting('SUI_NETWORK') as TSuiNetwork
    const privateKey = getSetting('SUI_PRIVATE_KEY')

    // @todo: Validate with a Zod schema.

    if (network == null || network.trim() === '') {
      throw new Error('Network is not set')
    }

    if (!SuiService.isValidPrivateKey(privateKey)) {
      throw new Error('Private key is not valid')
    }

    this.network = network
    this.privateKey = privateKey
  }

  private saveConfig(): void {
    if (!this.network) {
      throw new Error('Network is not set')
    }
    if (!this.privateKey) {
      throw new Error('Private key is not set')
    }
    saveSettings({
      SUI_NETWORK: this.network,
      SUI_PRIVATE_KEY: this.privateKey,
    })
  }
}
