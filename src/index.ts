import 'module-alias/register';
import { PROJECT_NAME } from "./constants";
import { buildFastify } from "./services/server";
const [, clientId = PROJECT_NAME] = process.argv.join(" ").split("--client ");

(async () => {

  await buildFastify(clientId);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
