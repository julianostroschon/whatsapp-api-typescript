import { FastifyInstance } from "fastify";


import { Client } from "whatsapp-web.js";
import { URL_PREFIX } from "../constants";
import { constructToken } from "../domains/";

export async function constructRoutes(
  app: FastifyInstance,
  client: Client,
): Promise<void> {

  const parentLogger = app.log;

  app.post(`${URL_PREFIX}send`, async (req, reply) => {
    const logger = parentLogger.child({ method: "send" });

    const body = (req.body as unknown as { token: string });
    // logger.info({ token });

    // const { message, chatId } = decodeCredentials);
    const { phonenumber, message } = body
    const chat = await client.getNumberId(phonenumber)
    if (chat?._serialized) {
      await client.sendMessage(chat._serialized, message);
      logger.info(`message sent: ${message}`);

      reply.send({
        status: "success",
        message: "Message sent successfully"
      });
      return
    }

    reply.send({
      status: "error",
      message: "Failed to send message",
      err: chat
    });

  });

  // app.post(`${URL_PREFIX}chatId`, async (req, reply) => {
  //   const logger = parentLogger.child({ method: "chatId" });

  //   const group = (req.body as unknown as { group: string }).group;
  //   logger.info({ group });

  //   const chatName = decodeChatId(group);
  //   logger.info({ chatName });
  //   const chatId = client.getChatIdByName(chatName);
  //   logger.info(`chatId: ${chatId}`);

  //   reply.send({ chatId });
  // });

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
