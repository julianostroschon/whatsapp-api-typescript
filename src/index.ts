import 'module-alias/register';
import { startRabbitConsumer } from './consumer/rabbit';
import { parentLogger } from './infra/logger';
import { buildFastify } from './producer/server';

const logger = parentLogger.child({ service: 'app' });

(async () => {


  await buildFastify();
  await startRabbitConsumer();

})().catch((err) => {
  logger.error(err);
  process.exit(1);
}).finally(() => {
  logger.info('🚀 App ready to respond');
});
