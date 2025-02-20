import EnvFileRW from 'env-file-rw'
import * as path from 'path'

const envPath = path.resolve(process.cwd(), '.env')
const env = new EnvFileRW(envPath)

export function getSetting(name: string): string | undefined {
  return process.env?.[name] || env.get(name)
}

export function saveSettings(settings: Record<string, string>): void {
  for (const [key, value] of Object.entries(settings)) {
    env.set(key, value)
    process.env[key] = value
  }
  env.save()
}
