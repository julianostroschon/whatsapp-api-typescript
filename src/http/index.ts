import type { FastifyInstance } from 'fastify';
import { routes } from './routes';

export const constructRoutes = (app: FastifyInstance): void => {
  routes.forEach((route): void => {
    app.route(route);
  });
};
