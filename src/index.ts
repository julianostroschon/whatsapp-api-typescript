import { PROJECT_NAME } from "./constants";
import { buildFastify } from "./services/server";

(async () => {
  const [, clientId = PROJECT_NAME] = process.argv.join(" ").split("--client ");

  await buildFastify(clientId);
})().catch((err) => {
  console.error(err);
  process.exit();
});
