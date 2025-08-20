import TelegramBot from 'node-telegram-bot-api';
import { cfg } from './infra';

const token = cfg.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });
console.log('bot is ready')

// Matches "/echo [whatever]"
bot.onText(/\/start/, (msg) => {

  const chatId = msg.chat.id;

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, chatId.toString());
});