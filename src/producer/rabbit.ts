import { connect, type AssertExchange, type Channel } from 'amqplib';
import { cfg } from '../infra/config';
import { parentLogger } from '../infra/logger';

let channel: Channel;
const logger = parentLogger.child({ service: 'producer' });

const typeToManageMessages = 'direct'
const options: AssertExchange = { durable: true }
const exchange = 'telegram'

export async function initRabbitProducer(): Promise<Channel> {
  const conn = await connect(cfg.RABBITMQ_URL);
  channel = await conn.createChannel();

  await channel.assertExchange(exchange, typeToManageMessages, options);
  await channel.assertQueue(cfg.MAIN_QUEUE, options);

  logger.info(`✅ RabbitMQ Producer conectado, exchange=telegram`);
  return channel;
}

export async function publishMessage(phonenumber: string, message: string): Promise<void> {
  if (!channel) throw new Error('RabbitMQ channel não inicializado');

  const content = Buffer.from(JSON.stringify({ phonenumber, message }));

  try {
    const success = channel.publish(exchange, cfg.ROUTINE_NEW_MESAGE, content, {
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
