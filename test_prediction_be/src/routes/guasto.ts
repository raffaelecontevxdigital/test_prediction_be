import { Router } from "express";
import GuastoController from "../controllers/GuastoController";
import { checkJwt } from "../middlewares/checkJwt";



const router = Router();

//nuova Guasto
router.post("/", /* [checkJwt], */ GuastoController.create);

//modifica Guasto
router.put("/", /* [checkJwt], */ GuastoController.edit);

//elimina Guasto
router.delete("/", [checkJwt], GuastoController.delete);

//leggi Guasto
router.get("/", /* [checkJwt], */ GuastoController.get);

export default router;