import { describe } from 'node:test'
import type { Chat } from 'whatsapp-web.js';

import { getChatIdByName } from '../lib'

describe('Decodificar chatId', (): void => {
  test('Chat encontrado', (): void => {
    const chats = [
      {
        id: {
          server: 'c.us',
          user: '554199999999',
        },
        name: 'Logus',
      }
    ] as Chat[]

    expect(getChatIdByName(chats, 'Logus')).toEqual('554199999999@c.us')
  })
  test('Chat não encontrado', (): void => {
    const chats = [
      {
        id: {
          server: 'c.us',
          user: '554199999999',
        },
        name: 'Logus',
      }
    ] as Chat[]

    expect(getChatIdByName(chats, 'Daniel')).toBeUndefined()
  })
});