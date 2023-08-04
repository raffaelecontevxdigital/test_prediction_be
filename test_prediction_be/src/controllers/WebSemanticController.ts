import { Request, Response } from "express";
import config, { myDataSource } from '../config/config'
import { google } from 'googleapis';
import { SiteList } from "../entity/SiteList";
import { addUniqueItems, log, onlyUniqueNameStatus } from "../middlewares/utils";
import TimeConsumingOpController from "./TimeConsumingOpController";



class WebSemanticController {

    static create = async (req: Request, res: Response) => {
        const customsearch = google.customsearch('v1');
        let risultante = [];
        let numtot = 0;
        let cicle_check = true;
        let q = req.body.words;
        let cr = 'paeseNL';
        let gl = 'nl';
        let lr = 'lang_nl';
        let start = 1;
        let num = 10;
        let selfLogLocal: any = []
        let actionType: any = []
        let status: Array<any> = []
        //while (cicle_check == true) {

        res.status(200).send("Richiesta presa in carico")
        const startOP = performance.now()
        status.push(log.init({ name: "WebSemanticOP" }))
        try {
            for (let q_index = 0; q_index < q.length; q_index++) {

                while (numtot < 1) {
                    let result = await customsearch.cse.list({
                        auth: config.GoogleApiToken,
                        cx: config.SearchEngineID,
                        q: q[q_index],
                        dateRestrict: "d1",
                        //orTerms:"droga",
                        //filter:0,
                        //siteSearch:
                        start, num, cr, gl, lr
                    })
                    const { queries, items, searchInformation }: any = result.data;
                    if (searchInformation.totalResults < 1) {
                        numtot++
                        continue;
                    }
                    for (let j = 0; j < items.length; j++) {
                        actionType.push({ name: 'processURL', status: 'success' })
                        selfLogLocal.push({ name: "processURL", status: 'success', message: items[j].displayLink })
                        risultante.push(items[j].displayLink);
                    }
                    start = result.data.queries.nextPage[0].startIndex
                    numtot++
                }
                numtot = 0;
                start = 1;
            }

            let siteToAdd = []
            let siteList = []

            await myDataSource.getRepository(SiteList).find().then(list => {
                list.map(el => siteList.push(el.url))
            })

            siteToAdd = addUniqueItems(siteList, risultante)

            siteToAdd = siteToAdd.map(url => ({
                url,
                status: false
            }));

            // trasformo l'array di URL in un array di oggetti SiteList
            const siteListItems: any = siteToAdd.map(item => myDataSource.getRepository(SiteList).create(item));


            // salvo tutti gli oggetti SiteList nel database
            await myDataSource.getRepository(SiteList).save(siteListItems).then(res => {
                actionType.push({ name: 'savedURL', status: 'success' })
                selfLogLocal.push({ name: "savedURL", status: 'success', message: JSON.stringify(res) })
            }).catch((e) => {
                actionType.push({ name: 'savedURL', status: 'failed' })
                selfLogLocal.push({ name: "savedURL", status: 'failed', message: e })
            })

        } catch (e) {
            actionType.push({ name: 'WebSemanticOP', status: 'failed' })
            selfLogLocal.push({ name: "WebSemanticOP", status: 'failed', message: e })
        }

        const end = performance.now()

        actionType = onlyUniqueNameStatus(actionType)
        actionType.forEach(el => {
            var filter = selfLogLocal.filter(element => element.name === el.name && element.status === el.status)
            var message = []
            message = filter.map((items) => items.message).join(', ')
            status.push(log[el.status]({ name: el.name, message: message }))
        })
        status.push(log.finish({ name: `Tempo impiegato: ${((end - start) / 1000 / 60).toFixed(2)} minuti` }))

        await TimeConsumingOpController.createTimeConsumingOp(req, res, { controllerName: "WebSemantic", commandType: "ProcessUrl", status: status })

    }
};

export default WebSemanticController;