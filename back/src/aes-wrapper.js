const crypto = require('crypto');
const cryptoAsync = require('@ronomon/crypto-async');
const pkcs7 = require('pkcs7-padding');
const btoa = require('btoa');
const atob = require('atob');

const aesWrapper = {};

// get list of supportable encryption algorithms
aesWrapper.getAlgorithmList = () => {
    console.log(crypto.getCiphers());
};

aesWrapper.generateKey = () => {
    return crypto.randomBytes(32);
};

aesWrapper.generateIv = () => {
    let iv = Buffer.alloc(16);
    iv = Buffer.from(Array.prototype.map.call(iv, () => {
        return Math.floor(Math.random() * 256)
    }));

    return iv;
};

// separate initialization vector from message
aesWrapper.separateVectorFromData = (data) => {
    let iv = data.slice(-24);
    let message = data.substring(0, data.length - 24);

    return {
        iv: iv,
        message: message
    };
};

aesWrapper.encrypt = (key, iv, text) => {
    let encrypted = '';
    let cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
    encrypted += cipher.update(Buffer.from(text), 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return encrypted;
};

// aesWrapper.decrypt = (key, text) => {
//     let decrypted = '';
//
//     return new Promise(resolve => {
//         try {
//             let data = aesWrapper.separateVectorFromData(text);
//             let decipher = crypto.createDecipheriv('aes-256-ctr', key, Buffer.from(data.iv, 'base64'));
//
//             let chunk;
//             decipher.on('readable', () => {
//                 while (null !== (chunk = decipher.read())) {
//                     decrypted += chunk.toString('utf8');
//                     // console.log('DATA ', data);
//                     // console.log(key.toString('base64'));
//                     // console.log(chunk, chunk.toString('utf8'));
//                 }
//             });
//             decipher.on('end', () => {
//                 resolve(decrypted);
//                 // Prints: some clear text data
//             });
//
//             decipher.write(Buffer.from(data.message, 'base64'), 'base64');
//             decipher.end();
//
//         } catch (e) {
//             console.log(e);
//         }
//     });
// };

aesWrapper.decrypt = (key, text) => {
    return new Promise(resolve => {
        try {
            let data = aesWrapper.separateVectorFromData(text);
            const buff = Buffer.from(data.message, 'base64');
            cryptoAsync.cipher('aes-256-ctr', 0, key, Buffer.from(data.iv, 'base64'), buff, function (error, plaintext) {
                if (error) throw error;
                const decrypted = plaintext.toString('utf8');
                resolve(decrypted);
            });
        } catch (e) {
            console.log(e);
        }
    });
};

// add initialization vector to message
aesWrapper.addIvToBody = (iv, encryptedBase64) => {
    encryptedBase64 += iv.toString('base64');

    return encryptedBase64;
};

aesWrapper.createAesMessage = (aesKey, message) => {
    let aesIv = aesWrapper.generateIv();
    let encryptedMessage = aesWrapper.encrypt(aesKey, aesIv, message);
    encryptedMessage = aesWrapper.addIvToBody(aesIv, encryptedMessage);

    return encryptedMessage;
};

aesWrapper.arrayBufferToBase64String = (arrayBuffer) => {
    let byteArray = new Uint8Array(arrayBuffer);
    let byteString = '';
    for (let i = 0; i < byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i]);
    }
    return btoa(byteString);
};

module.exports = aesWrapper;