import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  HOST: z.string().default('0.0.0.0'),

  // Autenticação
  JWT_SECRET: z.string().min(10, 'JWT_SECRET deve ter pelo menos 10 caracteres'),
  CHAT_API_SECRET: z.string(),

  // RabbitMQ
  RABBITMQ_URL: z.url().default('amqp://user:password@localhost:5672'),
  WHATSAPP_QUEUE: z.string().default('whatsapp.sendMessage'),

  // Mensageria interna
  GROUP_TO_SEND_ERROR: z.string(),
  DEFAULT_RECEIVER: z.string(),
  TECH_LEAD: z.string(),

  // Rotas
  BLOCKED_ROUTES: z.string().default('login,signup'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Erro ao validar variáveis de ambiente:');
  console.error(parsed.error.format());
  process.exit(1);
}

const rawEnv = parsed.data;

export const cfg = {
  ...rawEnv,
  BLOCKED_ROUTES: rawEnv.BLOCKED_ROUTES.split(',').map(route => route.trim()),
};
