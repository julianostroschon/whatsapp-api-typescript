import 'module-alias/register';
import { parentLogger } from './infra/logger';
import { startRabbitConsumer } from './services/rabbit';
import { buildFastify } from './services/server';

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
