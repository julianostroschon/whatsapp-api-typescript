import amqp from 'amqplib';
import { cfg } from '../infra/config';
import { parentLogger } from '../infra/logger';
import { buildConsumerTag, sendTelegramMessage } from '../services';

const logger = parentLogger.child({ service: 'consumer' });

export async function startRabbitConsumer() {
  const consumerTag = buildConsumerTag(cfg.MAIN_QUEUE);
  const connection = await amqp.connect(cfg.RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(cfg.MAIN_QUEUE, { durable: true });
  logger.info(`👷 Worker created, waiting for messages`, { queue: cfg.MAIN_QUEUE });

  channel.consume(cfg.MAIN_QUEUE, async (message) => {
    if (message) {
      const content = JSON.parse(message.content.toString());
      try {
        await sendTelegramMessage(content.phonenumber, content.message);

        logger.info(`✅ Message sent`, { content });
        channel.ack(message);
      } catch (err: unknown) {
        if (err instanceof Error) {
          logger.error(`❌ Error processing message ${err.message}[${content.phonenumber}]`,);
        }
        channel.nack(message, false, false);
      }
    }
  }, { consumerTag });

  return channel
}
