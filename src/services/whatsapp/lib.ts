import { FastifyBaseLogger } from "fastify";
import { join } from "node:path";
import { Chat, ClientOptions, LocalAuth, Message } from "whatsapp-web.js";

export const errorMarkers = ["❌", "⚠️"];

export function getClientOptions(clientId: string): ClientOptions {
  const executablePath = join(__dirname, '../../../.cache', 'puppeteer')
  // const executablePath = '/Applications/Chromium.app/Contents/MacOS/Chromium'
  return {
    authStrategy: new LocalAuth({
      clientId,
      dataPath: "./.wwebjs_auth"
    }),
    puppeteer: {
      headless: true,
      executablePath,
      args: [
        "--no-zygote",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-web-security",
        "--aggressive-cache-discard",
        "--disable-cache",
        "--disable-application-cache",
        "--disable-offline-load-stale-cache",
        "--disk-cache-size=0",
        "--window-size=1920,1080"
      ],
    },
    restartOnAuthFail: true,
    qrMaxRetries: 5,
    takeoverOnConflict: true,
    takeoverTimeoutMs: 10000,
    authTimeoutMs: 60000,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
  };
}

export function getChatIdByName(
  chats: Chat[],
  chatName: string,
  logger: FastifyBaseLogger
): string | undefined {
  if (!chats || !chats.length) {
    logger.warn('No chats found');
    return;
  }
  const chat = chats.find(({ name }: Chat): boolean => name === chatName);
  if (chat === undefined) {
    logger.warn(`Chat "${chatName}" not found`);
    return;
  }
  const { server, user } = chat.id;
  const chatId = `${user}@${server}`
  logger.info(`Chat ${chatName} found: ${chatId}`);
  return chatId;
}

const READER = {
  id: async (
    chats: Chat[],
    input: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _message: Message,
    logger: FastifyBaseLogger
  ): Promise<string> => {
    const chatId = getChatIdByName(chats, input, logger);
    return chatId ? `\`${chatId}\`` : `Chat "\`${input}\`" not found`;
  },
  ping: async (
    _chats: Chat[],
    input: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _message: Message,
    logger: FastifyBaseLogger
  ): Promise<string> => {
    logger.info(`Pong sent: ${input} lines`);
    return Array.from({ length: parseInt(input) }, (): string => "pong!").join("\n");
  },
};

export async function readMessage(
  message: Message,
  chats: Chat[],
  logger: FastifyBaseLogger
): Promise<void> {
  const [marker, input] = message.body.split('#');

  if (Object.keys(READER).includes(marker)) {
    const content = await READER[marker as keyof typeof READER](chats, input, message, logger);
    logger.info(`Message replied: ${content}`);
    void await message.reply(content);
  }
}

function hasValidSuffix(input: string): boolean {
  return input.endsWith('@c.us') || input.endsWith('@g.us');
}

export function parseChatId(number: string | number): string {
  const strNumber = cleanNumber(number);
  if (hasValidSuffix(strNumber)) {
    return strNumber;
  }
  const suffixedNumber = `${strNumber}@c.us`;
  if (strNumber.length === 12 || strNumber.length === 13) {
    return suffixedNumber;
  }
  return `+55${suffixedNumber}`;
}

function cleanNumber(number: string | number): string {
  const strNumber = number.toString();
  const toRemoveChars = ['(', ')', '-', '+', ' ', ' '];
  return toRemoveChars.reduce(removeChar, strNumber);
}

function removeChar(origin: string, char: string): string {
  return origin.replace(char, '');
  // return origin;
}