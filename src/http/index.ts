import type { FastifyInstance } from 'fastify';
import { routes } from './routes';

export const constructRoutes = (app: FastifyInstance): void => {
  routes.forEach(async (route): Promise<void> => {
    app.route(route);
  });
};
