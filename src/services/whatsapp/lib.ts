import { Chat, ChatId, ClientOptions, LocalAuth } from "whatsapp-web.js";

export function getClientOptions(clientId: string): ClientOptions {
  return {
    authStrategy: new LocalAuth({
      clientId,
    }),
    puppeteer: {
      args: ['--no-sandbox']
    },
    webVersionCache: {
      remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
      type: "remote",
    },
  }
}

export function getChatIdByName(chats: Chat[], chatName: string): ChatId {
  for (const { name, id, isGroup } of chats) {
    if (name === chatName && isGroup) {
      return id
    }
    continue
  }
  throw new Error('Chat not found')
}