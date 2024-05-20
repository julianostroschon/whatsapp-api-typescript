import { describe } from 'node:test'

import { decodeChatId } from '../chats'
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGF0SWQiOiJqb2pvIiwiaWF0IjoxNzE2MjI3OTE5fQ.eP3J49cWGJ9nVDdhWvmuqoV87hf4AFc5OMYwkMm2NGs'

describe('Decodificar chatId', (): void => {
  test('jojo', (): void => {
    const options = decodeChatId(token)
    expect(options).toEqual('jojo')
  })
});