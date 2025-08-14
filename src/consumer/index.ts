import { parentLogger } from '@/infra/logger';
import 'module-alias/register';
import { startRabbitConsumer } from './rabbit';

const logger = parentLogger.child({ service: 'consumer-app' });

(async () => {
  await startRabbitConsumer();
})().catch((err) => {
  logger.error(err);
  process.exit(1);
});
