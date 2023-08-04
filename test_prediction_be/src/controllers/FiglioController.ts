import { Request, Response } from "express";
import { Figlio } from "../entity/Figlio";
import { myDataSource } from "../config/config";
import { generateUniqueNumber, getLastNumber } from "../middlewares/utils";
import { Genitore } from "../entity/Genitore";


class FiglioController {

    static create = async (req: Request, res: Response) => {

        

        const numberPrefix: string = 'F';
        const lastNumber: any = await getLastNumber(numberPrefix, res);

        let figlio = new Figlio();

        await myDataSource.getRepository(Genitore).findOneOrFail({ where: { codice: req.body.idGenitore } }).then(async (genitore) => {
            figlio.idGenitore = genitore;
            figlio.codice = generateUniqueNumber(numberPrefix, lastNumber + 1);
            await myDataSource.getRepository(Figlio).save(figlio).then((bl: any) => {
                bl.role = 'FIGLIO'
                res.status(200).send(bl);
            }).catch(e => {
                res.status(500).send(e);
            })
        }).catch((e) => {
            res.status(500).send(e);
        })

    }

    static edit = async (req: Request, res: Response) => {

        res.status(200).send('Method not allowed');

    }

    static delete = async (req: Request, res: Response) => {

        try {

            let idFiglio: any = req.query.id.toString().split(',');

            const figlioRepository = myDataSource.getRepository(Figlio);
            for (const id of idFiglio) {
                await figlioRepository.delete(id);
            }
            res.status(201).send("Cancellazione avvenuta");
        } catch (e) {
            res.status(500).send(e);
        }

    }

    static get = async (req: Request, res: Response) => {


        try {
            const figlioRepository = await myDataSource.getRepository(Figlio);

            if (req.query.id != undefined) {

                let id: number = parseInt(req.query.id.toString());

                figlioRepository.findOne({ where: { id: id } })
                    .then(corp => {
                        res.status(200).send(corp);
                    })

            } else {
                figlioRepository.find()
                    .then(corp => {
                        res.status(200).send(corp);
                    });
            }

        } catch (errore) {
            res.status(500).send(errore)
        }

    }
};

export default FiglioController;