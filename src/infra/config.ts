import { config } from "dotenv";
import { z } from "zod";
config();

export const env = Object.freeze({
  BLOCKED_ROUTES: (process.env.BLOCKED_ROUTES || 'login,signup').split(','),
  GROUP_TO_SEND_ERROR: process.env.GROUP_TO_SEND_ERROR || "jojo",
  DEFAULT_RECEIVER: process.env.DEFAULT_RECEIVER || "groupName",
  TECH_LEAD: process.env.TECH_LEAD || "5599992200@c.us",
  CHAT_API_SECRET: process.env.SECRET || "segredo",
  PORT: Number(process.env.PORT || "3001"),
  HOST: process.env.HOST || "0.0.0.0",
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost',
});


const envSchema = z.object({
  RABBITMQ_URL: z.url().default('amqp://localhost'),
});

export const cfg = envSchema.parse(process.env);