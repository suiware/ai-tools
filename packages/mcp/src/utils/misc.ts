import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const getCliDirectory = () => {
  const currentFileUrl = import.meta.url
  return path.dirname(decodeURI(fileURLToPath(currentFileUrl)))
}

export const getPackageMeta = () => {
  try {
    const packageFile = readFileSync(
      path.join(getCliDirectory(), '../../package.json'),
      'utf8'
    )
    return JSON.parse(packageFile)
  } catch (e) {
    return null
  }
}
