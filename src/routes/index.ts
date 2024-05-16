import { FastifyInstance } from "fastify";

import { WhatsAppClient } from "../services/whatsapp";

import { decodeCredentials } from "../domains/credentials";
import { constructToken, sign } from "../domains/sign";
import { decodeChatId } from "../domains/chats";

const preffix = `/api/v1/`;

export async function constructRoutes(app: FastifyInstance): Promise<void> {

  const client = new WhatsAppClient('clientId')
  await client.initializeClient()

  app.post(`${preffix}send`, async (req, reply) => {
    const token = (req.body as unknown as { token: string }).token
    const { message, chatId } = decodeCredentials(token)
    await client.sendMessage(message, chatId)
    reply.send(message);
  })
  app.post(`${preffix}chats`, async (req, reply) => {
    const str = (req.body as unknown as  { group: string }).group
    const chatName = decodeChatId(str)
    const chatId = client.getChatIdByName(chatName)

    reply.send(chatId);
  })
  app.post(`${preffix}chatId`, async (req, reply) => {
    const str = (req.body as unknown as  { group: string }).group
    const chatName = decodeChatId(str)
    const chatId = client.getChatIdByName(chatName)

    reply.send(chatId);
  })

  app.post(`${preffix}encrypt`, async (req, reply) => {
    const { phonenumber, message } = req.body as unknown as { phonenumber: string, message: string }
    const payload = constructToken(message, phonenumber)
    reply.send(payload);
  })

  app.post(`${preffix}str`, async (req, reply) => {
    const payload = sign(req.body as string)
    reply.send({payload});
  })
}