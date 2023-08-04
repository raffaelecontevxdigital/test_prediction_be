import { Request, Response } from 'express';
import * as fs from 'fs';
import * as nodemailer from "nodemailer";
import handlebars = require('handlebars');
import * as moment from 'moment';
import config from '../config/config';
/* const SMS = require('node-sms-send') */

class SenderController {

    constructor(props) {

    }
    static sendEmail = async (params: any) => {

        const pool = JSON.parse(config.MAIL_SETTINGS.pool)
        const port = parseInt(config.MAIL_SETTINGS.port.toString())
        const secure = JSON.parse(config.MAIL_SETTINGS.secure)

        return await new Promise(async (resolve, reject) => {

            const transport = nodemailer.createTransport({
                pool: pool,
                host: config.MAIL_SETTINGS.host,
                port: port,
                secure: secure,
                auth: {
                    user: config.MAIL_SETTINGS.auth.user,
                    pass: config.MAIL_SETTINGS.auth.password // password senza caratteri speciali
                }
            });

            transport.sendMail({
                from: config.MAIL_SETTINGS.auth.user,
                to: params.to,
                subject: 'Accesso alla piattaforma prediction con codice OTP',
                html: `
              <div
                class="container"
                style="max-width: 90%; margin: auto; padding-top: 20px"
              >
                <h2>Ben tornato.</h2>
                <p style="margin-bottom: 30px;">Per accedere alla piattaforma inserire il codice OTP.</p>
                <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
           </div>
            `,
            }, (error, response) => {

                if (error) {
                    console.warn(error)
                    reject(error)
                }
                console.log("Message sent: %s", response.messageId);
                return resolve({ status: 200, messageId: response.messageId })
            });



        })
    }


    static sendSMS = async (smsInformation) => {
        return await new Promise(async (resolve, reject) => {
            /* const sms = new SMS('username', 'password')

            sms.send(smsInformation.number, smsInformation.content)
                .then(body => console.log(body)) // returns { message_id: 'string' }
                .catch(err => console.log(err.message)) */
        })
    }

}
export default SenderController;