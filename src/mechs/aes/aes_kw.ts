import * as core from "webcrypto-core";
import { setCryptoKey, getCryptoKey } from "../storage";
import { AesCrypto } from "./crypto";
import { AesCryptoKey } from "./key";

export class AesKwProvider extends core.AesKwProvider {

  public async onGenerateKey(algorithm: AesKeyGenParams, extractable: boolean, keyUsages: KeyUsage[]): Promise<CryptoKey> {
    const res = await AesCrypto.generateKey(
      {
        name: this.name,
        length: algorithm.length,
      },
      extractable,
      keyUsages,
    );
    return setCryptoKey(res);
  }

  public async onExportKey(format: KeyFormat, key: AesCryptoKey): Promise<JsonWebKey | ArrayBuffer> {
    return AesCrypto.exportKey(format, getCryptoKey(key) as AesCryptoKey);
  }

  public async onImportKey(format: KeyFormat, keyData: JsonWebKey | ArrayBuffer, algorithm: Algorithm, extractable: boolean, keyUsages: KeyUsage[]): Promise<CryptoKey> {
    const res = await AesCrypto.importKey(format, keyData, { name: algorithm.name }, extractable, keyUsages);
    return setCryptoKey(res);
  }

  public override async onEncrypt(algorithm: Algorithm, key: AesCryptoKey, data: ArrayBuffer): Promise<ArrayBuffer> {
    return AesCrypto.encrypt(algorithm, getCryptoKey(key) as AesCryptoKey, new Uint8Array(data));
  }

  public override async onDecrypt(algorithm: Algorithm, key: AesCryptoKey, data: ArrayBuffer): Promise<ArrayBuffer> {
    return AesCrypto.decrypt(algorithm, getCryptoKey(key) as AesCryptoKey, new Uint8Array(data));
  }

  public override checkCryptoKey(key: CryptoKey, keyUsage?: KeyUsage) {
    super.checkCryptoKey(key, keyUsage);
    if (!(getCryptoKey(key) instanceof AesCryptoKey)) {
      throw new TypeError("key: Is not a AesCryptoKey");
    }
  }
}
