import { Router } from "express";
import TimeConsumingOpController from "../controllers/TimeConsumingOpController";
import { checkJwt } from "../middlewares/checkJwt";



const router = Router();

//nuova TimeConsumingOp
router.post("/", [checkJwt], TimeConsumingOpController.createTimeConsumingOp);

//leggi TimeConsumingOp
router.get("/", [checkJwt], TimeConsumingOpController.readTimeConsumingOp);




export default router;