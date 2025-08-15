import { sendTelegramMessage } from "@/services";
import { FastifyInstance } from "fastify";
import { Logger } from "winston";
import { URL_PREFIX } from "../constants";

export async function constructRoutes(
  app: FastifyInstance,
  logger: Logger
): Promise<void> {

  app.post(`${URL_PREFIX}send`, async (req, reply) => {
    try {
      const body = (req.body as unknown as { message: string, phonenumber: string });
      if (!body.phonenumber || !body.message) {
        logger.warn('Missing required fields');
        return reply.status(400).send({
          status: "fail",
          message: "Missing phonenumber or messsage",
          err: "Phonenumber and message are required!"
        });
      }

      const { phonenumber, message } = body;
      await sendTelegramMessage(phonenumber, message);
      return { status: 'queued' };
    } catch (error) {
      logger.error(error);
      return reply.status(500).send({
        status: "fail",
        message: "Internal server error",
        err: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}
