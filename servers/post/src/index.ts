import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createOpenApiExpressMiddleware } from 'trpc-openapi';
import swaggerUi from 'swagger-ui-express';
import { openApiDocument } from './openApi';
import { createContext } from './trpc';
import { appRouter } from './server';
import { env } from './config/env';

const main = async () => {
  const app = express();
  app.use(cors());

  app.get('/health', (req, res) => {
    res.send('ok');
  });

  // logger
  app.use((req, res, next) => {
    if (env.NODE_ENV !== 'development') {
      return next();
    }
    const start = Date.now();
    console.log(
      '📥',
      `${req.method} ${req.url} ${
        req.body ? JSON.stringify(req.body) : JSON.stringify(req.query)
      }`
    );
    next();
    console.log(`${res.statusCode >= 400 ? '😢' : '🔥'}`, {
      status: res.statusCode,
      time: `${Date.now() - start}ms`,
    });
  });

  // handle incoming tRPC request
  app.use(
    '/api/trpc',
    createExpressMiddleware({
      createContext,
      router: appRouter,
    })
  );
  // handle incoming OpenAPI request
  app.use(
    '/api/posts',
    createOpenApiExpressMiddleware({
      createContext,
      router: appRouter,
    })
  );

  app.use('/', swaggerUi.serve);
  app.get('/', swaggerUi.setup(openApiDocument));

  app.use((req, res) => {
    res.status(501).send('😭 Not implemented');
  });

  app.listen(env.PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${env.PORT}`);
  });
};

main();
