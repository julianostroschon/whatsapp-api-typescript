import 'module-alias/register';
import { buildFastify } from "./services/server";

(async () => {

  await buildFastify();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
