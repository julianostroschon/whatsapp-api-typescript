import { cfg } from '@/infra/config';
import { parentLogger } from '@/infra/logger';
import { buildConsumerTag } from '@/services/rabbit/tag';
import { startWhatsApp } from '@/services/whatsapp';
import amqp from 'amqplib';

const logger = parentLogger.child({ service: 'worker' });

export async function startRabbitConsumer() {
  const consumerTag = buildConsumerTag(cfg.WHATSAPP_QUEUE);
  const connection = await amqp.connect(cfg.RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(cfg.WHATSAPP_QUEUE, { durable: true });
  logger.info(`👷 Worker created, waiting for messages`, { queue: cfg.WHATSAPP_QUEUE });

  channel.consume(cfg.WHATSAPP_QUEUE, async (msg) => {
    if (msg) {
      try {
        const content = JSON.parse(msg.content.toString());
        const client = await startWhatsApp()
        const message = await client.sendMessage(content.phonenumber, content.message);

        if (!!message.getInfo()) {
          logger.info(`✅ Message sent`, { content });
          channel.ack(msg);
        } else {
          logger.warn(`⚠️ Message failed`, { content });
          channel.nack(msg, false, false);
        }
      } catch (err) {
        logger.error(`❌ Error processing message`, err);
        channel.nack(msg, false, false);
      }
    }
  }, { consumerTag });
}
