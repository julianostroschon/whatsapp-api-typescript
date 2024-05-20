import { buildFastify } from './services/server';


(async (): Promise<void> => {
  const [,clientId] = process.argv.join(' ').split('--client ');
  
  await buildFastify(clientId);

})();
