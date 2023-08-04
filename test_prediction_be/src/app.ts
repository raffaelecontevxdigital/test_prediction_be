
import { myDataSource } from './config/config';
import { start } from './prediction-acl-fe-api';


start(myDataSource).then(app => console.log('APP started!'))
