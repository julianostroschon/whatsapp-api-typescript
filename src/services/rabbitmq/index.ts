import amqp from 'amqplib';
import { cfg } from '../../infra/config';
import { sendMessage } from '../whatsapp';
import { buildConsumerTag } from './tag';
const RABBITMQ_URL = cfg.RABBITMQ_URL;
const QUEUE_NAME = 'whatsapp.sendMessage';

export async function startRabbitConsumer() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });
  console.log({ QUEUE_NAME }, 'queue created');


  channel.consume(QUEUE_NAME, async (msg: amqp.Message | null) => {
    if (msg) {
      try {
        const content = JSON.parse(msg.content.toString());
        const response = await sendMessage(content.phonenumber, content.message); // lógica reaproveitada
        console.log({ response });
        if (response.status === "success") {
          channel.ack(msg);
        } else {
          channel.nack(msg, false, false);
        }
      } catch (err) {
        console.error('Erro ao processar mensagem RabbitMQ', err);
        channel.nack(msg, false, false);
      }
    }
  }, { consumerTag: buildConsumerTag(QUEUE_NAME) });
}
