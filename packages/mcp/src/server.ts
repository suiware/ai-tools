import { createMcpServer, startMcpServer } from './'

const server = createMcpServer()

async function main() {
  await startMcpServer(server)
}

main()
