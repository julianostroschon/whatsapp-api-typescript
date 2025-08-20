import 'module-alias/register';
import { parentLogger } from '../infra/logger';
import { setupGracefulShutdown } from '../utils/shutdown';
import { startRabbitConsumer } from './rabbit';

const logger = parentLogger.child({ service: 'consumer' });

async function main(): Promise<void> {
  const channel = await startRabbitConsumer();

  setupGracefulShutdown([
    async (): Promise<void> => {
      logger.info('Closing RabbitMQ connection...');
      await channel.close();
    },
  ]);
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
