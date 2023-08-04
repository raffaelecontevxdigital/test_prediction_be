import { DataSource } from "typeorm"
import { join, resolve } from 'path';

const ormBase = (path: any) => join(resolve(__dirname + '/../'), path);
const MIGRATION_PATH = ormBase('migration/*{.ts,.js}');
const EMAIL_TEMPLATE_LOCATION = ormBase('public/emailtemplate/index.html')

export const myDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [ormBase("entity/*{.ts,.js}")],
  logging: true,
  synchronize: true,
  migrationsRun: true,
  migrations: [MIGRATION_PATH]
})

export default {
  jwtSecret: '@QEGTUI',
  component_name: 'prediction_be_acl-fe-api',
  MAIL_SETTINGS: {
    "pool": "true",
    "host": "smtp.mail.us-east-1.awsapps.com",
    "port": "465",
    "secure": "true",
    "auth": {
      "user": "operatore@prediction-web.it",
      "password": "Password1!"
    },
    "header_host": "segreteria.rispondoio.it/api",
    "sender": "operatore@prediction-web.it",
  },
  GoogleApiToken: "AIzaSyCXAIcZGgJ5WtO1EwBLSwuVkYEblYcNx1Y",
  SearchEngineID: "b737aea02ae1944f1",
  KEY: Buffer.from('dc6383c9f2cf660e97f110a1cb832d59636de7451170d1114584f209afaed836', 'hex')
};

