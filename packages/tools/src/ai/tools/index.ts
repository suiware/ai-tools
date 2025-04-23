import type { Tool } from 'ai'
import { suiAddressTool } from './suiAddressTool'
import { suiStakeTool } from './suiStakeTool'
import { suiSwapTool } from './suiSwapTool'
import { suiTransferTool } from './suiTransferTool'
import { suiUnstakeTool } from './suiUnstakeTool'
import { suiWalletBalanceTool } from './suiWalletBalanceTool'

export {
  suiAddressTool,
  suiStakeTool,
  suiSwapTool,
  suiTransferTool,
  suiUnstakeTool,
  suiWalletBalanceTool,
}

export function getSuiwareAiTools(): Record<string, Tool> {
  return {
    'get-address': suiAddressTool,
    'get-wallet-balance': suiWalletBalanceTool,
    'swap-coin': suiSwapTool,
    'transfer-coin': suiTransferTool,
    'stake-sui': suiStakeTool,
    'unstake-sui': suiUnstakeTool,
  }
}
