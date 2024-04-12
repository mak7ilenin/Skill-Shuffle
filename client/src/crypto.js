import CryptoJS from 'crypto-js';
import { ENCRYPTION_KEY } from './config';

const dynamicValue = new Date().toISOString().slice(0, 10);

export function AESEncrypt(pureText) {    
    const privateKey=`${dynamicValue} ${ENCRYPTION_KEY}`;    
    var ciphertext = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(pureText), privateKey).toString());    
    return ciphertext;
}

export function AESDecrypt(encryptedText) {  
    const privateKey=`${dynamicValue} ${ENCRYPTION_KEY}`;    
    var bytes  = CryptoJS.AES.decrypt(decodeURIComponent(encryptedText), privateKey);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));    
    return decryptedData;
}