import { Request, Response } from "express";
import { Parola } from "../entity/Parola";
import { myDataSource } from "../config/config";


class ParolaController {

    static create = async (req: Request, res: Response) => {

        

        let parola = new Parola();
        parola.combination = req.body.combination?.toString();
        parola.rank = parseInt(req.body.rank.toString());
        parola.nome = req.body.nome.toString();

        await myDataSource.getRepository(Parola).save(parola).then(bl => {
            res.status(200).send(bl);
        }).catch(e => {
            res.status(500).send(e);
        })

    }

    static edit = async (req: Request, res: Response) => {

        

        let idParola: number = parseInt(req.query.id.toString());

        await myDataSource.getRepository(Parola).findOneOrFail({ where: { id: idParola } })
            .then(async parola => {
                parola.combination = req.body.combination?.toString();
                parola.rank = parseInt(req.body.rank.toString());
                parola.nome = req.body.nome.toString();

                await myDataSource.getRepository(Parola).save(parola);
                res.status(200).send(parola);
            }).catch(e => {
                res.status(500).send(e);
            })

    }

    static delete = async (req: Request, res: Response) => {

        try {

            let idParola: any = req.query.id.toString().split(',');

            const parolaRepository = myDataSource.getRepository(Parola);
            for (const id of idParola) {
                await parolaRepository.delete(id);
            }
            res.status(201).send("Cancellazione avvenuta");
        } catch (e) {
            res.status(500).send(e);
        }

    }

    static get = async (req: Request, res: Response) => {


        try {
            const parolaRepository = await myDataSource.getRepository(Parola);

            if (req.query.id != undefined) {

                let id: number = parseInt(req.query.id.toString());

                parolaRepository.findOne({ where: { id: id } })
                    .then(corp => {
                        res.status(200).send(corp);
                    })

            } else {
                parolaRepository.find()
                    .then(corp => {
                        res.status(200).send(corp);
                    });
            }

        } catch (errore) {
            res.status(500).send(errore)
        }

    }
};

export default ParolaController;