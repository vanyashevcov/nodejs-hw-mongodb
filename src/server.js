import express from 'express';
import cors from 'cors';
import { logger } from './middlewares/logger.js';
import { notFoundHndler } from './middlewares/notFoundHndler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import contactsRouter from './routers/contacts.js';
import { getEnvVar } from './utils/getEnvVar.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  // app.use(logger);

  app.use('/contacts', contactsRouter);

  app.use(notFoundHndler);

  app.use(errorHandler);

  const port = Number(getEnvVar('PORT', 3000));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
