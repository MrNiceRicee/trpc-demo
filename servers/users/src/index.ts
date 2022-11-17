import express from 'express';
import cors from 'cors';
import { createOpenApiExpressMiddleware } from 'trpc-openapi';
import swaggerUi from 'swagger-ui-express';
import { openApiDocument } from './openApi';
import { createContext } from './trpc';
import { appRouter } from './server';

const PORT = process.env.PORT || 8081;

const main = async () => {
  const app = express();
  app.use(cors());

  app.get('/health', (req, res) => {
    res.send('ok');
  });

  // logger
  app.use((req, res, next) => {
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
    createOpenApiExpressMiddleware({
      createContext,
      router: appRouter,
    })
  );
  // handle incoming OpenAPI request
  app.use(
    '/api',
    createOpenApiExpressMiddleware({
      createContext,
      router: appRouter,
    })
  );

  app.use('/', swaggerUi.serve);
  app.get('/', swaggerUi.setup(openApiDocument));

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  });
};

main();
