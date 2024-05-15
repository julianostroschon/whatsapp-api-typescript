import fastify from 'fastify';
import { constructRoutes } from './http';
import { env } from './infra/config';

const port = Number(env.PORT) || 3001;
const host = env.HOST || `0.0.0.0`;

const app = fastify({
  ignoreDuplicateSlashes: true,
  ignoreTrailingSlash: true,
  logger: true,
});

constructRoutes(app);

app.listen({ host, port }, function (err: Error | null): void {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
