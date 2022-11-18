import { z } from 'zod';
import { publicProcedure } from '../../trpc';

// get all post using cursor pagination, limit 25 per page using prisma

const encodeCursor = (cursor: string) => Buffer.from(cursor).toString('base64');
const decodeCursor = (cursor: string) => Buffer.from(cursor, 'base64').toString('ascii');

const viewAll = publicProcedure
  .meta({
    openapi: {
      method: 'GET',
      path: '/',
      summary: 'Get all posts',
      description: 'Get all posts',
      tags: ['posts'],
    },
  })
  .input(
    z.object({
      cursor: z.string().optional(),
    })
  )
  .output(
    z.object({
      data: z.array(
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
      ),
      cursor: z.string().optional(),
    })
  )
  .query(async ({ input, ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      where: {
        id: {
          gt: input.cursor ? decodeCursor(input.cursor) : undefined,
        },
      },
      take: 25,
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
    const cursor = posts.length > 0 ? encodeCursor(posts[0].id) : undefined;

    return {
      data: posts,
      cursor,
    };
  });

export default viewAll;
