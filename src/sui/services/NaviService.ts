import { NAVISDKClient, nUSDC, Sui } from 'navi-sdk'
import { CoinInfo } from 'navi-sdk/dist/types'
import { getSetting } from '../../core/utils/environment'

export class NaviService {
  public static getSwappableTokens(): CoinInfo[] {
    const networkType = getSetting('SUI_NETWORK')

    if (!networkType || !['testnet', 'mainnet'].includes(networkType)) {
      throw new Error('Sorry, testnet is not supported for swap')
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

  public static async getAllBalances(client: NAVISDKClient) {
    const allBalances = await client.getAllBalances()

    return NaviService.getSwappableTokens().map((x) => ({
      [NaviService.naviUsdcToUsdc(x.symbol)]: allBalances[x.address],
    }))
  }

  private static naviUsdcToUsdc(symbol: string) {
    return symbol === 'nUSDC' ? 'USDC' : symbol
  }
}
