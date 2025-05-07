import EnvFileRW from 'env-file-rw'
import * as path from 'path'

export class Environment {
  private static instance: Environment

  private env: EnvFileRW | undefined

  // Singleton.
  public static getInstance(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment()
    }
    return Environment.instance
  }

  public getSetting(name: string): string | undefined {
    return this.env?.get(name)
  }

  public setSetting(name: string, value: string): void {
    this.env?.set(name, value)
  }

  public saveSettings(): void {
    this.env?.save()
  }

  private constructor() {
    const envPath =
      process.env?.SUIWARE_MCP_CONFIG_PATH ||
      path.resolve(process.cwd(), '.env')

    try {
      this.env = new EnvFileRW(envPath, true)
    } catch (e) {
      console.debug('Failed to load environment file:', e)
    }
  }
}

export function getSetting(name: string): string | undefined {
  const env = Environment.getInstance()

  return process.env?.[name] || env.getSetting(name)
}

export function saveSettings(settings: Record<string, string>): void {
  const env = Environment.getInstance()

  for (const [key, value] of Object.entries(settings)) {
    env.setSetting(key, value)
    process.env[key] = value
  }
  env.saveSettings()
}
