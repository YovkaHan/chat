function arrayBufferToUtf8(arrayBuffer) {
    return new TextDecoder("utf-8").decode(arrayBuffer);
}

function base64StringToArrayBuffer(base64) {
    let binary_string =  atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array( len );
    for (let i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function convertPemToBinary2(pem) {
    let lines = pem.split('\n');
    let encoded = '';
    for(let i = 0;i < lines.length;i++){
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

function str2abUtf8(myString){
    return new TextEncoder("utf-8").encode(myString);
}

function arrayBufferToBase64String(arrayBuffer) {
    let byteArray = new Uint8Array(arrayBuffer);
    let byteString = '';
    for (let i=0; i<byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i]);
    }
    return btoa(byteString);
}

export default {
    arrayBufferToUtf8: arrayBufferToUtf8,
    base64StringToArrayBuffer: base64StringToArrayBuffer,
    convertPemToBinary2: convertPemToBinary2,
    str2abUtf8: str2abUtf8,
    arrayBufferToBase64String: arrayBufferToBase64String
}