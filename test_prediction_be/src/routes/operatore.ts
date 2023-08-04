import { Router } from "express";
import OperatoreController from "../controllers/OperatoreController";
import { checkJwt } from "../middlewares/checkJwt";



const router = Router();

//nuova Operatore
router.post("/", [checkJwt], OperatoreController.create);

//modifica Operatore
router.put("/", [checkJwt], OperatoreController.edit);

//elimina Operatore
router.delete("/", [checkJwt], OperatoreController.delete);

//leggi Operatore
router.get("/", [checkJwt], OperatoreController.get);

export default router;