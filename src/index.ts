import fastify from 'fastify';
import { env } from './infra/config';
import { WhatsAppClient } from './services/whatsapp';

const port = env.PORT;
const host = env.HOST;

(async (): Promise<void> => {
  const client = new WhatsAppClient('clientId')
  await client.initializeClient()
  const app = fastify({
    logger: true,
  });

  app.post('/api/v1/send', async (req, reply) => {
    await client.sendMessage('Hello World!', (req.body as unknown as { token: string }).token)
    reply.send('Hello World!');
  })
  app.post('/api/v1/chats', async (req, reply) => {
    const chatId = client.getChatIdByName((req.body as unknown as  { group: string }).group)

    reply.send(chatId);
  })

  app.listen({ host, port }, function (err: Error | null): void {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
})();
