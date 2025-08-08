import { parentLogger } from "@/infra/logger";
import qrcode from "qrcode-terminal";
import { Client } from "whatsapp-web.js";
import { getClientOptions } from "./lib";

// Exported client for integration with other modules
let client: Client | null = null;
let clientInitializing: Promise<Client> | null = null;

async function startWhatsApp(): Promise<Client> {
  const logger = parentLogger.child({ service: 'whatsapp' });
  if (client && client?.info) {
    try {
      const state = await client.getState();
      logger.info(`"Client is ${state}"`);
      if (state === 'CONNECTED') return client
    } catch (error) {
      logger.error('Error checking client state:', error);
    }
  }
  logger.info(`Oops, the client was invalidated`)
  if (clientInitializing) return clientInitializing;

  clientInitializing = new Promise<Client>((resolve, reject) => {
    const localClient = new Client(getClientOptions('oito'));

    localClient.on('qr', (qr) => {
      logger.info("Scan this QR code in WhatsApp:");
      qrcode.generate(qr, { small: true });
    });

    localClient.on('ready', () => {
      logger.info("Client is ready!");
      client = localClient;
      clientInitializing = null;
      resolve(localClient);
    });

    localClient.on('auth_failure', (err) => {
      logger.error("Authentication failure:", err);
      client = null;
      clientInitializing = null;
      reject(err);
    });

    localClient.on('disconnected', async (reason) => {
      logger.warn("Disconnected:", reason);
      client = null;
      clientInitializing = null;
      // Opcional: reinit automático ou não
    });

    localClient.on("message", async (msg) => {
      const rawNumber = msg.from;
      const messageText = msg.body;
      const numberE164 = `+${rawNumber.replace("@c.us", "")}`;
      if (!numberE164.includes("status")) {
        logger.info(`Received message from ${numberE164}: ${messageText}`);
      }
    });

    (async () => {
      try {
        await localClient.initialize();
      } catch (err) {
        logger.error("Failed to initialize client");
        clientInitializing = null;
        reject(err);
      }
    })();
  });

  return clientInitializing;
}

async function sendMessage(number: string, message: string) {
  const logger = parentLogger.child({ module: 'sendMessage' });
  try {
    if (!client) {
      logger.warn("Client not initialized, attempting to start");
      client = await startWhatsApp();
    }

    const state = await client.getState();
    if (state !== 'CONNECTED') {
      logger.warn(`Client is in state: ${state}`);
      return {
        status: "fail",
        message: "Client not connected, scan QR Code and try again",
      };
    }

    // const state = await whatsappClient.getState();
    // if (!state || state !== 'CONNECTED') {
    //   logger.error("WhatsApp client is not ready");
    //   return {
    //     err: "Please ensure the QR code is scanned and the client is connected",
    //     message: "WhatsApp client is not ready",
    //     status: "fail",
    //   };
    // }

    const cleanNumber = number.replace(/[^\d+]/g, '');

    const chat = await client?.getNumberId(cleanNumber);
    console.log({ chat, cleanNumber, number })
    try {
      logger.info('Number validation result:', { chat });

      if (!chat || !chat._serialized) {
        logger.error(`Invalid phone number: [${cleanNumber}]`);
        try {
          await client.sendMessage(number + '@g.us', message)
        }
        catch (e) {
          console.log(e)
        }
        return {
          err: `O número [${cleanNumber}] é inválido ou não está registrado no WhatsApp`,
          message: "Invalid phone number",
          status: "fail",
        };
      }

      await client.sendMessage(chat._serialized, message);
      logger.info(`Message sent successfully to [${chat._serialized}]: ${message}`);
      return {
        message: `Mensagem enviada com sucesso`,
        status: "success",
        data: {
          to: chat._serialized,
          message: message
        }
      };
    } catch (error) {
      logger.error('Error in message sending process:', error);
      return {
        err: error instanceof Error ? error.message : "Unknown error in message processing",
        message: "Failed to process message",
        status: "fail",
      };
    }
  } catch (error) {
    logger.error('Error in WhatsApp client operation:', error);
    return {
      err: error instanceof Error ? "Erro interno à bilioteca do whatsapp-api" : "Unknown WhatsApp client error",
      message: "WhatsApp client error",
      status: "fail",
    };
  }
}

export { sendMessage, startWhatsApp };

