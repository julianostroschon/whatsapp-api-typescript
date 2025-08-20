import { cleanupTelegramBot } from '@/services';
import { buildFastify } from '@/services/http';
import 'module-alias/register';
import { parentLogger } from '../infra/logger';
import { setupGracefulShutdown } from '../utils/shutdown';
import { startRabbitProducer } from './rabbit';

const logger = parentLogger.child({ service: 'producer-app' });

async function main(): Promise<void> {
  const channel = await startRabbitProducer();

  const app = await buildFastify();

  setupGracefulShutdown([
    async (): Promise<void> => {
      logger.info('Closing RabbitMQ connection...');
      await channel.close();
    },
    async (): Promise<void> => {
      logger.info('Closing Fastify server...');
      await app.close();
    },
    async (): Promise<void> => {
      cleanupTelegramBot();
    }
  ]);
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
