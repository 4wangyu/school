import * as bodyParser from 'body-parser';
import * as express from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import router from './router';

createConnection()
  .then(async () => {
    const app = express();
    app.use(bodyParser.json());

    app.use('/api', router);

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server is listening on port: ${port}`));
  })
  .catch(console.error);
