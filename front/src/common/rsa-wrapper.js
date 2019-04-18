const crypto = window.crypto.subtle;
import keypair from 'keypair';

const rsaParams = {name: "RSA-OAEP", hash: "SHA-1"};

function arrayBufferToUtf8(arrayBuffer) {
    return new TextDecoder("utf-8").decode(arrayBuffer);
}

function base64StringToArrayBuffer(base64) {
    let binary_string = atob(convertPemToBinary2(atob(base64)));
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function convertPemToBinary2(pem) {
    let lines = pem.split('\n');
    let encoded = '';
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().length > 0 &&
            lines[i].indexOf('-BEGIN RSA PRIVATE KEY-') < 0 &&
            lines[i].indexOf('-BEGIN RSA PUBLIC KEY-') < 0 &&
            lines[i].indexOf('-BEGIN PRIVATE KEY-') < 0 &&
            lines[i].indexOf('-BEGIN PUBLIC KEY-') < 0 &&
            lines[i].indexOf('-END PUBLIC KEY-') < 0 &&
            lines[i].indexOf('-END RSA PRIVATE KEY-') < 0 &&
            lines[i].indexOf('-END PRIVATE KEY-') < 0 &&
            lines[i].indexOf('-END RSA PUBLIC KEY-') < 0) {
            encoded += lines[i].trim();
        }
    }
    return encoded;
}

function str2abUtf8(myString) {
    return new TextEncoder("utf-8").encode(myString);
}

function generate() {
    return new keypair(2048, 65537);
}

function arrayBufferToBase64String(arrayBuffer) {
    let byteArray = new Uint8Array(arrayBuffer);
    let byteString = '';
    for (let i = 0; i < byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i]);
    }
    return btoa(byteString);
}

function importPublicKey(keyInPemFormat) {
    const key = base64StringToArrayBuffer(keyInPemFormat);

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
    const key = base64StringToArrayBuffer(keyInPemFormat);

    return new Promise(function (resolve, reject) {
        crypto.importKey('pkcs8', key, rsaParams, false, ["decrypt"])
            .then(function (cryptoKey) {
                resolve(cryptoKey);
            });
    });
}

function publicEncrypt(keyInPemFormat, message) {
    return new Promise(function (resolve, reject) {
        importPublicKey(keyInPemFormat).then(function (key) {
            crypto.encrypt(rsaParams, key, str2abUtf8(message))
                .then(function (encrypted) {
                    resolve(arrayBufferToBase64String(encrypted));
                });
        })
    });
}

function privateDecrypt(keyInPemFormat, encryptedBase64Message) {
    return new Promise(function (resolve, reject) {
        importPrivateKey(keyInPemFormat).then(function (key) {
            crypto.decrypt(rsaParams, key, base64StringToArrayBuffer(encryptedBase64Message))
                .then(function (decrypted) {
                    resolve(arrayBufferToUtf8(decrypted));
                });
        });
    });
}

export default {
    arrayBufferToUtf8,
    base64StringToArrayBuffer,
    convertPemToBinary2,
    str2abUtf8,
    arrayBufferToBase64String,
    importPublicKey,
    importPrivateKey,
    publicEncrypt,
    privateDecrypt,
    generate
}