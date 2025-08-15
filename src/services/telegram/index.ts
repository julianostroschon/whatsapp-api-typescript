import TelegramBot, { Message, SendMessageOptions } from 'node-telegram-bot-api';
import { cfg } from '../../infra/config';
import { parentLogger } from '../../infra/logger';

const logger = parentLogger.child({ service: 'telegram' });
const token = cfg.TELEGRAM_TOKEN;
const options: SendMessageOptions = { parse_mode: 'Markdown' };

// Criar uma única instância do bot para toda a aplicação
let bot: TelegramBot | null = null;

function getBot(): TelegramBot {
  if (!bot) {
    bot = new TelegramBot(token, { 
      polling: false, // Desabilitar polling para bot que só envia mensagens
      webHook: false  // Desabilitar webhook também
    });
    
    logger.info('🤖 Bot do Telegram inicializado');
  }
  return bot;
}

export async function sendTelegramMessage(chatId: string, text: string, opts: SendMessageOptions = options): Promise<Message> {
  try {
    const botInstance = getBot();
    
    // Validar se o chatId é válido
    if (!chatId || isNaN(Number(chatId))) {
      throw new Error(`ChatId inválido: ${chatId}`);
    }
    
    logger.info(`📤 Enviando mensagem para chatId: ${chatId}`, { text: text.substring(0, 100) });
    
    const result = await botInstance.sendMessage(chatId, text, opts);
    
    logger.info(`✅ Mensagem enviada com sucesso para chatId: ${chatId}`);
    return result;
    
  } catch (error) {
    logger.error(`❌ Erro ao enviar mensagem para chatId ${chatId}:`, error);
    
    // Re-throw para que o consumer possa tratar adequadamente
    throw error;
  }
}

// Função para limpar recursos do bot (útil para shutdown graceful)
export function cleanupTelegramBot(): void {
  if (bot) {
    bot.close();
    bot = null;
    logger.info('🧹 Bot do Telegram encerrado');
  }
}