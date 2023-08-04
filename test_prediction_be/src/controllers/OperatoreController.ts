import { Request, Response } from "express";
import { Operatore } from "../entity/Operatore";
import { myDataSource } from "../config/config";
import { validate } from "class-validator";


class OperatoreController {

    static create = async (req: Request, res: Response) => {

        

        let operatore = new Operatore();
        operatore.mail = req.body.mail
        operatore.password = req.body.password
        operatore.username = req.body.username
        operatore.role = req.body.role

        //Validade if the parameters are ok
        const errors = await validate(operatore);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        operatore.hashPassword()

        await myDataSource.getRepository(Operatore).save(operatore).then(bl => {
            res.status(200).send(bl);
        }).catch(e => {
            res.status(500).send(e);
        })

    }

    static edit = async (req: Request, res: Response) => {

        

        let idOperatore: number = parseInt(req.query.id.toString());

        await myDataSource.getRepository(Operatore).findOneOrFail({ where: { id: idOperatore } })
            .then(async operatore => {
                operatore.mail = req.body.mail
                operatore.password = req.body.password
                operatore.username = req.body.username
                operatore.role = req.body.role
                operatore.hashPassword()

                await myDataSource.getRepository(Operatore).save(operatore);
                res.status(200).send(operatore);
            }).catch(e => {
                res.status(500).send(e);
            })

    }

    static delete = async (req: Request, res: Response) => {

        try {

            let idOperatore: any = req.query.id.toString().split(',');

            const operatoreRepository = myDataSource.getRepository(Operatore);
            for (const id of idOperatore) {
                await operatoreRepository.delete(id);
            }
            res.status(201).send("Cancellazione avvenuta");
        } catch (e) {
            res.status(500).send(e);
        }

    }

    static get = async (req: Request, res: Response) => {


        try {
            const operatoreRepository = await myDataSource.getRepository(Operatore);

            if (req.query.id != undefined) {

                let id: number = parseInt(req.query.id.toString());

                operatoreRepository.findOne({ where: { id: id } })
                    .then(corp => {
                        res.status(200).send(corp);
                    })

            } else {
                operatoreRepository.find()
                    .then(corp => {
                        res.status(200).send(corp);
                    });
            }

        } catch (errore) {
            res.status(500).send(errore)
        }

    }
};

export default OperatoreController;