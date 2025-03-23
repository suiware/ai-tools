import { CoinMetadata, getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { AccountManager, NAVISDKClient } from 'navi-sdk'
import { CoinInfo } from 'navi-sdk/dist/types'
import { KNOWN_TOKENS } from '../core/config/swap'
import { getSetting } from '../core/utils/environment'
import { formatBalance } from '../core/utils/utils'
import { TSuiNetwork } from '../types/TSuiNetwork'
import { SuiService } from './SuiService'

export class NaviService {
  private naviClient: NAVISDKClient
  private suiClient: SuiClient
  private account: AccountManager

  constructor() {
    const privateKey = getSetting('SUI_PRIVATE_KEY') as string
    if (!SuiService.isValidPrivateKey(privateKey)) {
      throw new Error('Invalid SUI_PRIVATE_KEY in the config')
    }

    const suiNetwork = getSetting('SUI_NETWORK') as TSuiNetwork
    if (suiNetwork !== 'mainnet') {
      throw new Error('Only mainnet is supported for USDC swaps')
    }

    this.naviClient = new NAVISDKClient({
      privateKeyList: [privateKey],
      networkType: suiNetwork,
    })

    this.account = this.naviClient.accounts[0]

    this.suiClient = new SuiClient({
      url: getFullnodeUrl(suiNetwork),
    })
  }

  public async getAllBalances() {
    const allBalances = await this.naviClient.getAllBalances()

    return NaviService.getSwappableTokens().map((x) => ({
      [NaviService.naviUsdcToUsdc(x.symbol)]: allBalances[x.address],
    }))
  }

  public async swap(
    sourceToken: string,
    targetToken: string,
    amount: string | number
  ) {
    const sourceTokenMetadata = NaviService.getSwappableToken(sourceToken)
    const targetTokenMetadata = NaviService.getSwappableToken(targetToken)

    const amountIn =
      (typeof amount === 'string' ? parseFloat(amount) : amount) *
      10 ** sourceTokenMetadata!.decimal

    return await this.account.swap(
      sourceTokenMetadata!.address,
      targetTokenMetadata!.address,
      amountIn,
      0
    )
  }

  async getWalletNonZeroCoins() {
    const allCoins = await this.account.getAllCoins()

    const result: Map<string, string> = new Map<string, string>()

    for (const coin of allCoins) {
      if (parseFloat(coin.balance) == 0) {
        continue
      }

      const coinInfo = this.getKnownTokenInfo(coin.coinType)
      if (coinInfo) {
        result.set(
          coinInfo.symbol,
          formatBalance(coin.balance, coinInfo.decimal)
        )
        continue
      }

      const coinMetadata = await this.fetchCoinMetadata(coin.coinType)
      if (coinMetadata) {
        result.set(
          coinMetadata.symbol,
          formatBalance(coin.balance, coinMetadata.decimals)
        )
        continue
      }
    }

    return result
  }

  public async getWalletBalance() {
    return await this.naviClient.accounts[0].getWalletBalance()
  }

  public static getSwappableTokens(): CoinInfo[] {
    const networkType = getSetting('SUI_NETWORK')

    if (!networkType || !['mainnet'].includes(networkType)) {
      throw new Error('Sorry, swap is currently only supported on mainnet')
    }

    return this.getKnownTokens()
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

  public static getKnownTokens() {
    return KNOWN_TOKENS
  }

  public getKnownTokenInfo(coinType: string) {
    const naviCoins = NaviService.getKnownTokens()

    return naviCoins.find((x) => x.address === coinType)

    // @todo Get more token info through SuiClient.getCoinMetadata({coinType: ''})
  }

  public async fetchCoinMetadata(
    coinType: string
  ): Promise<CoinMetadata | null> {
    return this.suiClient.getCoinMetadata({ coinType: coinType })
  }

  private static naviUsdcToUsdc(symbol: string) {
    return symbol === 'nUSDC' ? 'USDC' : symbol
  }
}
