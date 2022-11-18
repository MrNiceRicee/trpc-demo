import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

import {
  AppRouter as UserRouter,
  appRouter as userRouter,
} from '../../users/src/server';
import {
  AppRouter as PostRouter,
  appRouter as postRouter,
} from '../../post/src/server';

// const appRouter = t.router({
//   users: userRouter,
//   posts: postRouter,
// });
// const appRouter = {...userRouter, ...postRouter};
export type AppRouter = UserRouter & PostRouter;
// export type AppRouter = typeof appRouter;
