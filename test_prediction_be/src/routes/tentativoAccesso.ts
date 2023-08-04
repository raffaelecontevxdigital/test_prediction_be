import { Router } from "express";
import TentativoAccesso from "../controllers/TentativoAccessoController";
import { checkJwt } from "../middlewares/checkJwt";



const router = Router();

router.post("/", TentativoAccesso.create);

router.get("/", [checkJwt], TentativoAccesso.get);

export default router;