import bodyParser from 'body-parser';
import express from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import router from './router';

createConnection()
  .then(async () => {
    const app = express();
    app.use(bodyParser.json());

    app.use('/api', router);

    const port = process.env.PORT || 3001;
    app.listen(port, () => console.log(`Server is listening on port: ${port}`));
  })
  .catch(console.error);
