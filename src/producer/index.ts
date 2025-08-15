import { setupGracefulShutdown } from '@/utils/shutdown';
import 'module-alias/register';
import { parentLogger } from '../infra/logger';
import { buildFastify } from './server';

const logger = parentLogger.child({ service: 'producer-app' });

async function main() {
  // const channel = await initRabbitProducer();
  const app = await buildFastify();

  setupGracefulShutdown([
    // async () => {
    //   logger.info('Closing RabbitMQ connection...');
    //   await channel.close();
    // },
    async () => {
      logger.info('Closing Fastify server...');
      await app.close();
    }
  ]);
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
