import { Request, Response } from "express";
import { Segnalazione } from "../entity/Segnalazione";
import { myDataSource } from "../config/config";
import { Genitore } from "../entity/Genitore";
import { decrypt, encrypt } from "../middlewares/utils";
import DnsServerController from "./DnsServerController";
import { SiteList } from "../entity/SiteList";


class SegnalazioneController {

    static create = async (req: Request, res: Response) => {

        if (req.query.codiceGenitore) {
            req.body = decrypt(req.body)
            let segnalazione = new Segnalazione();
            segnalazione.idGenitore = req.body.idGenitore
            segnalazione.status = req.body.status
            segnalazione.url = req.body.url
            segnalazione.createAt = new Date()

            await myDataSource.getRepository(Segnalazione).save(segnalazione).then((bl: any) => {
                bl = encrypt(bl)
                res.status(200).send(bl);
            }).catch(e => {
                e = encrypt(e)
                res.status(500).send(e);
            })
        } else {
            res.status(500).send(encrypt('Il codice genitore non è presente'));
        }

    }

    static edit = async (req: Request, res: Response) => {



        let idSegnalazione: number = parseInt(req.query.id.toString());

        await myDataSource.getRepository(Segnalazione).findOneOrFail({ where: { id: idSegnalazione } })
            .then(async segnalazione => {
                segnalazione.idGenitore = req.body.idGenitore
                segnalazione.status = req.body.status
                segnalazione.url = req.body.url
                segnalazione.notaOperatore = req.body.notaOperatore;
                segnalazione.idOperatoreUpdater = req.body.idOperatoreUpdater;
                segnalazione.updateAt = new Date()

                await myDataSource.getRepository(Segnalazione).save(segnalazione);
                if (segnalazione.status === 'TERMINATA') {
                    let blacklist = new SiteList();
                    blacklist.url = req.body.url;
                    blacklist.status = true;
                    blacklist.createAt = new Date()
                    await myDataSource.getRepository(SiteList).save(blacklist).then(async (bl) => {
                        await DnsServerController.callApi('POST', { domains: [req.body.url] }).then(resp => {
                            res.status(200).send(segnalazione);
                        }).catch(e => {
                            res.status(500).send(e);
                        })
                    }).catch((e) => {
                        res.status(200).send('Modifica effettuata sulla segnalazione ma il sito era già presente');
                    })
                } else {
                    res.status(200).send(segnalazione);
                }
            }).catch(e => {
                res.status(500).send(e);
            })

    }

    static delete = async (req: Request, res: Response) => {

        try {

            let idSegnalazione: any = req.query.id.toString().split(',');

            const segnalazioneRepository = myDataSource.getRepository(Segnalazione);
            for (const id of idSegnalazione) {
                await segnalazioneRepository.delete(id);
            }
            res.status(201).send("Cancellazione avvenuta");
        } catch (e) {
            res.status(500).send(e);
        }

    }

    static get = async (req: Request, res: Response) => {


        try {
            const segnalazioneRepository = await myDataSource.getRepository(Segnalazione);

            if (req.query.id != undefined) {

                let id: number = parseInt(req.query.id.toString());

                segnalazioneRepository.findOne({ where: { id: id } })
                    .then(corp => {
                        res.status(200).send(corp);
                    })

            } else if (req.query.codiceGenitore) {
                let codiceGenitore: string = req.query.codiceGenitore.toString()
                await myDataSource.getRepository(Genitore).findOneOrFail({ where: { codice: codiceGenitore } })
                    .then(async (gen) => {
                        segnalazioneRepository.createQueryBuilder("segnalazione")
                            .where("segnalazione.id_genitore = :id", { id: gen.id })
                            .getMany()
                            .then((corp: any) => {
                                corp = encrypt(corp)
                                res.status(200).send(corp);
                            })
                    }).catch((e) => {
                        res.status(500).send(e)
                    })
            } else {
                segnalazioneRepository.find()
                    .then(corp => {
                        res.status(200).send(corp);
                    });
            }

        } catch (errore) {
            res.status(500).send(errore)
        }

    }
};

export default SegnalazioneController;