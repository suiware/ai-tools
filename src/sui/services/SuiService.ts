import { Signer } from '@mysten/sui/cryptography'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1'
import { Secp256r1Keypair } from '@mysten/sui/keypairs/secp256r1'
import { isValidSuiAddress } from '@mysten/sui/utils'
import { getSetting } from '../../core/utils/environment'

export class SuiService {
  public static parseAccount(): Signer {
    const privateKey = getSetting('SUI_PRIVATE_KEY')

    if (!this.isValidPrivateKey(privateKey)) {
      throw new Error('Invalid SUI_PRIVATE_KEY in the config')
    }

    return this.loadFromSecretKey(privateKey!)
  }

  public static isValidPrivateKey(privateKey: string | null) {
    return privateKey && privateKey.startsWith('suiprivkey')
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
