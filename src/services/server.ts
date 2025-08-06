import fastify, { FastifyInstance } from "fastify";

import { env } from "../infra/config";
import { constructRoutes } from "../routes";

const opts = {
  port: env.PORT,
  host: env.HOST,
};

export async function buildFastify(): Promise<FastifyInstance> {
  const app = fastify({
    logger: true,
  });

  await constructRoutes(app);

  app.listen(opts, function (err: Error | null): void {
    app.log.info(`Server listening on ${opts.host}:${opts.port}`);
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
  return app;
}
