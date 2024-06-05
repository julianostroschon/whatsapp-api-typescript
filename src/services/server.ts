import fastify, { FastifyInstance } from "fastify";

import { constructRoutes } from "../routes";
import { env } from "../infra/config";

const opts = {
  port: env.PORT,
  host: env.HOST,
};

export async function buildFastify(clientId: string): Promise<FastifyInstance> {
  const app = fastify({
    logger: true,
  });

  await constructRoutes(app, clientId);

  app.listen(opts, function (err: Error | null): void {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
  return app;
}
