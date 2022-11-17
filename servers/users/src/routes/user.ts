import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, router, publicProcedure } from '../trpc';

const userRouter = router({
  getUser: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/users/{username}',
        summary: 'Get user info',
        description: 'Get user info',
        tags: ['users'],
      },
    })
    .input(
      z.object({
        username: z.string(),
      })
    )
    .output(
      z.object({
        name: z.string(),
        username: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
        select: {
          name: true,
          username: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
        });
      }
      return user;
    }),
  createUser: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/users',
        summary: 'Create user',
        description: 'Create user',
        protect: true,
        tags: ['users'],
      },
    })
    .input(
      z.object({
        name: z
          .string()
          .max(50)
          .refine((v) => !v.includes(' '), {
            message: 'Name cannot contain spaces',
          })
          .refine((v) => !v.match(/[^a-zA-Z0-9]/), {
            message: 'Name cannot contain special characters',
          }),
        username: z
          .string()
          .max(50)
          // regex for special characters
          .refine((v) => !v.match(/[^a-zA-Z0-9 ]/), {
            message: 'Username cannot contain special characters',
          }),
      })
    )
    .output(
      z.object({
        name: z.string(),
        username: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // check if username exists
      const checkUnique = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
        select: {
          id: true,
        },
      });
      if (checkUnique) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Username already exists. Please choose another username.',
        });
      }
      const user = await ctx.prisma.user.create({
        data: {
          name: input.name,
          username: input.username,
        },
        select: {
          name: true,
          username: true,
        },
      });
      return user;
    }),
  updateUser: protectedProcedure
    .meta({
      openapi: {
        method: 'PUT',
        path: '/users',
        summary: 'Update user',
        description: 'Update user',
        protect: true,
        tags: ['users'],
      },
    })
    .input(
      z.object({
        name: z
          .string()
          .max(50)
          .refine((v) => !v.includes(' '), {
            message: 'Name cannot contain spaces',
          })
          .refine((v) => !v.match(/[^a-zA-Z0-9]/), {
            message: 'Name cannot contain special characters',
          }),
        username: z
          .string()
          .max(50)
          // regex for special characters
          .refine((v) => !v.match(/[^a-zA-Z0-9 ]/), {
            message: 'Username cannot contain special characters',
          }),
      })
    )
    .output(
      z.object({
        name: z.string(),
        username: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const checkUnique = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
        select: {
          id: true,
        },
      });
      if (checkUnique && checkUnique.id !== ctx.user.token) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Username already exists. Please choose another username.',
        });
      }

      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.user.token,
        },
        data: {
          name: input.name,
          username: input.username,
        },
        select: {
          name: true,
          username: true,
        },
      });
      return user;
    }),
  getUsers: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/users',
        summary: 'Get users',
        description: 'Get users',
        tags: ['users'],
      },
    })
    .output(
      z.object({
        users: z.array(
          z.object({
            name: z.string(),
            username: z.string(),
          })
        ),
      })
    )
    .input(
      z.object({
        name: z.string().optional(),
        username: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const users = await ctx.prisma.user.findMany({
        where: {
          name: {
            contains: input.name,
          },
          username: {
            contains: input.username,
          },
        },
        select: {
          name: true,
          username: true,
        },
      });
      return {
        users,
      };
    }),
});

export default userRouter;
