const crypto = window.crypto.subtle;
import keypair from 'keypair';
import converterWrapper from './converter-wrapper';

const rsaParams = {name: "RSA-OAEP", hash: {name: "SHA-1"}};

function addNewLines(str) {
    let finalString = '';
    while(str.length > 0) {
        finalString += str.substring(0, 64) + '\n';
        str = str.substring(64);
    }

    return finalString;
}

function toPem(key, set) {
    const b64 = addNewLines(converterWrapper.arrayBufferToBase64String(key));
    let pem = null;

    if(set === 'private'){
        pem = "-----BEGIN PRIVATE KEY-----\n" + b64 + "-----END PRIVATE KEY-----";
    } else if(set === 'public'){
        pem = "-----BEGIN PUBLIC KEY-----\n" + b64 + "-----END PUBLIC KEY-----";
    }

    return pem;
}

function generate() {
    return new Promise(resolve => {
        crypto.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true,
            ["encrypt", "decrypt"]
        ).then(keypair => {
            const privateKey = crypto.exportKey(
                "pkcs8",
                keypair.privateKey
            );
            const publicKey = crypto.exportKey(
                "spki",
                keypair.publicKey
            );
            Promise.all([privateKey, publicKey]).then(keys => {
                resolve({
                    privateKey: toPem(keys[0], 'private'),
                    publicKey: toPem(keys[1], 'public')
                });
            })
        })
    });
}

function importPublicKey(keyInPemFormat) {
    const base64String = converterWrapper.convertPemToBinary2(keyInPemFormat);
    const key = converterWrapper.base64StringToArrayBuffer(base64String);

    return new Promise(function (resolve, reject) {

        crypto.importKey('spki', key, rsaParams, false, ["encrypt"])
            .then(cryptoKey => {
                resolve(cryptoKey);
            }).catch(error => {
                console.error(error);
        })
    });
}

function importPrivateKey(keyInPemFormat) {
    const base64String = converterWrapper.convertPemToBinary2(keyInPemFormat);
    const key = converterWrapper.base64StringToArrayBuffer(base64String);

    return new Promise(function (resolve, reject) {
        crypto.importKey('pkcs8', key, rsaParams, false, ["decrypt"])
            .then(function (cryptoKey) {
                resolve(cryptoKey);
            }).catch(error => {
            console.error(error);
        });
    });
}

function publicEncrypt(keyInPemFormat, message) {
    return new Promise(function (resolve, reject) {
        importPublicKey(keyInPemFormat).then(function (key) {
            crypto.encrypt(rsaParams, key, converterWrapper.str2abUtf8(message))
                .then(function (encrypted) {
                    resolve(converterWrapper.arrayBufferToBase64String(encrypted));
                });
        })
    });
}

function privateDecrypt(keyInPemFormat, encryptedBase64Message) {
    return new Promise(function (resolve, reject) {
        importPrivateKey(keyInPemFormat).then(function (key) {
            crypto.decrypt(rsaParams, key, converterWrapper.base64StringToArrayBuffer(encryptedBase64Message))
                .then(function (decrypted) {
                    resolve(converterWrapper.arrayBufferToUtf8(decrypted));
                });
        });
    });
}

export default {
    importPublicKey,
    importPrivateKey,
    publicEncrypt,
    privateDecrypt,
    generate
}