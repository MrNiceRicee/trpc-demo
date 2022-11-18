import { router } from './trpc';
import postRouter from './routes/post';

export const appRouter = router({
  posts: postRouter,
});

export type AppRouter = typeof appRouter;
