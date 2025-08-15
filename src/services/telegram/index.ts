import TelegramBot, { Message, SendMessageOptions } from 'node-telegram-bot-api';
import { cfg } from '../../infra/config';
import { parentLogger } from '../../infra/logger';

const logger = parentLogger.child({ service: 'telegram' });
const token = cfg.TELEGRAM_TOKEN;
const options: SendMessageOptions = { parse_mode: 'Markdown' };

let bot: TelegramBot | null = null;

export function getBot(): TelegramBot {
  if (!bot) {
    bot = new TelegramBot(token);


    logger.info('🤖 Bot do Telegram inicializado');
  }
  return bot;
}

export async function sendTelegramMessage(chatId: string | number, text: string, opts: SendMessageOptions = options): Promise<Message> {
  try {
    const botInstance = getBot();

    if (!chatId || isNaN(Number(chatId))) {
      throw new Error(`ChatId inválido: ${chatId}`);
    }

    logger.info(`📤 Enviando mensagem para chatId: ${chatId}`, { text: text.substring(0, 100) });

    const result = await botInstance.sendMessage(chatId, text, opts);

    logger.info(`✅ Mensagem enviada com sucesso para chatId: ${chatId}`);
    return result;

  } catch (error) {
    logger.error(`❌ Erro ao enviar mensagem para chatId ${chatId}:`, error);

    throw error;
  }
}

export function cleanupTelegramBot(): void {
  if (bot) {
    bot.close();
    bot = null;
    logger.info('🧹 Bot do Telegram encerrado');
  }
}