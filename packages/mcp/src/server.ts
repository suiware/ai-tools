import { startSuiwareStdioMcpServer } from './'
import { getPackageMeta } from './utils/misc'

const packageMeta = getPackageMeta()

async function main() {
  await startSuiwareStdioMcpServer({
    name: packageMeta.description,
    version: packageMeta.version,
  })
}

main()
