import 'module-alias/register';
import { createLogger } from 'winston';
import { startWhatsApp } from './services';
import { startRabbitConsumer } from './services/rabbitmq';
import { buildFastify } from './services/server';

(async () => {
  const logger = createLogger()

  await startWhatsApp(logger);

  await buildFastify(logger);
  await startRabbitConsumer(logger);

})().catch((err) => {
  console.error(err);
  process.exit(1);
}).finally(() => {
  console.log('Application started successfully');
});
