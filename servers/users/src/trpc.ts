import { initTRPC, TRPCError, inferAsyncReturnType } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { OpenApiMeta } from 'trpc-openapi';
import { prisma } from '../../../db/index';
import { env } from './config/env';

export const createContext = async ({
  req, // express request
  res, // express response
}: CreateExpressContextOptions) => {
  const getUser = () => {
    const userInfo = {
      token: '',
      name: 'guest',
    };
    if (req.headers.authorization?.startsWith('Bearer ')) {
      const token = req.headers.authorization.split(' ')[1];
      if (['', null, undefined, 'null', 'undefined'].includes(token)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Unauthorized',
        });
      }
      userInfo.token = token;
    }
    const name = req.headers['x-user-name'] as string;
    if (name) {
      userInfo.name = name;
    }
    return userInfo;
  };

  return {
    user: getUser(),
    prisma,
    req,
    res,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC
  .meta<OpenApiMeta>()
  .context<Context>()
  .create({
    errorFormatter: ({ error, shape }) => {
      if (
        error.code === 'INTERNAL_SERVER_ERROR' &&
        env.NODE_ENV === 'production'
      ) {
        return {
          ...shape,
          message: 'Internal server error',
        };
      }
      return shape;
    },
  });

// middleware
const isAuthed = t.middleware(async ({ next, ctx }) => {
  if (!ctx.user.token) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  const findUser = async () => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.user.token,
      },
      select: {
        id: true,
        name: true,
      },
    });
    if (!user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return user;
  };
  const user = await findUser();
  return next({
    ctx: {
      ...ctx,
      user: {
        token: user.id,
        name: user.name,
      },
    },
  });
});

export const router = t.router;
/**
 * Unprotected procedure
 */
export const publicProcedure = t.procedure;

/**
 * Protected procedure
 */
export const protectedProcedure = t.procedure.use(isAuthed);
