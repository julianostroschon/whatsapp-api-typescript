// import 'module-alias/register';
// import { startRabbitConsumer } from './consumer/rabbit';
// import { parentLogger } from './infra/logger';
// import { buildFastify } from './producer/server';

// const logger = parentLogger.child({ service: 'app' });

// (async () => {


//   await buildFastify();
//   await startRabbitConsumer();

// })().catch((err) => {
//   logger.error(err);
//   process.exit(1);
// }).finally(() => {
//   logger.info('🚀 App ready to respond');
// });



import TelegramBot from 'node-telegram-bot-api';
import { cfg } from './infra/config';

// replace the value below with the Telegram token you receive from @BotFather
// const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const token = cfg.TELEGRAM_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
console.log('bot is ready')

// Matches "/echo [whatever]"
bot.onText(/\/start/, (msg) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, chatId.toString());
});

// Listen for any kind of message. There are different kinds of
// messages.
// bot.on('message', (msg: Message) => {
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Received your message', { reply_to_message_id: msg.message_id });
// });