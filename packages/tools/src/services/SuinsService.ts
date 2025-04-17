import { SuiClient } from '@mysten/sui/client'
import { SuinsClient } from '@mysten/suins'
import { getSetting } from '../core/utils/environment'

export class SuinsService {
  private suinsClient: SuinsClient
  private suiClient: SuiClient

  constructor(suiClient: SuiClient) {
    this.suiClient = suiClient

    this.suinsClient = new SuinsClient({
      client: this.suiClient,
      network: getSetting('SUI_NETWORK') as 'mainnet' | 'testnet',
    })
  }

  public async resolveSuinsName(name: string): Promise<string | null> {
    const nameRecord = await this.suinsClient.getNameRecord(name)
    return nameRecord?.targetAddress || null
  }

  public static isValidSuinsName(name: string): boolean {
    return name.endsWith('.sui') || name.startsWith('@')
  }
}
