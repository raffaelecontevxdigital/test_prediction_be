import { Router } from "express";
import FiglioController from "../controllers/FiglioController";
import { checkJwt } from "../middlewares/checkJwt";



const router = Router();

//nuova Figlio
router.post("/", /* [checkJwt], */ FiglioController.create);

//modifica Figlio
router.put("/", [checkJwt], FiglioController.edit);

//elimina Figlio
router.delete("/", [checkJwt], FiglioController.delete);

//leggi Figlio
router.get("/", [checkJwt], FiglioController.get);

export default router;