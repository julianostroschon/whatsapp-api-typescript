import 'module-alias/register';
import { startWhatsApp } from './services';
import { buildFastify } from './services/server';

(async () => {

  await startWhatsApp();

  await buildFastify();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
