import 'module-alias/register';
import { parentLogger } from '../infra/logger';
import { setupGracefulShutdown } from '../utils/shutdown';
import { initRabbitProducer } from './rabbit';
import { buildFastify } from './server';

const logger = parentLogger.child({ service: 'producer-app' });

async function main(): Promise<void> {
  const channel = await initRabbitProducer();
  const app = await buildFastify();

  setupGracefulShutdown([
    async (): Promise<void> => {
      logger.info('Closing RabbitMQ connection...');
      await channel.close();
    },
    async (): Promise<void> => {
      logger.info('Closing Fastify server...');
      await app.close();
    }
  ]);
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
