import { createSuiwareMcpServer, startSuiwareMcpServer } from './'

const server = createSuiwareMcpServer()

async function main() {
  await startSuiwareMcpServer(server)
}

main()
