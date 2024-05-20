import { describe } from 'node:test'

import { getClientOptions } from '../lib'

const result = {
  authStrategy: {
    clientId: "cliente-um",
    dataPath: "/Users/julianostroschon/Documents/Projects/paralelos/whatsapp-api-typescript/.wwebjs_auth"
  },
  puppeteer: {
    args: [
      '--disable-accelerated-2d-canvas',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process',
      '--no-first-run',
      '--disable-gpu',
      '--no-zygote',
      '--no-sanbox',
    ],
    headless: true
  },
  webVersionCache: {
    remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    type: "remote",
  },
}

describe('Buscar opções do cliente', (): void => { 
  test('cliente-um', (): void => {
    const options = getClientOptions('cliente-um')
    expect(options).toEqual(result)
  })
});