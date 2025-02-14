import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { SuinsClient } from '@mysten/suins'
import { getSetting } from '../core/utils/environment'
import { TSuiNetwork } from '../types/TSuiNetwork'

export class SuiService {
  private suinsClient: SuinsClient
  private suiClient: SuiClient

  constructor(suiClient: SuiClient) {
    this.suiClient = suiClient

    this.suinsClient = new SuinsClient({
      client: this.suiClient,
      network: getFullnodeUrl(
        getSetting('SUI_NETWORK') as Pick<TSuiNetwork, 'testnet' | 'mainnet'>
      ),
    })
  }

  public async resolveSuinsName(name: string): Promise<string | null> {
    const nameRecord = await this.suinsClient.getNameRecord(name)
    return nameRecord?.targetAddress || null
  }
}
