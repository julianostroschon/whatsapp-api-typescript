import fastify from 'fastify';
import { env } from './infra/config';
import { constructRoutes } from './routes';

const opts = {
  port: env.PORT,
  host: env.HOST
};

(async (): Promise<void> => {
  const app = fastify({
    logger: true,
  });
  const [,clientId] = process.argv.join(' ').split('--client ');
  
  await constructRoutes(app, clientId);

  app.listen(opts, function (err: Error | null): void {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
})();
