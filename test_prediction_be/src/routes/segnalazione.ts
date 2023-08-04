import { Router } from "express";
import SegnalazioneController from "../controllers/SegnalazioneController";
import { checkJwt } from "../middlewares/checkJwt";



const router = Router();

//nuova Segnalazione
router.post("/", /* [checkJwt], */ SegnalazioneController.create);

//modifica Segnalazione
router.put("/", /* [checkJwt], */ SegnalazioneController.edit);

//elimina Segnalazione
router.delete("/", [checkJwt], SegnalazioneController.delete);

//leggi Segnalazione
router.get("/", /* [checkJwt], */ SegnalazioneController.get);

export default router;