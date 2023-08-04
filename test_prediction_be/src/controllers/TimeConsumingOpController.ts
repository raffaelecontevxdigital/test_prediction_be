/**
* Central Unit acl-fe-api
* 2020 - Viniexport.com (C)
*
* TimeConsumingOpController - operazioni asincrone
*
*/
import { Request, Response } from "express";
import { TimeConsumingOp } from "../entity/TimeConsumingOp";
import { myDataSource } from '../config/config'


class TimeConsumingOpController {


    static createTimeConsumingOp = async (req: Request, res: Response, param: any) => {
        return await new Promise(async (resolve, reject) => {

            try {

                let tcop = new (TimeConsumingOp);
                tcop.command = param.commandType
                tcop.controller = param.controllerName
                tcop.status = param.status

                const tcopRepository = myDataSource.getRepository(TimeConsumingOp);
                await tcopRepository.save(tcop)
                    .then((el) => {
                        resolve(200)
                    })
                    .catch(err => {
                        reject(500)
                    })

            } catch (e) {

                reject(e)

            }
        })
    }

    static readTimeConsumingOp = async (req: Request, res: Response) => {

        const take: number = parseInt(req.query.take?.toString()) || 20
        const skip: number = parseInt(req.query.skip?.toString()) || 0

        let command = req.query.command.toString();
        let controller = req.query.controller.toString()

        await myDataSource.getRepository(TimeConsumingOp).findAndCount({
            where: {
                command: command,
                controller: controller,
            },
            order: { date: 'DESC' },
            take: take,
            skip: take * skip
        }).then(([TCops, count]) => {
            res.status(200).send({ TCops: TCops, totalCount: count });
            return;
        }).catch(e => {
            res.status(500).send(e);
        })

    }

};

export default TimeConsumingOpController;