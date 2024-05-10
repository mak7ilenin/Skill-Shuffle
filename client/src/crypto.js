import CryptoJS from 'crypto-js';
import {ENCRYPTION_KEY} from './config';

const dynamicValue = new Date().toISOString().slice(0, 10);

export function AESEncrypt(pureText) {    
    const privateKey=`${dynamicValue} ${ENCRYPTION_KEY}`;
    return encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(pureText), privateKey).toString());
}

export function AESDecrypt(encryptedText) {  
    const privateKey=`${dynamicValue} ${ENCRYPTION_KEY}`;    
    const bytes  = CryptoJS.AES.decrypt(decodeURIComponent(encryptedText), privateKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}