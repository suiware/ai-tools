import BigNumber from 'bignumber.js'

export function formatBalance(
  balance: bigint | number | string,
  decimals: number
) {
  return BigNumber(balance.toString()).shiftedBy(-decimals).toFixed(2)
}

export function disableConsoleLog() {
  const originalConsoleLog = console.log
  // console.log = () => {}
  return originalConsoleLog
}

export function enableConsoleLog(originalConsoleLog: any) {
  console.log = originalConsoleLog
}

