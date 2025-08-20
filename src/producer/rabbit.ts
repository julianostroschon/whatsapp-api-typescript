import { consumer } from '@/consumer/constants';
import { buildConsumerTag } from '@/services';
import { connect, ConsumeMessage, type Channel } from 'amqplib';
import { cfg } from '../infra/config';
import { parentLogger } from '../infra/logger';
import { producer } from './constants';

let producerChannel: Channel;
const logger = parentLogger.child({ service: 'producer' });

interface MessageContent {
  phonenumber: string;
  message: string;
}

export async function startRabbitProducer() {
  const consumerTag = buildConsumerTag(producer.queue);
  const connection = await connect(cfg.RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(producer.queue, { durable: true });
  await channel.assertExchange(producer.exchange, 'direct', { durable: true });
  await channel.bindQueue(producer.queue, producer.exchange, cfg.ROUTINE_NEW_MESAGE);

  logger.info(`👷 Worker criado, aguardando mensagens`, { queue: producer.queue });

  channel.consume(producer.queue, async (consumeMessage: ConsumeMessage | null): Promise<void> => {
    if (consumeMessage) {
      try {
        const content = JSON.parse(consumeMessage.content.toString()) as MessageContent;
        const { phonenumber, message } = content

        if (!phonenumber || !message) {
          logger.error(`❌ Mensagem recebida inválida`, { content });
          return channel.nack(consumeMessage, false, false);
        }

        logger.info(`📥 Processando mensagem`, {
          phonenumber: phonenumber,
          messageLength: message.length
        });

        await publishMessage(phonenumber, message);

        channel.ack(consumeMessage);

      } catch (err) {
        logger.error(`❌ Erro ao processar mensagem`, {
          error: err instanceof Error ? err.message : 'Erro desconhecido',
          content: consumeMessage.content.toString()
        });
        channel.nack(consumeMessage, false, false);
      }
    }
  }, { consumerTag });

  producerChannel = channel

  return channel;
}
const consumerExchange = 'telegram'
export async function publishMessage(phonenumber: string, message: string): Promise<void> {
  if (!producerChannel) throw new Error('RabbitMQ channel não inicializado');

  const content = Buffer.from(JSON.stringify({ phonenumber, message }));

  try {
    const success = producerChannel.publish(consumer.exchange, cfg.ROUTINE_NEW_MESAGE, content, {
      persistent: true
    });

    if (success) {
      logger.info(`📤 Mensagem enviada para exchange ${consumerExchange}`, {
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
