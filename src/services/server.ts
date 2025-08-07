import fastify, { FastifyInstance } from "fastify";

import { Logger } from "winston";
import { cfg } from "../infra/config";
import { constructRoutes } from "../routes";

const opts = {
  port: cfg.PORT,
  host: cfg.HOST,
};

export async function buildFastify(logger: Logger): Promise<FastifyInstance> {
  const app = fastify({
    logger: true,
  });

  await constructRoutes(app, logger);


  app.listen(opts, function (err: Error | null): void {
    app.log.info(`Server listening on ${opts.host}:${opts.port}`);
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
  return app;
}
