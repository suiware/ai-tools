import { tool } from 'ai'
import z from 'zod'
import { NaviService } from '../../services/NaviService'
import { disableConsoleLog, enableConsoleLog } from '../../core/utils/utils'

export const suiWalletBalanceTool = tool({
  description:
    'Get non-zero wallet balances. Note that the nUSDC balance should be displayed as USDC.',
  parameters: z.object({}),
  execute: async () => {
    // We need to suppress the Navi's console log messages to prevent polluting the output.
    // See https://github.com/naviprotocol/navi-sdk/issues/82
    const originalConsoleLog = disableConsoleLog()

    const naviService = new NaviService()
    const balances = await naviService.getWalletNonZeroCoins()

    // Get the logs back.
    enableConsoleLog(originalConsoleLog)

    return {
      balances: balances,
    }
  },
})
