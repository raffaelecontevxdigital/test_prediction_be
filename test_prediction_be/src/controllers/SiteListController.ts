import { Request, Response } from "express";
import { SiteList } from "../entity/SiteList";
import { myDataSource } from "../config/config";
import DnsServerController from "./DnsServerController";


class BlacklistController {

    static create = async (req: Request, res: Response) => {



        let blacklist = new SiteList();
        blacklist.url = req.body.url;
        blacklist.status = req.body.status;
        blacklist.createAt = new Date()

        if (blacklist.status) {
            await DnsServerController.callApi('POST', { domains: [req.body.url] }).then(async (resp) => {
                await myDataSource.getRepository(SiteList).save(blacklist).then(bl => {
                    res.status(200).send(bl);
                }).catch(e => {
                    res.status(500).send(e);
                })
            }).catch((e) => {
                res.status(500).send(e);
            })
        } else {
            await myDataSource.getRepository(SiteList).save(blacklist).then(async (bl) => {
                res.status(200).send(bl);
            }).catch(e => {
                res.status(500).send(e);
            })
        }



    }

    static edit = async (req: Request, res: Response) => {



        let idBlacklist: number = parseInt(req.query.id.toString());

        await myDataSource.getRepository(SiteList).findOneOrFail({ where: { id: idBlacklist } })
            .then(async blacklist => {
                if (blacklist.status && blacklist.url !== req.body.url) {
                    await DnsServerController.callApi('PUT', { old_domain: blacklist.url, new_domain: req.body.url }).then(async (resp) => {
                        blacklist.url = req.body.url;
                        blacklist.status = req.body.status;
                        blacklist.updateAt = new Date()
                        await myDataSource.getRepository(SiteList).save(blacklist).then(() => {
                            res.status(200).send(blacklist);
                        }).catch((e) => {
                            res.status(500).send(e);
                        })
                    }).catch((e) => {
                        res.status(500).send(e);
                    })
                } else {
                    blacklist.url = req.body.url;
                    blacklist.status = req.body.status;
                    blacklist.updateAt = new Date()
                    await myDataSource.getRepository(SiteList).save(blacklist);
                    res.status(200).send(blacklist);
                }
            }).catch(e => {
                res.status(500).send(e);
            })

    }

    static delete = async (req: Request, res: Response) => {

        try {

            let idBlacklist: any = req.query.id.toString().split(',');
            let result = [];
            let exception = []

            const blacklistRepository = myDataSource.getRepository(SiteList);
            for (const id of idBlacklist) {
                await blacklistRepository.findOneOrFail({ where: { id: id } })
                    .then(async blacklist => {
                        if (blacklist.status) {
                            await DnsServerController.callApi('DELETE', { domain: blacklist.url }).then(async (resp) => {
                                result.push('Site Deleted On Server');
                                await blacklistRepository.delete(id).then(resp => {
                                    result.push('Site Deleted');
                                }).catch((e) => {
                                    exception.push('Site Not deleted Deleted');
                                })
                            }).catch((e) => {
                                exception.push('Site Not deleted Deleted On Server');
                            })
                        } else {
                            await blacklistRepository.delete(id).then(resp => {
                                result.push('Site Deleted');
                            }).catch((e) => {
                                exception.push('Site Not deleted Deleted');
                            })
                        }
                    }).catch((e) => {
                        exception.push('Site Not Found');
                    })
            }
            if (exception.length > 0) {
                res.status(501).send(exception);
            } else {
                res.status(200).send(result);
            }
        } catch (e) {
            res.status(500).send(e);
        }

    }

    static get = async (req: Request, res: Response) => {


        try {
            const blacklistRepository = await myDataSource.getRepository(SiteList);

            if (req.query.id != undefined) {

                let id: number = parseInt(req.query.id.toString());

                blacklistRepository.findOne({ where: { id: id } })
                    .then(corp => {
                        res.status(200).send(corp);
                    })

            } else {
                blacklistRepository.find()
                    .then(corp => {
                        res.status(200).send(corp);
                    });
            }

        } catch (errore) {
            res.status(500).send(errore)
        }

    }

    static sync = async (req: Request, res: Response) => {


        try {
            const blacklistRepository = await myDataSource.getRepository(SiteList);

            let result = [];
            let exception = []

            blacklistRepository.find()
                .then(async (corp) => {
                    await DnsServerController.callApi('GET', {}).then(async (resp: any) => {
                        res.status(200).send('Operazione presa in carico');
                        let localSites = []
                        let serverSites = resp.data.domains

                        corp.map(el => el.status ? localSites.push(el.url) : null)

                        // Filtra i siti server che non sono presenti nei siti locali
                        const sitesToAdd = serverSites.filter(serverSite => !localSites.includes(serverSite));

                        // Filtra i siti locali che non sono presenti nei siti server
                        const sitesToRemove = localSites.filter(localSite => !serverSites.includes(localSite));

                        // Aggiungi i nuovi siti al db (è necessario definire la logica di aggiunta al db)
                        for (const site of sitesToAdd) {
                            let blacklist = new SiteList();
                            blacklist.url = site;
                            blacklist.status = true;
                            blacklist.createAt = new Date()
                            await myDataSource.getRepository(SiteList).save(blacklist).then(() => {
                                result.push('Site Added');
                            }).catch((e) => {
                                exception.push('Site Not Added');
                            })
                        }

                        // Rimuovi i siti non più presenti nei serverSites dal db (è necessario definire la logica di rimozione dal db)
                        for (const site of sitesToRemove) {
                            await blacklistRepository.findOneOrFail({ where: { url: site } })
                                .then(async blacklist => {
                                    await blacklistRepository.delete(blacklist.id).then(() => {
                                        result.push('Site Removed');
                                    }).catch((e) => {
                                        exception.push('Site Not Removed');
                                    })
                                }).catch((e) => {
                                    exception.push('Site Not Found');
                                })
                        }

                    }).catch((e) => {
                        exception.push('Site Not Found On Server');
                    })
                    /* res.status(200).send(corp); */
                }).catch((e) => {
                    res.status(500).send(e)
                })

            if (exception.length > 0) {
                console.log(exception);
            }

        } catch (errore) {
            res.status(500).send(errore)
        }

    }
};

export default BlacklistController;