import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { OpenApiMeta } from 'trpc-openapi';
import { appRouter as userRouter } from '../../users/src/server';

const t = initTRPC
  .context<any>()
  .meta<OpenApiMeta>()
  .create({
    errorFormatter: ({ error, shape }) => {
      return shape;
    },
  });

export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions) => {
  return { req, res };
};

export type Context = inferAsyncReturnType<typeof createContext>;

export const appRouter = t.router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
