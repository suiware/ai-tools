export function getSetting(name: string): string | null {
  return process.env?.[name] || null
}
