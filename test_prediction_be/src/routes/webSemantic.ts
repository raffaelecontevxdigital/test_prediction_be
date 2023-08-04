import { Router } from "express";
import WebSemantic from "../controllers/WebSemanticController";
import { checkJwt } from "../middlewares/checkJwt";



const router = Router();

router.post("/", [checkJwt], WebSemantic.create);

export default router;