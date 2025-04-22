import { DelegatedStake } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { SUI_SYSTEM_STATE_OBJECT_ID } from '@mysten/sui/utils'
import { formatBalance, suiToMist } from '../core/utils/utils'
import { SuiService } from './SuiService'

export class SuiStakingService {
  private suiService: SuiService

  // @todo: Make the validator address configurable.
  private readonly VALIDATOR_ADDRESS =
    '0x4fffd0005522be4bc029724c7f0f6ed7093a6bf3a09b90e62f61dc15181e1a3e' // Mysten-1

  constructor() {
    this.suiService = SuiService.getInstance()
  }

  /**
   * Stake SUI tokens to a validator.
   *
   * @param amount - The amount to stake in whole SUI units
   * @returns The transaction digest
   */
  public async stake(amount: string | number): Promise<string> {
    const amountInMist = suiToMist(amount)

    const tx = new Transaction()

    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInMist)])

    tx.moveCall({
      target: '0x3::sui_system::request_add_stake',
      arguments: [
        tx.object(SUI_SYSTEM_STATE_OBJECT_ID),
        coin,
        tx.pure.address(this.VALIDATOR_ADDRESS),
      ],
    })

    const response = await this.suiService.executeTransaction(tx)
    if (!response.digest) {
      throw new Error('Staking transaction failed')
    }

    await this.suiService.waitForTransactionReceipt(response.digest)

    return response.digest
  }

  /**
   * Unstake all stakes.
   *
   * @returns The transaction digests
   */
  public async unstake(): Promise<string> {
    const stakedObjects = await this.getStakedObjects()

    if (stakedObjects.length === 0) {
      throw new Error('No staked objects found')
    }

    let stakeIds: string[] = []
    stakedObjects.forEach(
      (x) =>
        (stakeIds = stakeIds.concat(x.stakes.map((stake) => stake.stakedSuiId)))
    )

    const tx = new Transaction()

    stakeIds.forEach((stakeId) => {
      tx.moveCall({
        target: '0x3::sui_system::request_withdraw_stake',
        arguments: [tx.object(SUI_SYSTEM_STATE_OBJECT_ID), tx.object(stakeId)],
      })
    })

    const response = await this.suiService.executeTransaction(tx)
    if (!response.digest) {
      throw new Error('Unstaking transaction failed')
    }

    return response.digest
  }

  /**
   * Get all staked objects.
   *
   * @returns Array of delegated stake objects
   */
  public async getStakedObjects(): Promise<DelegatedStake[]> {
    const stakedObjects = await this.suiService.getSuiClient().getStakes({
      owner: this.suiService.getAddress(),
    })

    return stakedObjects
  }

  /**
   * Get the total staked Sui balance.
   *
   * @returns The total staked balance
   */
  public async getTotalStakedBalance(): Promise<string> {
    const stakedObjects = await this.getStakedObjects()

    // Sum up all stake principals from all stakes
    const amountMist = stakedObjects.reduce((total, delegatedStake) => {
      // Each delegated stake can have multiple stakes
      const stakesTotal = delegatedStake.stakes.reduce(
        (stakeTotal, stake) => stakeTotal + BigInt(stake.principal),
        BigInt(0)
      )
      return total + stakesTotal
    }, BigInt(0))

    return formatBalance(amountMist, 9)
  }
}
