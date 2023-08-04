import { Request, Response } from "express";
import { Guasto } from "../entity/Guasto";
import { myDataSource } from "../config/config";
import { Genitore } from "../entity/Genitore";
import { decrypt, encrypt } from "../middlewares/utils";


class GuastoController {

    static create = async (req: Request, res: Response) => {


        if (req.query.codiceGenitore) {
            req.body = decrypt(req.body)
            let guasto = new Guasto();
            guasto.data = req.body.data;
            guasto.descrizione = req.body.descrizione;
            guasto.idGenitore = req.body.idGenitore;
            guasto.status = req.body.status;
            guasto.reason = req.body.reason

            await myDataSource.getRepository(Guasto).save(guasto).then((bl: any) => {
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



        let idGuasto: number = parseInt(req.query.id.toString());

        await myDataSource.getRepository(Guasto).findOneOrFail({ where: { id: idGuasto } })
            .then(async guasto => {
                guasto.data = req.body.data;
                guasto.descrizione = req.body.descrizione;
                guasto.reason = req.body.reason
                guasto.idGenitore = req.body.idGenitore;
                guasto.status = req.body.status;
                guasto.notaOperatore = req.body.notaOperatore;
                guasto.idOperatoreUpdater = req.body.idOperatoreUpdater;
                guasto.updateAt = new Date();

                await myDataSource.getRepository(Guasto).save(guasto);
                res.status(200).send(guasto);
            }).catch(e => {
                res.status(500).send(e);
            })

    }

    static delete = async (req: Request, res: Response) => {

        try {

            let idGuasto: any = req.query.id.toString().split(',');

            const guastoRepository = myDataSource.getRepository(Guasto);
            for (const id of idGuasto) {
                await guastoRepository.delete(id);
            }
            res.status(201).send("Cancellazione avvenuta");
        } catch (e) {
            res.status(500).send(e);
        }

    }

    static get = async (req: Request, res: Response) => {


        try {
            const guastoRepository = await myDataSource.getRepository(Guasto);

            if (req.query.id != undefined) {

                let id: number = parseInt(req.query.id.toString());

                guastoRepository.findOne({ where: { id: id } })
                    .then(corp => {
                        res.status(200).send(corp);
                    })

            } else if (req.query.codiceGenitore) {
                let codiceGenitore: string = req.query.codiceGenitore.toString()
                await myDataSource.getRepository(Genitore).findOneOrFail({ where: { codice: codiceGenitore } })
                    .then(async (gen) => {
                        guastoRepository.createQueryBuilder("guasto")
                            .where("guasto.id_genitore = :id", { id: gen.id })
                            .getMany()
                            .then((corp: any) => {
                                corp = encrypt(corp)
                                res.status(200).send(corp);
                            })
                    }).catch((e) => {
                        res.status(500).send(e)
                    })
            } else {
                guastoRepository.find()
                    .then(corp => {
                        res.status(200).send(corp);
                    });
            }

        } catch (errore) {
            res.status(500).send(errore)
        }

    }
};

export default GuastoController;