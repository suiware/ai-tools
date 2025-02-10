import { NAVISDKClient, nUSDC, Sui } from 'navi-sdk'
import { CoinInfo } from 'navi-sdk/dist/types'
import { getSetting } from '../core/utils/environment'
import { TSuiNetwork } from '../types/TSuiNetwork'
import { SuiService } from './SuiService'

export class NaviService {
  private client: NAVISDKClient

  constructor() {
    const privateKey = getSetting('SUI_PRIVATE_KEY') as string
    if (!SuiService.isValidPrivateKey(privateKey)) {
      throw new Error('Invalid SUI_PRIVATE_KEY in the config')
    }

    const suiNetwork = getSetting('SUI_NETWORK') as TSuiNetwork
    if (suiNetwork !== 'mainnet') {
      throw new Error('Only mainnet is supported for USDC swaps')
    }

    this.client = new NAVISDKClient({
      privateKeyList: [privateKey],
      networkType: suiNetwork,
    })
  }

  public async getAllBalances() {
    const allBalances = await this.client.getAllBalances()

    return NaviService.getSwappableTokens().map((x) => ({
      [NaviService.naviUsdcToUsdc(x.symbol)]: allBalances[x.address],
    }))
  }

  public async swap(
    sourceToken: string,
    targetToken: string,
    amount: string | number
  ) {
    const account = this.client.accounts[0]

    const sourceTokenMetadata = NaviService.getSwappableToken(sourceToken)
    const targetTokenMetadata = NaviService.getSwappableToken(targetToken)

    const amountIn =
      (typeof amount === 'string' ? parseFloat(amount) : amount) *
      10 ** sourceTokenMetadata!.decimal

    return await account.swap(
      sourceTokenMetadata!.address,
      targetTokenMetadata!.address,
      amountIn,
      0
    )
  }

  public static getSwappableTokens(): CoinInfo[] {
    const networkType = getSetting('SUI_NETWORK')

    if (!networkType || !['mainnet'].includes(networkType)) {
      throw new Error('Sorry, swap is currently only supported on mainnet')
    }

    return [Sui, nUSDC]
  }

  public static isSwappableToken(token: string) {
    return this.getSwappableTokens().some(
      (swappableToken) =>
        this.naviUsdcToUsdc(swappableToken.symbol).toUpperCase() ===
        token.toUpperCase()
    )
  }

  public static getSwappableToken(token: string) {
    return this.getSwappableTokens().find(
      (swappableToken) =>
        this.naviUsdcToUsdc(swappableToken.symbol).toUpperCase() ===
        token.toUpperCase()
    )
  }

  public static getMissingSwappableToken(passedToken: string) {
    return this.getSwappableTokens().find(
      (swappableToken) =>
        this.naviUsdcToUsdc(swappableToken.symbol).toUpperCase() !==
        passedToken.toUpperCase()
    )
  }

  private static naviUsdcToUsdc(symbol: string) {
    return symbol === 'nUSDC' ? 'USDC' : symbol
  }
}
