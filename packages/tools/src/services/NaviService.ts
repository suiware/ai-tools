import { CoinMetadata, getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { AccountManager, NAVISDKClient } from 'navi-sdk'
import { CoinInfo } from 'navi-sdk/dist/types'
import { KNOWN_COINS } from '../core/config/coins'
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
      throw new Error('Only mainnet is supported')
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

  public getSuiClient() {
    return this.suiClient
  }

  public getAddress() {
    return this.account.address
  }

  public async getAllBalances() {
    const allBalances = await this.naviClient.getAllBalances()

    return NaviService.getSupportedCoins().map((x) => ({
      [NaviService.naviUsdcToUsdc(x.symbol)]: allBalances[x.address],
    }))
  }

  public async swap(
    sourceToken: string,
    targetToken: string,
    amount: string | number
  ) {
    const sourceTokenMetadata =
      NaviService.getSupportedCoinBySymbol(sourceToken)
    const targetTokenMetadata =
      NaviService.getSupportedCoinBySymbol(targetToken)

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

  public async transfer(
    token: string,
    targetAddress: string,
    amount: string | number
  ) {
    const sourceTokenMetadata = NaviService.getSupportedCoinBySymbol(token)

    // @todo: Add target address validation/ conversion from suins.

    const amountIn =
      (typeof amount === 'string' ? parseFloat(amount) : amount) *
      10 ** sourceTokenMetadata!.decimal

    return await this.account.sendCoin(
      sourceTokenMetadata!.address,
      targetAddress,
      amountIn
    )
  }

  async getWalletNonZeroCoins() {
    const allCoins = await this.account.getAllCoins()

    const result: Map<string, string> = new Map<string, string>()

    for (const coin of allCoins) {
      if (parseFloat(coin.balance) == 0) {
        continue
      }

      const coinInfo = this.getSupportedCoinByAddress(coin.coinType)
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

  public static getSupportedCoins(): CoinInfo[] {
    return KNOWN_COINS
  }

  public static isSupportedCoin(symbol: string) {
    return this.getSupportedCoins().some(
      (coin) =>
        this.naviUsdcToUsdc(coin.symbol).toUpperCase() === symbol.toUpperCase()
    )
  }

  public static getSupportedCoinBySymbol(symbol: string) {
    return this.getSupportedCoins().find(
      (coin) =>
        this.naviUsdcToUsdc(coin.symbol).toUpperCase() === symbol.toUpperCase()
    )
  }

  public static getMissingSupportedCoin(symbol: string) {
    return this.getSupportedCoins().find(
      (coin) =>
        this.naviUsdcToUsdc(coin.symbol).toUpperCase() !== symbol.toUpperCase()
    )
  }

  public getSupportedCoinByAddress(address: string) {
    const naviCoins = NaviService.getSupportedCoins()

    return naviCoins.find((x) => x.address === address)

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
