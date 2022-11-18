import { Router } from 'express';
import httpProxy from 'http-proxy';
import { env } from '../config/env';

const proxy = httpProxy.createProxyServer();
const postRouter = Router();

// api calls
postRouter.all('/api/posts*', (req, res) => {
  console.log(
    '🚗',
    'Proxying request to post server',
    `${env.SERVICE_POSTS_URL}${req.url}`
  );
  proxy.web(req, res, {
    target: `${env.SERVICE_POSTS_URL}`,
  });
});
// trpc calls
postRouter.all('/api/trpc/posts*', (req, res) => {
  console.log(
    '🚗',
    'Proxying request to users server',
    `${env.SERVICE_POSTS_URL}${req.url}`
  );
  proxy.web(req, res, {
    target: `${env.SERVICE_POSTS_URL}`,
  });
});

export { postRouter };
