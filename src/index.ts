import fastify from 'fastify';
import { env } from './infra/config';
import { constructRoutes } from './routes';

const port = env.PORT;
const host = env.HOST;

(async (): Promise<void> => {
  const app = fastify({
    logger: true,
  });
  await constructRoutes(app);

  app.listen({ host, port }, function (err: Error | null): void {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
})();
