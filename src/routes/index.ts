import { FastifyInstance } from "fastify";

import { URL_PREFIX } from "../constants";
import { sendMessage, startWhatsApp } from "../services";

export async function constructRoutes(
  app: FastifyInstance
): Promise<void> {
  // Initialize WhatsApp client when routes are constructed
  try {
    await startWhatsApp();
  } catch (error) {
    app.log.error('Failed to initialize WhatsApp client:', error);
  }

  const parentLogger = app.log;

  app.post(`${URL_PREFIX}send`, async (req, reply) => {
    const logger = parentLogger.child({ method: "send" });

    try {
      const body = (req.body as unknown as { message: string, phonenumber: string });
      logger.info({ body });

      if (!body.phonenumber || !body.message) {
        reply.status(400).send({
          status: "fail",
          message: "Missing required fields",
          err: "Both phonenumber and message are required"
        });
        return;
      }

      const { phonenumber, message } = body;
      const result = await sendMessage(phonenumber, message);

      if (result.status === "fail") {
        reply.status(400);
      }

      logger.info({ result });
      reply.send(result);
    } catch (error) {
      logger.error(error);
      reply.status(500).send({
        status: "fail",
        message: "Internal server error",
        err: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}
