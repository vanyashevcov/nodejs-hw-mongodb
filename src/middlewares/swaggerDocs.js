import { readFileSync, existsSync  } from 'node:fs';
import swaggerUI from 'swagger-ui-express';

import { SWAGGER_PATH } from '../constants/index.js';

// export const swaggerDocs = () => {
//   try {
//     const swaggerDoc = JSON.parse(readFileSync(SWAGGER_PATH).toString());
//     return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
//   } catch {
//     return (req, res) => {
//       res.status(500).json({
//         message: 'Can`t load swagger docs',
//       });
//     };
//   }
// };

export const swaggerDocs = () => {
  try {
    if (!existsSync(SWAGGER_PATH)) {
      throw new Error(`Swagger file not found at ${SWAGGER_PATH}`);
    }

    const swaggerDoc = JSON.parse(readFileSync(SWAGGER_PATH, 'utf-8'));
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch (error) {
    console.error('Swagger loading error:', error.message);
    return (req, res) => {
      res.status(500).json({
        message: 'Can`t load swagger docs',
        error: error.message,
      });
    };
  }
};
