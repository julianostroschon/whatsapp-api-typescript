import { MessageServices, sendMessage } from '@/services/messages';
import { connect, type ConsumeMessage } from 'amqplib';
import { cfg } from '../infra/config';
import { parentLogger } from '../infra/logger';
import { buildConsumerTag } from '../services';

const logger = parentLogger.child({ service: 'consumer' });
const queue = 'telegram';

interface MessageContent {
  phonenumber: string;
  message: string;
}

export async function startRabbitConsumer() {
  const consumerTag = buildConsumerTag(queue);
  const connection = await connect(cfg.RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: true });
  await channel.assertExchange('telegram', 'direct', { durable: true });
  await channel.bindQueue(queue, 'telegram', cfg.ROUTINE_NEW_MESAGE);

  logger.info(`👷 Worker criado, aguardando mensagens do exchange telegram`, { queue: queue });

  channel.consume(queue, async (message: ConsumeMessage | null): Promise<void> => {
    if (message) {
      try {
        const content = JSON.parse(message.content.toString()) as MessageContent;

        if (!content.phonenumber || !content.message) {
          logger.error(`❌ Mensagem inválida recebida`, { content });
          return channel.nack(message, false, false);
        }

        logger.info(`📥 Processando mensagem`, {
          phonenumber: content.phonenumber,
          messageLength: content.message.length
        });

        const body = { to: content.phonenumber, message: content.message }
        await sendMessage(MessageServices.Telegram, body);

        channel.ack(message);

      } catch (err) {
        logger.error(`❌ Erro ao processar mensagem`, {
          error: err instanceof Error ? err.message : 'Erro desconhecido',
          content: message.content.toString()
        });
        channel.nack(message, false, false);
      }
    }
  }, { consumerTag });

  return channel;
}
