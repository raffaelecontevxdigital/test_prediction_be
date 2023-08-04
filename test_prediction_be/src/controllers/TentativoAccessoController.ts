import { Request, Response } from "express";
import { TentativoAccesso } from "../entity/TentativoAccesso";
import { myDataSource } from "../config/config";


class TentativoAccessoController {

    static create = async (req: Request, res: Response) => {

        

        let tentativoAccesso = new TentativoAccesso();
        tentativoAccesso.url = req.body.href;
        tentativoAccesso.hostname = req.body.hostname
        tentativoAccesso.host = req.body.host;
        tentativoAccesso.pathname = req.body.pathname
        tentativoAccesso.port = req.body.port;
        tentativoAccesso.protocol = req.body.protocol
        tentativoAccesso.createAt = new Date()

        await myDataSource.getRepository(TentativoAccesso).save(tentativoAccesso).then(bl => {
            res.status(200).send(bl);
        }).catch(e => {
            res.status(500).send(e);
        })

    }

    static edit = async (req: Request, res: Response) => {


        res.status(500).send('Method not allowed');

    }

    static delete = async (req: Request, res: Response) => {

        res.status(500).send('Method not allowed');

    }

    static get = async (req: Request, res: Response) => {


        try {
            const tentativoAccessoRepository = await myDataSource.getRepository(TentativoAccesso);

            if (req.query.id != undefined) {

                let id: number = parseInt(req.query.id.toString());

                tentativoAccessoRepository.findOne({ where: { id: id } })
                    .then(corp => {
                        res.status(200).send(corp);
                    })

            } else {
                tentativoAccessoRepository.find()
                    .then(corp => {
                        res.status(200).send(corp);
                    });
            }

        } catch (errore) {
            res.status(500).send(errore)
        }

    }
};

export default TentativoAccessoController;