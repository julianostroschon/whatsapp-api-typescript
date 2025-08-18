import TelegramBot, { Message, SendMessageOptions } from 'node-telegram-bot-api';
import { cfg } from '../../infra/config';
import { parentLogger } from '../../infra/logger';

const logger = parentLogger.child({ service: 'telegram' });
const token = cfg.TELEGRAM_TOKEN;
const options: SendMessageOptions = { parse_mode: 'Markdown' };

let bot: TelegramBot | null = null;

export function getBot(): TelegramBot {
  if (!bot) {
    // Configurar o bot para responder apenas às novas mensagens
    bot = new TelegramBot(token, {
      polling: {
        interval: 300,
        autoStart: true,
        params: {
          timeout: 10,
          offset: -1
        }
      }
    });

    bot.onText(/\/start/, (msg: Message): void => {
      const chatId = msg.chat.id;
      const text = 'Seu Chat Id:`' + chatId + '`'
      bot?.sendMessage(chatId, text, {
        ...options,
        reply_to_message_id: msg.message_id
      })
        .then((): void => {
          logger.info(`🤖 Resposta automática enviada para chatId: ${chatId}`);
        })
        .catch((error: unknown): void => {
          logger.error(`❌ Erro ao enviar resposta automática para chatId ${chatId}:`, error);
        });
    });

    logger.info('🤖 Bot do Telegram inicializado com monitoramento de mensagens');
  }
  return bot;
}

export async function sendTelegramMessage(chatId: string | number, text: string, opts: SendMessageOptions = options): Promise<{ status: string }> {
  try {
    const botInstance = getBot();

    if (!chatId || isNaN(Number(chatId))) {
      throw new Error(`ChatId inválido: ${chatId}`);
    }

    logger.info(`📤 Enviando mensagem para chatId: ${chatId}`, { text: text.substring(0, 100) });

    await botInstance.sendMessage(chatId, text, opts);

    logger.info(`✅ Mensagem enviada com sucesso para chatId: ${chatId}`);
    return { status: 'queued' };

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