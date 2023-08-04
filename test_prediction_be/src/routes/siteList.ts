import { Router } from "express";
import SiteListController from "../controllers/SiteListController";
import { checkJwt } from "../middlewares/checkJwt";



const router = Router();

//nuova SiteList
router.post("/", [checkJwt], SiteListController.create);

//modifica SiteList
router.put("/", [checkJwt], SiteListController.edit);

//elimina SiteList
router.delete("/", [checkJwt], SiteListController.delete);

//leggi SiteList
router.get("/", [checkJwt], SiteListController.get);

//leggi SiteList
router.get("/sync", [checkJwt], SiteListController.sync);

export default router;