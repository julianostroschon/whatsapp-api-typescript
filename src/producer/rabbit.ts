import amqp from 'amqplib';
import { cfg } from '../infra/config';
import { parentLogger } from '../infra/logger';

let channel: amqp.Channel;
const logger = parentLogger.child({ service: 'producer' });

export async function initRabbitProducer() {
  const conn = await amqp.connect(cfg.RABBITMQ_URL);
  channel = await conn.createChannel();
  await channel.assertQueue(cfg.MAIN_QUEUE, { durable: true });
  logger.info(`✅ RabbitMQ Producer connected, queue=${cfg.MAIN_QUEUE}`);

  return channel
}

export async function publishMessage(phonenumber: string, message: string) {
  if (!channel) throw new Error('RabbitMQ channel not initialized');

  const content = JSON.stringify({ phonenumber, message });
  channel.sendToQueue(cfg.MAIN_QUEUE, Buffer.from(content), { persistent: true });
  logger.info(`📤 Message queued`, { phonenumber, message });
}
