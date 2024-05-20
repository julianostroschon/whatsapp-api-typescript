import { describe } from 'node:test'
import assert from 'node:assert';

import type { Chat, Message } from 'whatsapp-web.js';

import { readMessage } from '../lib'

const req = {
  body: 'id#Logus',
  reply: (chatId: string): Promise<Message> => chatId as unknown as Promise<Message>,
} as Pick<Message, 'body' | 'reply'>

const chats = [
  {
    id: {
      server: 'c.us',
      user: '554199999999',
    },
    name: 'Logus',
  }
] as Chat[]

describe('Decodificar chatId', (): void => {
  test('Chat encontrado', async (): Promise<void> => {
    const { id: { server, user } } = chats[0]

    assert.strictEqual(req.reply(`${user}@${server}`), "554199999999@c.us");

    expect(readMessage(req, chats)).resolves.toBeUndefined()

  })
});