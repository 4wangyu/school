import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import router from './router';

createConnection()
  .then(async () => {
    const app = express();
    app.use(bodyParser.json());

    app.use('/api', router);

    app.use('*', (req: Request, res: Response) => {
      res.status(404).json({ message: 'Not found' });
    });

    const port = process.env.PORT || 3001;
    app.listen(port, () => console.log(`Server is listening on port: ${port}`));
  })
  .catch(console.error);
