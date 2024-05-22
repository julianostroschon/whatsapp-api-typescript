import { Chat, ClientOptions, LocalAuth, Message } from "whatsapp-web.js";

export const errorMarkers = ['❌', '⚠️']

export function getClientOptions(clientId: string): ClientOptions {
  return {
    authStrategy: new LocalAuth({
      clientId,
    }),
    puppeteer: {
      headless: true,
      args: [
        '--disable-accelerated-2d-canvas',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process',
        '--no-first-run',
        '--disable-gpu',
        '--no-zygote',
        '--no-sandbox',
      ]
    },
    webVersionCache: {
      remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
      type: "remote",
    },
  }
}

export function getChatIdByName(chats: Chat[], chatName: string): string | undefined {
  for (const { name, id: { server, user } } of chats) {
    if (name === chatName) {
      return `${user}@${server}`;
    }
  }
  console.warn('Chat not found');
  return;
}

const READER = {
  id: async (chats: Chat[], chatName: string, reply: Message['reply']): Promise<void> => {
    const chatId = getChatIdByName(chats, chatName);
    void await reply(chatId ?? 'Invalid chat name');
  }
}

export async function readMessage({ body, reply }: Pick<Message, 'body' | 'reply'>, chats: Chat[]): Promise<void> {
  const [marker, chatName]: string[] = body.split('#');

  if (Object.keys(READER).includes(marker)) {
    READER[marker as keyof typeof READER](chats, chatName, reply);
  }
}