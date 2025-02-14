import { SuiClient } from '@mysten/sui/client'
import { SuinsClient } from '@mysten/suins'

export class SuinsService {
  private suinsClient: SuinsClient
  private suiClient: SuiClient

  constructor(suiClient: SuiClient) {
    this.suiClient = suiClient

    this.suinsClient = new SuinsClient({
      client: this.suiClient,
      // We rely on the network set through the SuiClient.
      // network: getSetting('SUI_NETWORK') as Network,
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
