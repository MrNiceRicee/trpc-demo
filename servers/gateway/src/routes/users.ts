import { Router } from 'express';
import httpProxy from 'http-proxy';
import { env } from '../config/env';

const proxy = httpProxy.createProxyServer();
const userRouter = Router();

// api calls
userRouter.all('/api/users*', (req, res) => {
  console.log(
    '🚗',
    'Proxying request to users server',
    `${env.SERVICE_USERS_URL}${req.url}`
  );
  proxy.web(req, res, {
    target: `${env.SERVICE_USERS_URL}`,
  });
});
// trpc calls
userRouter.all('/api/trpc/users*', (req, res) => {
  console.log(
    '🚗',
    'Proxying request to users server',
    `${env.SERVICE_USERS_URL}${req.url}`
  );
  proxy.web(req, res, {
    target: `${env.SERVICE_USERS_URL}`,
  });
});

export { userRouter };
