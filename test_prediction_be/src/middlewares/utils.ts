import { Request, Response } from "express";
import * as crypto from 'crypto';
import config, { myDataSource } from "../config/config";
import { Figlio } from "../entity/Figlio";
import { Genitore } from "../entity/Genitore";
import { ILike } from "typeorm";

export async function getLastNumber(type: string, res: Response) {

    return await new Promise(async (resolve, reject) => {

        const genitoreRepository = myDataSource.getRepository(Genitore);
        const figlioRepository = myDataSource.getRepository(Figlio);

        const repository = type.includes('G') ? genitoreRepository : figlioRepository

        repository.find({

            where: { codice: ILike("" + type + "%") }, order: { codice: 'DESC' }

        }).then((element => {
            const lastNumber = element[0].codice.split(type)[1]
            resolve(parseInt(lastNumber.toString()))
        })).catch(() => {
            resolve(0)
        })


    })




};

export const log = {
    error: function (param) {
        return { ...param, status: 'Error' }
    },
    init: function (param) {
        return { ...param, status: 'Init' }
    },
    found: function (param) {
        return { ...param, status: 'Found' }
    },
    notFound: function (param) {
        return { ...param, status: 'Not Found' }
    },
    success: function (param) {
        return { ...param, status: 'Successful' }
    },
    warning: function (param) {
        return { ...param, status: 'Warning' }
    },
    process: function (param) {
        return { ...param, status: 'Process' }
    },
    failed: function (param) {
        return { ...param, status: 'Failed' }
    },
    rollback: function (param) {
        return { ...param, status: 'RollBack' }
    },
    skipped: function (param) {
        return { ...param, status: 'Skipped' }
    },
    commit: function (param) {
        return { ...param, status: 'Commit' }
    },
    release: function (param) {
        return { ...param, status: 'Release' }
    },
    finish: function (param) {
        return { ...param, status: 'Finish' }
    },
}

export function addUniqueItems(list, siteListItems) {
    // Rimuove i duplicati da siteListItems
    siteListItems = Array.from(new Set(siteListItems));

    // Filtra gli elementi in siteListItems che non sono presenti in list
    let uniqueItemsFromSiteListItems = siteListItems.filter(item => !list.includes(item));

    // Concatena gli elementi unici per ottenere siteToAtt
    let siteToAtt = uniqueItemsFromSiteListItems;

    return siteToAtt;
}

export function onlyUniqueNameStatus(value) {
    var resArr = [];
    value.filter((item: any) => {
        var i = resArr.findIndex(x => (x.name == item.name && x.status == item.status));
        if (i <= -1) {
            resArr.push(item);
        }
        return null;
    });
    return resArr;
}

export const generateUniqueNumber = (prefix: string, number: number): string => {
    const numberFormat: string = "000000"
    return prefix + numberFormat.substring(0, numberFormat.length - number.toString().length) + number
};

// Define the decrypt function
export const decryptServer = (data: string) => {
    // Convert the data from base64
    const dataBytes = Buffer.from(data, 'base64');

    // The IV is the first 16 bytes of the data
    const iv = dataBytes.subarray(0, 16);

    // The ciphertext is the remainder of the data
    const ciphertext = dataBytes.subarray(16);

    // Create a decipher using the key and IV
    const decipher: any = crypto.createDecipheriv('aes-256-cbc', config.KEY, iv);

    // Decrypt the data
    let decrypted = decipher.update(ciphertext, 'binary', 'utf8');
    decrypted += decipher.final('utf8');

    // Convert the decrypted data to a JavaScript object
    return JSON.parse(decrypted);
}

export const encrypt = (data) => {
    const IV = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', config.KEY, IV);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const dataToSend = IV.toString('base64') + encrypted;
    return dataToSend;
}

export const decrypt = (dataObj) => {
    const ciphertext = dataObj.encrypted;
    const IV = Buffer.from(ciphertext.substring(0, 24), 'base64');
    const encryptedData = ciphertext.substring(24);
    const decipher = crypto.createDecipheriv('aes-256-cbc', config.KEY, IV);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    try {
        return JSON.parse(decrypted);
    } catch (error) {
        console.log("Error parsing JSON, returning raw data", error);
        return decrypted;
    }
}