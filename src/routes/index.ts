import { FastifyInstance } from "fastify";

import { WhatsAppClient } from "../services/";

import { constructToken, decodeChatId, decodeCredentials } from "../domains/";
import { PROJECT_NAME, URL_PREFIX } from "../constants";

export async function constructRoutes(
  app: FastifyInstance,
  clientId: string = PROJECT_NAME,
): Promise<void> {
  const client = new WhatsAppClient(clientId);
  await client.initializeClient();

  const parentLogger = app.log;

  app.post(`${URL_PREFIX}send`, async (req, reply) => {
    const logger = parentLogger.child({ method: "send" });

    const token = (req.body as unknown as { token: string }).token;
    logger.info({ token });

    const { message, chatId } = decodeCredentials(token);
    await client.sendMessage(message, chatId);

    logger.info(`message sent: ${message}`);

    reply.send(message);
  });

  app.post(`${URL_PREFIX}chatId`, async (req, reply) => {
    const logger = parentLogger.child({ method: "chatId" });

    const group = (req.body as unknown as { group: string }).group;
    logger.info({ group });

    const chatName = decodeChatId(group);
    logger.info({ chatName });
    const chatId = client.getChatIdByName(chatName);
    logger.info(`chatId: ${chatId}`);

    reply.send({ chatId });
  });

  app.post(`${URL_PREFIX}encrypt`, async (req, reply) => {
    const { phonenumber, message } = req.body as unknown as {
      phonenumber: string;
      message: string;
    };
    const payload = constructToken(message, phonenumber);
    reply.send(payload);
  });

  app.post(`${URL_PREFIX}chatIdOne`, async (req, reply) => {
    const logger = parentLogger.child({ method: "chatId" });

    const chatName = (req.body as unknown as { chatName: string }).chatName;
    logger.info({ chatName });

    const result = client.getChatIdByName(chatName);
    logger.info(`chatName(${chatName}): ${result}`);

    reply.send({ result });
  });
}
