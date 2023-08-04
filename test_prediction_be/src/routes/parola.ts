import { Router } from "express";
import ParolaController from "../controllers/ParolaController";
import { checkJwt } from "../middlewares/checkJwt";



const router = Router();

//nuova Parola
router.post("/", [checkJwt], ParolaController.create);

//modifica Parola
router.put("/", [checkJwt], ParolaController.edit);

//elimina Parola
router.delete("/", [checkJwt], ParolaController.delete);

//leggi Parola
router.get("/", [checkJwt], ParolaController.get);

export default router;