import { Request, Response } from "express";
import { Genitore } from "../entity/Genitore";
import { myDataSource } from "../config/config";
import { generateUniqueNumber, getLastNumber } from "../middlewares/utils";


class GenitoreController {

    static create = async (req: Request, res: Response) => {

        

        const numberPrefix: string = 'G';
        const lastNumber: any = await getLastNumber(numberPrefix, res);

        let genitore = new Genitore();
        genitore.codice = generateUniqueNumber(numberPrefix, lastNumber + 1);

        await myDataSource.getRepository(Genitore).save(genitore).then((bl: any) => {
            bl.role = 'GENITORE'
            res.status(200).send(bl);
        }).catch(e => {
            res.status(500).send(e);
        })

    }

    static edit = async (req: Request, res: Response) => {

        res.status(200).send('Method not allowed');

    }

    static delete = async (req: Request, res: Response) => {

        try {

            let idGenitore: any = req.query.id.toString().split(',');

            const genitoreRepository = myDataSource.getRepository(Genitore);
            for (const id of idGenitore) {
                await genitoreRepository.delete(id);
            }
            res.status(201).send("Cancellazione avvenuta");
        } catch (e) {
            res.status(500).send(e);
        }

    }

    static get = async (req: Request, res: Response) => {


        try {
            const genitoreRepository = await myDataSource.getRepository(Genitore);

            if (req.query.id != undefined) {

                let id: number = parseInt(req.query.id.toString());

                genitoreRepository.findOne({ where: { id: id } })
                    .then(corp => {
                        res.status(200).send(corp);
                    })

            } else {
                genitoreRepository.find()
                    .then(corp => {
                        res.status(200).send(corp);
                    });
            }

        } catch (errore) {
            res.status(500).send(errore)
        }

    }
};

export default GenitoreController;