import TelegramBot, { Message, SendMessageOptions } from 'node-telegram-bot-api';
import { cfg } from '../../infra/config';

const token = cfg.TELEGRAM_TOKEN
const options: SendMessageOptions = { parse_mode: 'Markdown' }

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, msg => {
  const chatId = msg.chat.id;
  const message = [
    '🎉 Obrigado pelo contato! 🎉',
    'Seu chatId é `' + chatId + '`',
    'salve esse código no Partithura e eu conseguirei te mandar as mensagens.'
  ]
  const text = message.join('\n')

  bot.sendMessage(chatId, text, options);
});
bot.onText(/\/id/, msg => {
  const chatId = String(msg.chat.id);
  const text = '`' + chatId + '`'

  sendTelegramMessage(chatId, text, {
    reply_to_message_id: msg.message_id, ...options
  });
})

export async function sendTelegramMessage(chatId: string, text: string, opts: SendMessageOptions = options): Promise<Message> {
  return bot.sendMessage(chatId, text, opts)
}