import { startSuiwareMcpServer } from './'
import { getPackageMeta } from './utils/misc'

async function main() {
  const packageMeta = getPackageMeta()

  await startSuiwareMcpServer({
    name: packageMeta?.description || 'Suiware MCP Server',
    version: packageMeta?.version || '0.0.0',
  })

  await startSuiwareMcpServer({ name: 'Suiware MCP Server', version: '0.1.0' })
}

main()
