import { Router } from "express";
import auth from "./auth";
import siteList from "./siteList";
import figlio from "./figlio";
import genitore from "./genitore";
import guasto from "./guasto";
import operatore from "./operatore";
import parola from "./parola";
import segnalazione from "./segnalazione";
import tentativoAccesso from "./tentativoAccesso";
import webSemantic from "./webSemantic";
import timeconsumingop from "./timeconsumingop";

const routes = Router();

routes.use("/auth", auth);
routes.use("/siteList", siteList);
routes.use("/figlio", figlio);
routes.use("/genitore", genitore);
routes.use("/guasto", guasto);
routes.use("/operatore", operatore);
routes.use("/parola", parola);
routes.use("/segnalazione", segnalazione);
routes.use("/tentativoAccesso", tentativoAccesso);
routes.use("/webSemantic", webSemantic);
routes.use("/timeconsumingop", timeconsumingop);


export default routes;
