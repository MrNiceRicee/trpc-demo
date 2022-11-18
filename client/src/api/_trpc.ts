import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter as Gateway } from '../../../servers/gateway/src/server';
// import type { AppRouter } from '../../../servers/users/src/server';

export const trpc = createTRPCReact<Gateway>();
