import { CoinMetadata, getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { AccountManager, NAVISDKClient } from 'navi-sdk'
import { CoinInfo } from 'navi-sdk/dist/types'
import { SUPPORTED_COINS } from '../core/config/coins'
import { getSetting } from '../core/utils/environment'
import { formatBalance } from '../core/utils/utils'
import { TSuiNetwork } from '../types/TSuiNetwork'
import { SuiService } from './SuiService'
import { SuinsService } from './SuinsService'

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
    if (this.naviClient.networkType !== 'mainnet') {
      throw new Error('Only mainnet is supported')
    }

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
    address: string,
    amount: string | number
  ) {
    let resolvedAddress: string | null = address
    // If it's a Suins name, try to resolve it to a Sui address.
    if (SuinsService.isValidSuinsName(address)) {
      const suinsService = new SuinsService(this.getSuiClient())
      resolvedAddress = await suinsService.resolveSuinsName(address)
      if (!resolvedAddress) {
        throw new Error(`Suins name ${address} not found`)
      }
    }

    if (resolvedAddress == this.getAddress()) {
      throw new Error('You cannot transfer to your own address')
    }

    const sourceTokenMetadata = NaviService.getSupportedCoinBySymbol(token)

    const amountIn =
      (typeof amount === 'string' ? parseFloat(amount) : amount) *
      10 ** sourceTokenMetadata!.decimal

    return await this.account.sendCoin(
      sourceTokenMetadata!.address,
      resolvedAddress,
      amountIn
    )
  }

  async getWalletNonZeroCoins() {
    const allBalances = await this.suiClient.getAllBalances({
      owner: this.account.address,
    })

    const coinBalances: Record<string, string> = {}

    for (const { coinType, totalBalance } of allBalances) {
      if (parseFloat(totalBalance) == 0) {
        continue
      }

      const coinInfo = this.getSupportedCoinByAddress(coinType)
      if (coinInfo) {
        coinBalances[coinInfo.symbol] = formatBalance(
          totalBalance,
          coinInfo.decimal
        )
        continue
      }

      const coinMetadata = await this.fetchCoinMetadata(coinType)
      if (coinMetadata) {
        coinBalances[coinMetadata.symbol] = formatBalance(
          totalBalance,
          coinMetadata.decimals
        )
        continue
      }

      const decimal = await this.account.getCoinDecimal(coinType)
      coinBalances[coinType] = formatBalance(totalBalance, decimal)
    }

    return coinBalances
  }

  public async getWalletBalance() {
    return await this.naviClient.accounts[0].getWalletBalance()
  }

  public static getSupportedCoins(): CoinInfo[] {
    return SUPPORTED_COINS
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
