import { Command } from 'commander'
import { configDotenv } from 'dotenv'
import { startSuiwareMcpServer } from './'
import { getPackageMeta } from './utils/misc'

async function main() {
  const packageMeta = getPackageMeta()

  const program = new Command()

  program
    .name(packageMeta.name)
    .description(packageMeta.description)
    .version(packageMeta.version)

  program
    .command('start', { isDefault: true })
    .description(`Start Suiware MCP Server`)
    .option('--env-file [envFile]', 'path to .env config file')
    .action(async ({ envFile }) => {
      if (envFile != null) {
        console.log('Reading provided .env file...')
        configDotenv({ path: envFile })
      }

      console.log('Starting Suiware MCP Server...')
      await startSuiwareMcpServer({
        name: packageMeta?.description || 'Suiware MCP Server',
        version: packageMeta?.version || '0.0.0',
      })

      console.log('Suiware MCP Server started')
    })

  program.parse()
}

main()
