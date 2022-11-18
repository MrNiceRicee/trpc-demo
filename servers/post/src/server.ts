import { router } from './trpc';
import postRouter from './routes/post';

// trpc
//    '/api/trpc.posts.'
// api 
// '/api/posts/'
export const appRouter = router({
  posts: postRouter,
});

export type AppRouter = typeof appRouter;
