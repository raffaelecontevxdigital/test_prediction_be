import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

//login
router.post("/", AuthController.login);

//validate otp
router.post("/validateotp", AuthController.validateOtp);

//validate recaptcha
router.post("/validaterecaptcha", AuthController.checkRecaptcha);

//rigenerate otp
router.post("/rigenerateotp", AuthController.rigenerateMailOtp);

//change password
router.put("/", [checkJwt], AuthController.changePassword);
//change password from password recovery
router.put("/changepwd", [checkJwt], AuthController.changeLostPassword);


//generate temporary token
router.put("/forgotpwd", AuthController.generateTemporaryToken);

//check token
router.get("/checktoken", AuthController.checkToken)


//
export default router;