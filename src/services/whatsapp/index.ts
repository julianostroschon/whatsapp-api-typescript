import qrcode from "qrcode-terminal";
import { Client } from "whatsapp-web.js";
import { getClientOptions } from "./lib";

// Exported client for integration with other modules
let client: Client;

// Start WhatsApp client and return a promise that resolves when the client is ready
async function startWhatsApp(): Promise<Client> {
  return new Promise((resolve, reject) => {
    try {
      client = new Client(getClientOptions('oito'));

      client.on("qr", (qr) => {
        console.log("Scan this QR code in WhatsApp:");
        qrcode.generate(qr, { small: true });
      });

      client.on("ready", () => {
        console.log("Connected to WhatsApp!");
        resolve(client);
      });

      client.on("auth_failure", (error) => {
        console.error("WhatsApp authentication failed:", error);
        reject(error);
      });

      client.on("disconnected", (reason) => {
        console.log("WhatsApp client disconnected:", reason);
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
      reject(error);
    }
  });
}

function getClient(): Client {
  if (!client) {
    throw new Error("WhatsApp client is not initialized");
  }
  return client;
}

export { getClient, startWhatsApp };
