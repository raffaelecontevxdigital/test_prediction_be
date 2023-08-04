import axios from 'axios';
import * as crypto from 'crypto';
import config from '../config/config';
import { decryptServer } from '../middlewares/utils';

class DnsServerController {
    // Define the callApi function
    static callApi = async (method: string, domains: any) => {
        // Generate a random IV
        const IV = crypto.randomBytes(16);

        // Create a cipher using the key and IV
        const cipher = crypto.createCipheriv('aes-256-cbc', config.KEY, IV);

        // Encrypt the data
        let encrypted = cipher.update(JSON.stringify(domains), 'utf8', 'base64');
        encrypted += cipher.final('base64');

        // Prepend the IV to the encrypted data
        const dataToSend = IV.toString('base64') + encrypted;

        return new Promise((resolve, reject) => {
            axios({
                timeout: 60 * 60 * 1000,
                method: method,
                url: "http://15.160.219.118:8080/zone",
                data: { encrypted: dataToSend }, // Send encrypted data
                headers: { "Content-Type": "application/json" },
            })
                .then((res) => {
                    // Decrypt response if it's encrypted
                    if (res.data && res.data.encrypted) {
                        const decryptedData = decryptServer(res.data.encrypted);
                        if (decryptedData.status === 'success') {
                            resolve(decryptedData);
                        } else {
                            reject(decryptedData);
                        }
                    } else {
                        resolve(res);
                    }
                })
                .catch((e) => {
                    console.log(e)
                    reject(e);
                });
        });
    }

};

export default DnsServerController;
