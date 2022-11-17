import { z } from 'zod';
import { protectedProcedure } from '../../trpc';

const createPost = protectedProcedure
  .meta({
    openapi: {
      method: 'POST',
      path: '/posts',
      summary: 'Create post',
      description: 'Create post',
      protect: true,
      tags: ['posts'],
    },
  })
  .input(
    z.object({
      content: z.string(),
    })
  )
  .output(
    z.object({
      id: z.string(),
      content: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      author: z.object({
        name: z.string(),
        username: z.string(),
      }),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const post = await ctx.prisma.post.create({
      data: {
        content: input.content,
        authorId: ctx.user.token,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    });
    return post;
  });

export default createPost;
