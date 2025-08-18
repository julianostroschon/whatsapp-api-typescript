import amqp from 'amqplib';
import { cfg } from '../infra/config';
import { parentLogger } from '../infra/logger';

let channel: amqp.Channel;
const logger = parentLogger.child({ service: 'producer' });

export async function initRabbitProducer() {
  const conn = await amqp.connect(cfg.RABBITMQ_URL);
  channel = await conn.createChannel();

  await channel.assertExchange('telegram', 'direct', { durable: true });
  await channel.assertQueue(cfg.MAIN_QUEUE, { durable: true });

  logger.info(`✅ RabbitMQ Producer conectado, exchange=telegram`);
  return channel;
}

export async function publishMessage(phonenumber: string, message: string) {
  if (!channel) throw new Error('RabbitMQ channel não inicializado');

  const content = JSON.stringify({ phonenumber, message });

  try {
    const success = channel.publish('telegram', cfg.ROUTINE_NEW_MESAGE, Buffer.from(content), {
      persistent: true
    });

    if (success) {
      logger.info(`📤 Mensagem enviada para exchange telegram`, {
        messageLength: message.length,
        phonenumber,
      });
      return
    }
    logger.warn(`⚠️ Mensagem não foi confirmada pelo RabbitMQ`, { phonenumber });
  } catch (error) {
    logger.error(`❌ Erro ao enviar mensagem para exchange:`, error);
    throw error;
  }
}
