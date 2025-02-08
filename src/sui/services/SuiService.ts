import { Signer } from '@mysten/sui/cryptography'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1'
import { Secp256r1Keypair } from '@mysten/sui/keypairs/secp256r1'
import { isValidSuiAddress } from '@mysten/sui/utils'
import { getSetting } from '../../core/utils/environment'

export class SuiService {
  public static parseAccount(): Signer {
    const privateKey = getSetting('SUI_PRIVATE_KEY')
    if (!privateKey) {
      throw new Error('SUI_PRIVATE_KEY is not set')
    }
    if (!privateKey.startsWith('suiprivkey')) {
      throw new Error('SUI_PRIVATE_KEY should start from suiprivkey...')
    }
    return this.loadFromSecretKey(privateKey)
  }

  public static isValidSuiAddress(address: string) {
    return isValidSuiAddress(address)
  }

  private static loadFromSecretKey(privateKey: string) {
    const keypairClasses = [Ed25519Keypair, Secp256k1Keypair, Secp256r1Keypair]
    for (const KeypairClass of keypairClasses) {
      try {
        return KeypairClass.fromSecretKey(privateKey)
      } catch {
        // Removed unnecessary continue
      }
    }
    throw new Error('Failed to initialize keypair from secret key')
  }
}
