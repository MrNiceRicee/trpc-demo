import { ZodError } from 'zod';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  const getUserAuth = () => {
    const userInfo = {
      token: '',
      name: 'guest',
    };
    if (req.headers.authorization?.startsWith('Bearer ')) {
      const token = req.headers.authorization.split(' ')[1];
      userInfo.token = token;
    }
    const name = req.headers['x-user-name'] as string;
    if (name) {
      userInfo.name = name;
    }
    return userInfo;
  };

  return {
    req,
    res,
    user: getUserAuth(),
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
