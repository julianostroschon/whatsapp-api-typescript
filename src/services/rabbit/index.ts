import { cfg } from '@/infra/config';
import { parentLogger } from '@/infra/logger';
import amqp from 'amqplib';
import { sendMessage } from '../whatsapp';
import { buildConsumerTag } from './tag';
const RABBITMQ_URL = cfg.RABBITMQ_URL;
const QUEUE_NAME = cfg.WHATSAPP_QUEUE;

export async function startRabbitConsumer() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  const logger = parentLogger.child({ module: 'queue' });
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  logger.info('queue created', { QUEUE_NAME });


  channel.consume(QUEUE_NAME, async (msg: amqp.Message | null) => {
    if (msg) {
      try {
        const content = JSON.parse(msg.content.toString());
        const response = await sendMessage(content.phonenumber, content.message);
        if (response.status === "success") {
          channel.ack(msg);
        } else {
          channel.nack(msg, false, false); // TODO: Identificar se haverá uma outra fila de retentativa
        }
      } catch (err) {
        logger.error('Erro ao processar mensagem RabbitMQ', err);
        channel.nack(msg, false, false);
      }
    }
  }, { consumerTag: buildConsumerTag(QUEUE_NAME) });
}
