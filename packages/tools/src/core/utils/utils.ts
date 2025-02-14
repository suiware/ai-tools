import BigNumber from 'bignumber.js'

export function formatBalance(
  balance: bigint | number | string,
  decimals: number
) {
  return BigNumber(balance.toString()).shiftedBy(-decimals).toFixed(2)
}
