import qrcode from "qrcode-terminal";
import { Client } from "whatsapp-web.js";
import { getClientOptions } from "./lib";

// Exported client for integration with other modules
let client: Client;


// Start WhatsApp client
function startWhatsApp() {
  client = new Client(getClientOptions('oito'));

  client.on("qr", (qr) => qrcode.generate(qr, { small: true }));

  client.on("ready", () => {
    console.log("Connected to WhatsApp!");
  });

  client.on("message", async (msg) => {
    const rawNumber = msg.from;
    const messageText = msg.body;
    const numberE164 = `+${rawNumber.replace("@c.us", "")}`;
    console.log(`Received message from ${numberE164}: ${messageText}`);
  });

  client.initialize();
}
const getClient = (): Client => {
  if (!client) {
    throw new Error("WhatsApp client is not initialized");
  }
  return client;
};
export {
  getClient,
  startWhatsApp
};
