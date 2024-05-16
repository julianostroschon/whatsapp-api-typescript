import fastify from 'fastify';
import { env } from './infra/config';
import { WhatsAppClient } from './services/whatsapp';
import { constructToken, sign } from './domains/sign';
import { decodeCredentials } from './domains/credentials';
import { decodeChatId } from './domains/chats';

const port = env.PORT;
const host = env.HOST;

(async (): Promise<void> => {
  const client = new WhatsAppClient('clientId')
  await client.initializeClient()
  const app = fastify({
    logger: true,
  });

  app.post('/api/v1/send', async (req, reply) => {
    const token = (req.body as unknown as { token: string }).token
    const { message, chatId } = decodeCredentials(token)
    await client.sendMessage(message, chatId)
    reply.send(message);
  })
  app.post('/api/v1/chats', async (req, reply) => {
    const str = (req.body as unknown as  { group: string }).group
    const chatName = decodeChatId(str)
    const chatId = client.getChatIdByName(chatName)

    reply.send(chatId);
  })
  app.post('/api/v1/chatId', async (req, reply) => {
    const str = (req.body as unknown as  { group: string }).group
    const chatName = decodeChatId(str)
    const chatId = client.getChatIdByName(chatName)

    reply.send(chatId?._serialized);
  })

  app.post('/api/v1/encrypt', async (req, reply) => {
    const { phonenumber, message } = req.body as unknown as { phonenumber: string, message: string }
    const payload = constructToken(message, phonenumber)
    reply.send(payload);
  })

  app.post('/api/v1/str', async (req, reply) => {
    const payload = sign(req.body as string)
    reply.send({payload});
  })

  app.listen({ host, port }, function (err: Error | null): void {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
})();
