import qrcode from "qrcode-terminal";
import { Client } from "whatsapp-web.js";
import { Logger } from "winston";
import { getClientOptions } from "./lib";

// Exported client for integration with other modules
let client: Client | null = null;

async function startWhatsApp(logger: Logger): Promise<Client> {
  if (client?.info) {
    try {
      const state = await client.getState();
      if (state === 'CONNECTED') {
        return client;
      }
    } catch (error) {
      logger.error('Error checking client state:', error);
    }
  }


  return new Promise((resolve, reject) => {
    try {
      client = new Client(getClientOptions('oito'));

      client.on("qr", (qr) => {
        logger.info("Scan this QR code in WhatsApp:");
        qrcode.generate(qr, { small: true });
      });

      client.on("ready", () => {
        logger.info("Connected to WhatsApp!");
        resolve(client!);
      });

      client.on("auth_failure", (error) => {
        logger.error("WhatsApp authentication failed:", error);
        client = null;
        reject(error);
      });

      client.on("disconnected", async (reason) => {
        console.log("WhatsApp client disconnected:", reason);
        client = null;

        try {
          await startWhatsApp(logger);
        } catch (error) {
          logger.error("Failed to reinitialize after disconnection:", error);
        }
      });

      client.on("message", async (msg) => {
        const rawNumber = msg.from;
        const messageText = msg.body;
        const numberE164 = `+${rawNumber.replace("@c.us", "")}`;
        if (!numberE164.includes("status")) {
          console.log(`Received message from ${numberE164}: ${messageText}`);
        }
      });

      client.initialize();
    } catch (error) {
      logger.error("Error initializing WhatsApp client:", error);
      reject(error);
    }
  });
}

function getClient() {
  if (!client) {
    throw new Error("WhatsApp client is not initialized");
  }
  return client
}

async function sendMessage(logger: Logger, number: string, message: string) {
  try {
    const whatsappClient = await startWhatsApp(logger);

    if (!whatsappClient) {
      logger.error("WhatsApp client initialization failed");
      return {
        status: "fail",
        message: "WhatsApp client initialization failed",
        err: "Please try again later"
      };
    }

    const state = await whatsappClient.getState();
    if (!state || state !== 'CONNECTED') {
      logger.error("WhatsApp client is not ready");
      return {
        status: "fail",
        message: "WhatsApp client is not ready",
        err: "Please ensure the QR code is scanned and the client is connected"
      };
    }

    const cleanNumber = number.replace(/[^\d+]/g, '');

    const chat = await whatsappClient?.getNumberId(cleanNumber);
    try {
      logger.info('Number validation result:', { chat });

      if (!chat || !chat._serialized) {
        logger.error(`Invalid phone number: [${cleanNumber}]`);
        return {
          status: "fail",
          message: "Invalid phone number",
          err: `O número [${cleanNumber}] é inválido ou não está registrado no WhatsApp`
        };
      }

      // Send the message
      await whatsappClient.sendMessage(chat._serialized, message);
      logger.info(`Message sent successfully to [${chat._serialized}]: ${message}`);
      return {
        status: "success",
        message: `Mensagem enviada com sucesso`,
        data: {
          to: chat._serialized,
          message: message
        }
      };
    } catch (error) {
      logger.error('Error in message sending process:', error);
      return {
        status: "fail",
        message: "Failed to process message",
        err: error instanceof Error ? error.message : "Unknown error in message processing"
      };
    }
  } catch (error) {
    logger.error('Error in WhatsApp client operation:', error);
    return {
      status: "fail",
      message: "WhatsApp client error",
      err: error instanceof Error ? error.message : "Unknown WhatsApp client error"
    };
  }
}

export { getClient, sendMessage, startWhatsApp };

