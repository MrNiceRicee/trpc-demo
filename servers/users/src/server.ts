import { router } from './trpc';
import userRouter from './routes/user';
import postRouter from './routes/post';

export const appRouter = router({
  user: userRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
