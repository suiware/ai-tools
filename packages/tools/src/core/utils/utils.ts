import BigNumber from 'bignumber.js'

export function formatBalance(
  balance: bigint | number | string,
  decimals: number
) {
  // Number(totalBalance) / Math.pow(10, decimal);
  return BigNumber(balance.toString()).shiftedBy(-decimals).toFixed(8)
}

export function disableConsoleLog() {
  const originalConsoleLog = console.log
  console.log = () => {}
  return originalConsoleLog
}
export function enableConsoleLog(originalConsoleLog: any) {
  console.log = originalConsoleLog
}

export function isWbtcShortStructAddress(address: string) {
  return (
    address ===
    '0x27792d9fed7f9844eb4839566001bb6f6cb4804f66aa2da6fe1ee242d896881::coin::COIN'
  )
}
