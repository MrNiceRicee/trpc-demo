import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';

const t = initTRPC.context<Context>().create({
  errorFormatter: ({ error, shape }) => {
    if (error instanceof TRPCError) {
      return {
        code: error.code,
        message: error.message,
        shape,
      };
    }
    return {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
      shape: 'unknown',
    };
  },
});

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user.token) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: 'session',
    },
  });
});

export const middleware = t.middleware;
export const router = t.router;

/**
 * Unprotected procedure
 */
export const publicProcedure = t.procedure;

/**
 * Protected procedure
 */
export const protectedProcedure = t.procedure.use(isAuthed);
