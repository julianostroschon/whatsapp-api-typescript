import { cfg } from '@/infra/config';
import { parentLogger } from '@/infra/logger';
import amqp from 'amqplib';
import { sendMessage } from '../whatsapp';
import { buildConsumerTag } from './tag';
const RABBITMQ_URL = cfg.RABBITMQ_URL;
const QUEUE_NAME = cfg.WHATSAPP_QUEUE;

export async function startRabbitConsumer() {
  const logger = parentLogger.child({ service: 'worker' });
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });
  logger.info('👷 Worker created, waiting for messages', { queue: QUEUE_NAME });

  channel.consume(QUEUE_NAME, async (msg: amqp.Message | null) => {
    if (msg) {
      try {
        const content = JSON.parse(msg.content.toString());
        const response = await sendMessage(content.phonenumber, content.message);
        if (response.status === "success") {
          logger.info(`Event processed successfully`, { content });
          channel.ack(msg);
        } else {
          logger.warn(`Event processed with fails`, { content });
          channel.nack(msg, false, false); // TODO: Identificar se haverá uma outra fila de retentativa
        }
      } catch (err) {
        logger.error('Erro ao processar mensagem RabbitMQ', err);
        channel.nack(msg, false, false);
      }
    }
  }, { consumerTag: buildConsumerTag(QUEUE_NAME) });
}
