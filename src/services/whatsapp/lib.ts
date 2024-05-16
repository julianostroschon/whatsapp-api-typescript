import { Chat, ClientOptions, LocalAuth } from "whatsapp-web.js";

export const errorMarkers = ['❌', '⚠️']

export function getClientOptions(clientId: string): ClientOptions {
  return {
    authStrategy: new LocalAuth({
      clientId,
    }),
    puppeteer: {
      args: [
        '--disable-accelerated-2d-canvas',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process',
        '--no-first-run',
        '--disable-gpu',
        '--no-zygote',
        '--no-sanbox',
      ]
    },
    webVersionCache: {
      remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
      type: "remote",
    },
  }
}

export function getChatIdByName(chats: Chat[], chatName: string): string {
  for (const { name, id, isGroup } of chats) {
    if (name === chatName && isGroup) {
      const { server, user } = id
      return `${user}@${server}`
    }
    continue
  }
  throw new Error('Chat not found')
}