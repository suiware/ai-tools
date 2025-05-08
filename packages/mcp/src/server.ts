#!/usr/bin/env node

import { Command } from 'commander'
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
    .option('--env-config-file [envConfigFile]', 'path to .env config file')
    .action(async ({ envConfigFile }) => {
      if (envConfigFile != null) {
        process.stdout.write('Reading provided config file...')
        process.env.SUIWARE_MCP_ENV_CONFIG_FILE_PATH = envConfigFile
      }

      process.stdout.write('Starting Suiware MCP Server...')
      await startSuiwareMcpServer({
        name: packageMeta?.description || 'Suiware MCP Server',
        version: packageMeta?.version || '0.0.0',
      })

      process.stdout.write('Suiware MCP Server started')
    })

  program.parse()
}

main()
