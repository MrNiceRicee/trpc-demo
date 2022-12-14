import { router } from './trpc';
import userRouter from './routes/user';

export const appRouter = router({
  users: userRouter,
});

export type AppRouter = typeof appRouter;
