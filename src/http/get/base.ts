import type { RouteOptions } from 'fastify';

export const base: RouteOptions = {
  handler: (_, reply) => {
    reply.send('Hello World');
  },
  method: 'GET',
  url: '/',
};
