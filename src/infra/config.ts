// import { z } from 'zod';
import { config } from 'dotenv';
config()

export const env = Object.freeze({
  CHAT_API_URL: process.env.CHAT_API_URL || 'http://0.0.0.0:3002/',
  CHAT_API_SECRET: process.env.CHAT_API_SECRET || 'segredo',
  HOST: process.env.HOST || '0.0.0.0',
  PORT: process.env.PORT || '3001',
});

