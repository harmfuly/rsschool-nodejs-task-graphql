import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import { schema } from './schema.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  const rootValue = {
    memberTypes: () => prisma.memberType.findMany(),
    memberType: ({ id }: { id: string }) => prisma.memberType.findUnique({ where: { id } }),
    users: () => prisma.user.findMany(),
    user: ({ id }: { id: string }) => prisma.user.findUnique({ where: { id } }),
    posts: () => prisma.post.findMany(),
    post: ({ id }: { id: string }) => prisma.post.findUnique({ where: { id } }),
    profiles: () => prisma.profile.findMany(),
    profile: ({ id }: { id: string }) => prisma.profile.findUnique({ where: { id } }),

    createUser: ({ dto }: { dto: any }) => prisma.user.create({ data: dto }),
    createProfile: ({ dto }: { dto: any }) => prisma.profile.create({ data: dto }),
    createPost: ({ dto }: { dto: any }) => prisma.post.create({ data: dto }),
    changePost: ({ id, dto }: { id: string; dto: any }) => prisma.post.update({ where: { id }, data: dto }),
    changeProfile: ({ id, dto }: { id: string; dto: any }) => prisma.profile.update({ where: { id }, data: dto }),
    changeUser: ({ id, dto }: { id: string; dto: any }) => prisma.user.update({ where: { id }, data: dto }),
    deleteUser: async ({ id }: { id: string }) => {
      await prisma.user.delete({ where: { id } });
      return 'User deleted';
    },
    deletePost: async ({ id }: { id: string }) => {
      await prisma.post.delete({ where: { id } });
      return 'Post deleted';
    },
    deleteProfile: async ({ id }: { id: string }) => {
      await prisma.profile.delete({ where: { id } });
      return 'Profile deleted';
    },
  };

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables, operationName } = req.body as {
        query: string;
        variables?: Record<string, any>;
        operationName?: string;
      };

      const result = await graphql({
        schema,
        source: query,
        rootValue,
        variableValues: variables,
        operationName,
        contextValue: { prisma, fastify }
  });
  return result;
},
});
};

export default plugin;
