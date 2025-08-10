import { cfg } from "@/infra/config";
import { parentLogger } from "@/infra/logger";
import fastify, { FastifyInstance } from "fastify";
import { constructRoutes } from "./routes";

export async function buildFastify(): Promise<FastifyInstance> {
  const app = fastify();
  const logger = parentLogger.child({ service: 'API' });

  await constructRoutes(app, logger);

  app.listen({ port: cfg.PORT, host: cfg.HOST }, (err) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    logger.info(`🌐 Server listening on http://${cfg.HOST}:${cfg.PORT}`);
  });

  return app;
}