import { parentLogger } from '@/infra/logger';
import 'module-alias/register';
import { initRabbitProducer } from './rabbit';
import { buildFastify } from './server';

const logger = parentLogger.child({ service: 'producer-app' });

(async () => {
  await initRabbitProducer();
  await buildFastify();
})().catch((err) => {
  logger.error(err);
  process.exit(1);
});
