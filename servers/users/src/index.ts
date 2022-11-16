import express from 'express';
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';

const main = async () => {
  const app = express();
  app.use(cors());

  app.get('/health', (req, res) => {
    res.send('ok');
  });

  // logger
  app.use((req, res, next) => {
    console.log('✍🏽 user request', {
      method: req.method,
      url: req.url,
      path: req.path,
      body: req.body,
      query: req.query,
    });
    next();
  });

  // TODO: create router & createContext
  app.use('/api', trpcExpress.createExpressMiddleware({
    
  }));

  app.listen(8081, () => {
    console.log('🚀 user server started');
  });
};
