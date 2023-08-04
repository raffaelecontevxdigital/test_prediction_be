import { Router } from "express";
import GenitoreController from "../controllers/GenitoreController";
import { checkJwt } from "../middlewares/checkJwt";



const router = Router();

//nuova Genitore
router.post("/", /* [checkJwt], */ GenitoreController.create);

//modifica Genitore
router.put("/", [checkJwt], GenitoreController.edit);

//elimina Genitore
router.delete("/", [checkJwt], GenitoreController.delete);

//leggi Genitore
router.get("/", [checkJwt], GenitoreController.get);

export default router;