import { parentLogger } from '@/infra/logger';
import { getClientOptions } from '@/services/whatsapp/lib';
import 'module-alias/register';
import { startRabbitConsumer } from './rabbit';

const logger = parentLogger.child({ service: 'consumer-app' });

(async () => {
  await startRabbitConsumer();
  getClientOptions('oito')
})().catch((err) => {
  logger.error(err);
  process.exit(1);
});
