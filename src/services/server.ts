import fastify, { FastifyInstance } from "fastify";

import { constructRoutes } from "@src/routes";
import { env } from "../infra/config";
import { getClient, startWhatsApp } from "./whatsapp";

const opts = {
  port: env.PORT,
  host: env.HOST,
};

export async function buildFastify(clientId: string): Promise<FastifyInstance> {
  const app = fastify({
    logger: true,
  });
  await startWhatsApp();

  await constructRoutes(app, getClient());

  app.listen(opts, function (err: Error | null): void {
    app.log.info(`Server listening on ${opts.host}:${opts.port}`);
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
  return app;
}
