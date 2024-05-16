// import { z } from 'zod';
import { config } from 'dotenv';
config()

export const env = Object.freeze({
  CHAT_API_SECRET: process.env.CHAT_API_SECRET || 'segredo',
  DEFAULT_RECEIVER: process.env.DEFAULT_RECEIVER || '555596929042@c.us',
  HOST: process.env.HOST || '0.0.0.0',
  PORT: Number(process.env.PORT || '3001'),
});
