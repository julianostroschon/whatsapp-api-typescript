import { Client, LocalAuth } from 'whatsapp-web.js';
import { generate } from 'qrcode-terminal';

export async function buildClient(clientId: string) {
  const client = new Client({
    authStrategy: new LocalAuth({
      clientId,
    }),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  })
    .on('qr', (qr) => {
      generate(qr, { small: true });
    })
    .on('error', (err) => console.log({ err }))
    .on('message', console.log)
    .on('ready', async () => {
      console.log('ready');

    });

  await client.initialize();
  return {
    sendMessage: async (phone: string | number = '+555596929042@c.us', message: string) => {
      try {
        const receiver = String(phone);
        const messageToSend = message;
       
        const { ack } = await client.sendMessage(receiver, messageToSend);
        return {
          statusText: ack,
        };
      } catch (err) {
        // console.log({ errorMessage: err.message });
        return {
          statusText: -1,
          error: message,
        };
      }
    },
  };
}

module.exports = { buildClient };
