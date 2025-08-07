import 'module-alias/register';
import { startRabbitConsumer } from './services/rabbit';
import { buildFastify } from './services/server';

(async () => {


  await buildFastify();
  await startRabbitConsumer();

})().catch((err) => {
  console.error(err);
  process.exit(1);
}).finally(() => {
  console.log('Application started successfully');
});
