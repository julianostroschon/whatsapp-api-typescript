import 'module-alias/register';
import { startWhatsApp } from './services';
import { startRabbitConsumer } from './services/rabbitmq';
import { buildFastify } from './services/server';

(async () => {

  await startWhatsApp();

  await buildFastify();
  await startRabbitConsumer();

})().catch((err) => {
  console.error(err);
  process.exit(1);
}).finally(() => {
  console.log('Application started successfully');
});
