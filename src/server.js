import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { getEnvVar } from './utils/getEnvVar.js';
// import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { UPLOAD_FILE_DIR } from './constants/index.js';

const PORT = getEnvVar('PORT', 3000);

export const setupServer = () => {
  const app = express();

  // app.use(logger);

  app.use(cors());

  app.use(cookieParser());

  app.use(express.json());

  app.use('/upload', express.static(UPLOAD_FILE_DIR));

  app.use('/auth', authRouter);

  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
