#!/usr/bin/env node

import { Command } from 'commander'
import { startSuiwareMcpServer } from './'
import { log } from './utils/log'
import { getPackageMeta } from './utils/misc'

async function main() {
  try {
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
          log.info('Reading provided config file...')
          process.env.SUIWARE_MCP_ENV_CONFIG_FILE_PATH = envConfigFile
        }

        log.info('Starting Suiware MCP Server...')
        await startSuiwareMcpServer({
          name: packageMeta?.description || 'Suiware MCP Server',
          version: packageMeta?.version || '0.0.0',
        })

        log.info('Suiware MCP Server started')
      })

    program.parse()
  } catch (error) {
    if (error instanceof Error) {
      log.error('Failed to start server:', error.message)
      if (error.stack) {
        log.debug('Stack trace:', error.stack)
      }
    } else {
      log.error('Failed to start server:', String(error))
    }
    process.exit(1)
  }
}

process.on('uncaughtException', (error) => {
  log.error('Uncaught exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  log.error('Unhandled rejection:', reason)
  process.exit(1)
})

main()
