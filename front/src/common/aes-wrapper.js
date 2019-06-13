const crypto = window.crypto.subtle;
import CryptoJS from 'crypto-js';
import converterWrapper from './converter-wrapper';

// wrapper for importing AES key for using with crypto library
function importPublicKey(key){
    return new Promise(function (resolve, rej) {
        crypto.importKey("raw", converterWrapper.base64StringToArrayBuffer(key),
            {
                name: "AES-CTR"
            },
            false, //whether the key is extractable (i.e. can be used in exportKey)
            ["encrypt", "decrypt"] //can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
        ).then(function (cryptKey) {
            resolve(cryptKey);
        });
    });
}

// separate initialization vector from message
function separateVectorFromData(data) {
    let iv = data.slice(-24);
    let message = data.substring(0, data.length - 24);

    return{
        iv: iv,
        message: message
    };
}

// add initialization vector to message
function getMessageWithIv(message, iv) {
    return converterWrapper.arrayBufferToBase64String(message) + converterWrapper.arrayBufferToBase64String(iv);
}

let counter = window.crypto.getRandomValues(new Uint8Array(16));

function encryptMessage(key, message, event) {

    // let counter = window.crypto.getRandomValues(new Uint8Array(16));

    return (async () => {
        const m = converterWrapper.str2abUtf8(message);
        const _key = await importPublicKey(key);

        let encrypted = await crypto.encrypt(
            {
                name: "AES-CTR",
                counter: counter,
                length: 64
            },
            _key, //from generateKey or importKey above
            m //ArrayBuffer of data you want to encrypt
        );

        encrypted = getMessageWithIv(encrypted, counter);
        console.log(separateVectorFromData(encrypted));
        console.log('EVENT: ', event);
        console.log('Encrypted ', encrypted);

        return encrypted;
    })();
}

function wordToByteArray(wordArray) {
    var byteArray = [], word, i, j;
    for (i = 0; i < wordArray.length; ++i) {
        word = wordArray[i];
        for (j = 3; j >= 0; --j) {
            byteArray.push((word >> 8 * j) & 0xFF);
        }
    }
    return byteArray;
}

function decryptMessage(key, message) {
    let data = separateVectorFromData(message);

    return new Promise(function (resolve, rej) {
        importPublicKey(key).then(function (key) {
            crypto.decrypt(
                {
                    name: "AES-CTR",
                    counter: converterWrapper.base64StringToArrayBuffer(data['iv']),
                    length: 64
                },
                key, //from generateKey or importKey above
                converterWrapper.base64StringToArrayBuffer(data['message']) //ArrayBuffer of data you want to encrypt
            )
                .then(function (decrypted) {
                    resolve(converterWrapper.arrayBufferToUtf8(decrypted));
                });
        });
    });
}

export default {
    encryptMessage,
    decryptMessage,
    importPublicKey,
    separateVectorFromData,
}