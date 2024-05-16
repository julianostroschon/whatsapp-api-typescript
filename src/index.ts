import fastify from 'fastify';
import { env } from './infra/config';
import { WhatsAppClient } from './services/whatsapp/WhatsAppClient';

const port = Number(env.PORT) || 3001;
const host = env.HOST || `0.0.0.0`;

(async (): Promise<void> => { 
  const client = new WhatsAppClient('clientId')
  await client.initializeClient()

  const app = fastify({
    logger: true,
  });

  app.get('/', async (req, reply) => {
    await client.sendMessage('Hello World!')
    reply.send('Hello World!');
  })

  app.listen({ host, port }, function (err: Error | null): void {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
})();
