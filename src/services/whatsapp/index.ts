import qrcode from "qrcode-terminal";
import { Client } from "whatsapp-web.js";
import { getClientOptions } from "./lib";

// Exported client for integration with other modules
let client: Client | null = null;
let isInitializing = false;
let initializePromise: Promise<Client> | null = null;

async function startWhatsApp(): Promise<Client> {
  if (client?.info) {
    try {
      const state = await client.getState();
      if (state === 'CONNECTED') {
        return client;
      }
    } catch (error) {
      console.log('Error checking client state:', error);
    }
  }

  if (isInitializing && initializePromise) {
    return initializePromise;
  }

  isInitializing = true;
  initializePromise = new Promise((resolve, reject) => {
    try {
      client = new Client(getClientOptions('oito'));

      client.on("qr", (qr) => {
        console.log("Scan this QR code in WhatsApp:");
        qrcode.generate(qr, { small: true });
      });

      client.on("ready", () => {
        console.log("Connected to WhatsApp!");
        isInitializing = false;
        resolve(client!);
      });

      client.on("auth_failure", (error) => {
        console.error("WhatsApp authentication failed:", error);
        client = null;
        isInitializing = false;
        initializePromise = null;
        reject(error);
      });

      client.on("disconnected", async (reason) => {
        console.log("WhatsApp client disconnected:", reason);
        client = null;
        isInitializing = false;
        initializePromise = null;

        try {
          await startWhatsApp();
        } catch (error) {
          console.error("Failed to reinitialize after disconnection:", error);
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
      client = null;
      isInitializing = false;
      initializePromise = null;
      reject(error);
    }
  });

  return initializePromise;
}

function getClient() {
  if (!client) {
    throw new Error("WhatsApp client is not initialized");
  }
  return client
}

async function sendMessage(number: string, message: string) {
  try {
    // Try to get or initialize the WhatsApp client
    const whatsappClient = await startWhatsApp();

    if (!whatsappClient) {
      return {
        status: "fail",
        message: "WhatsApp client initialization failed",
        err: "Please try again later"
      };
    }

    // Check client state
    const state = await whatsappClient.getState();
    console.log('WhatsApp client state:', { state });

    if (!state || state !== 'CONNECTED') {
      return {
        status: "fail",
        message: "WhatsApp client is not ready",
        err: "Please ensure the QR code is scanned and the client is connected"
      };
    }

    // Format the phone number if needed (remove any non-numeric characters except +)
    const cleanNumber = number.replace(/[^\d+]/g, '');

    if (!whatsappClient) {
      return {
        status: "fail",
        message: "WhatsApp client is not initialized",
        err: "Please try again later"
      };
    }
    const chat = await whatsappClient?.getNumberId(cleanNumber);
    try {
      console.log('Number validation result:', { chat });

      if (!chat || !chat._serialized) {
        return {
          status: "fail",
          message: "Invalid phone number",
          err: `O número [${cleanNumber}] é inválido ou não está registrado no WhatsApp`
        };
      }

      // Send the message
      await whatsappClient.sendMessage(chat._serialized, message);

      return {
        status: "success",
        message: `Mensagem enviada com sucesso`,
        data: {
          to: chat._serialized,
          message: message
        }
      };
    } catch (error) {
      console.error('Error in message sending process:', error);
      return {
        status: "fail",
        message: "Failed to process message",
        err: error instanceof Error ? error.message : "Unknown error in message processing"
      };
    }
  } catch (error) {
    console.error('Error in WhatsApp client operation:', error);
    return {
      status: "fail",
      message: "WhatsApp client error",
      err: error instanceof Error ? error.message : "Unknown WhatsApp client error"
    };
  }
}

export { getClient, sendMessage, startWhatsApp };

