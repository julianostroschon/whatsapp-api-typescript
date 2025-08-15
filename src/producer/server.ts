import fastify, { FastifyInstance } from "fastify";
import { cfg } from "../infra/config";
import { parentLogger } from "../infra/logger";
import { constructRoutes } from "./routes";

export async function buildFastify(): Promise<FastifyInstance> {
  const app = fastify();
  const logger = parentLogger.child({ service: 'API' });

  // Adicionar uma rota de teste simples
  app.get('/', async () => {
    return { hello: 'world' };
  });

  await constructRoutes(app, logger);

  app.listen({ port: cfg.PORT }, (err) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    logger.info(`🌐 Server listening on port:${cfg.PORT}`);
  });

  return app;
}