import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import { env } from './config/env';
import { userRouter } from './routes/users';

const main = async () => {
  const app = express();
  app.use(cors());

  app.get('/health', (req, res) => {
    res.send('🤖 ok');
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

  app.use(userRouter);

  app.use((req, res) => {
    res.status(501).send('😭 Not implemented');
  });

  app.listen(env.PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${env.PORT}`);
  });
};

main();
