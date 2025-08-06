import { FastifyInstance } from "fastify";


import { getClient } from "@src/services";
import { URL_PREFIX } from "../constants";
import { constructToken } from "../domains/";

export async function constructRoutes(
  app: FastifyInstance
): Promise<void> {

  const parentLogger = app.log;

  app.post(`${URL_PREFIX}send`, async (req, reply) => {
    const logger = parentLogger.child({ method: "send" });

    const body = (req.body as unknown as { message: string, phonenumber: string });
    // logger.info({ token });
    const client = getClient();

    // const { message, chatId } = decodeCredentials);
    const { phonenumber, message } = body
    const chat = await client.getNumberId(phonenumber)
    if (chat?._serialized) {
      await client.sendMessage(chat._serialized, message);
      logger.info(`message sent: ${message}`);

      reply.send({
        status: "success",
        message: `Mensagem: ${message}, enviada para ${chat._serialized}`
      });
      return
    }

    reply.send({
      status: "fail",
      message: "Failed to send message",
      err: `Número [${phonenumber}] inválido`,
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

}
