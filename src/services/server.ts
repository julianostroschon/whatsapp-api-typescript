import fastify, { FastifyInstance } from "fastify";

import { cfg } from "@/infra/config";
import { parentLogger } from "@/infra/logger";
import { constructRoutes } from "@/routes";

const opts = {
  port: cfg.PORT,
  host: cfg.HOST,
};

export async function buildFastify(): Promise<FastifyInstance> {
  const app = fastify();
  const logger = parentLogger.child({ module: 'routes' });

  await constructRoutes(app, logger);

  app.listen(opts, function (err: Error | null): void {
    logger.info(`Server listening on ${opts.host}:${opts.port}`);
    if (err) {
      logger.error(err);
      process.exit(1);
    }
  });
  return app;
}
