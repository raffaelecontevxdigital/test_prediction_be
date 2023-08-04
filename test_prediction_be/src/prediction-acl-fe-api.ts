import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import * as cors from 'cors';
import routes from './routes';
import { join, resolve } from 'path';

async function startWebServices(config: any) {
    // Create a new express application instance
    const app = express();

    // Call midlewares
    app.use(
        cors({
            exposedHeaders: ['token']
        })
    );
    app.use(helmet());
    app.use(bodyParser.json({
        limit: '50mb'
    }));
    const ormBase = (path:any) => join(resolve(__dirname), path);
    const STATIC_PATH = ormBase('public')
    app.use(express.static(STATIC_PATH));

    //Set all routes from routes folder
    app.use('/', routes);

    const listeningPort = await new Promise((resolve) =>
        app.listen(process.env.APP_PORT || '3001', () => resolve(process.env.APP_PORT || '3001'))
    );
    app.set('etag', false)

    console.log(`WebService STARTED on port ${listeningPort}`);
    return app;
}


export async function startDb(config: any) {
    config
        .initialize()
        .then(() => {
            console.log("Data Source has been initialized!")
        })
        .catch((err) => {
            console.error("Error during Data Source initialization:", err)
        })

    console.log('DB STARTED');
}

export async function start(config: any) {
    const db = await startDb(config);
    const app = await startWebServices(config);
    

    console.log('BRUN-BACKEND STARTED');
}
