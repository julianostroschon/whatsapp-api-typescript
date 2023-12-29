import { buildServer } from "./server";

// console.log('index')
const PORT = process.env.PORT || 3001;

(async () => {
  const server = await buildServer();

  server.listen(PORT);
})();
