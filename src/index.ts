import * as bodyParser from 'body-parser';
import * as express from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';

createConnection()
  .then(async () => {
    const app = express();
    app.use(bodyParser.json());

    app.listen(3000);

    console.log('Express server has started on port 3000.');
  })
  .catch(console.error);
