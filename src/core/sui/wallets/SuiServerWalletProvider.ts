import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Environment } from "../../misc/Environment";
import { SuiAccount } from "../SuiAccount";
import { TSuiNetwork } from "../types/TSuiNetwork";
import { AWalletProvider } from "./AWalletProvider";
import { Signer } from "@mysten/sui/cryptography";

/**
 * A wallet provider that uses the Sui library.
 */
export class SuiServerWalletProvider extends AWalletProvider {
  #signer: Signer;
  #publicClient: SuiClient;

  /**
   * Constructs a new SuiServerWalletProvider.
   *
   * @param signer - The wallet client.
   * @param publicClient - The Sui client for RPC calls.
   */
  constructor(signer: Signer, publicClient: SuiClient) {
    super();
    this.#signer = signer;
    this.#publicClient = publicClient;
  }

  /**
   * Executes a transaction block.
   *
   * @param transaction - The transaction block to execute.
   * @returns The transaction response.
   */
  async executeTransaction(
    transaction: Transaction
  ): Promise<SuiTransactionBlockResponse> {
    if (!this.#signer) {
      throw new Error("Signer not found");
    }

    return this.#publicClient.signAndExecuteTransaction({
      transaction,
      signer: this.#signer,
    });
  }

  /**
   * Gets the address of the wallet.
   *
   * @returns The address of the wallet.
   */
  getAddress(): string {
    return this.#signer.toSuiAddress();
  }

  /**
   * Gets the network of the wallet.
   *
   * @returns The network of the wallet.
   */
  getNetwork(): TSuiNetwork {
    return Environment.getSetting("SUI_NETWORK") as TSuiNetwork;
  }

  /**
   * Gets the name of the wallet provider.
   *
   * @returns The name of the wallet provider.
   */
  getName(): string {
    return "sui-server-wallet-provider";
  }

  /**
   * Gets the balance of the wallet.
   *
   * @returns The balance of the wallet in MIST (smallest Sui unit).
   */
  async getBalance(): Promise<bigint> {
    const address = this.getAddress();
    if (!address) {
      throw new Error("Address not found");
    }

    const balance = await this.#publicClient.getBalance({
      owner: address,
    });

    return BigInt(balance.totalBalance);
  }

  /**
   * Waits for a transaction receipt.
   *
   * @param digest - The digest of the transaction to wait for.
   * @returns The transaction receipt.
   */
  async waitForTransactionReceipt(
    digest: string
  ): Promise<SuiTransactionBlockResponse> {
    return this.#publicClient.waitForTransaction({
      digest,
      options: {
        showEvents: true,
        showEffects: true,
      },
    });
  }

  /**
   * Transfer the given amount of SUI to the given address.
   *
   * @param to - The destination address.
   * @param value - The amount to transfer in whole SUI units
   * @returns The transaction digest.
   */
  async nativeTransfer(
    to: `0x${string}`,
    value: string
  ): Promise<`0x${string}`> {
    // Convert whole SUI units to MIST (1 SUI = 1e9 MIST)
    const amountInMist = BigInt(parseFloat(value) * 1e9);

    const tx = new Transaction();

    // first, split the gas coin into multiple coins
    const [coin] = tx.splitCoins(tx.gas, [amountInMist]);

    tx.transferObjects([coin], to);

    const response = await this.executeTransaction(tx);

    if (!response.digest) {
      throw new Error("Transaction failed");
    }

    return response.digest as `0x${string}`;
  }
}
