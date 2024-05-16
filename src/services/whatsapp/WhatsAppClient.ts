import { Chat, ChatId, Client,Message } from 'whatsapp-web.js';
import QRCode from 'qrcode-terminal';

import { getChatIdByName, getClientOptions } from './lib';

export class WhatsAppClient {
  private chats: Chat[] = [];
  public constructor(private clientId: string) {
    this.client = new Client(getClientOptions(this.clientId));
  }

  public async initializeClient(): Promise<void> {
    this.subscribeEvents();
    await this.client.initialize();
    this.chats = await this.client.getChats();
  }

  private subscribeEvents(): void {
    this.client
      .on('qr', WhatsAppClient.generateQrCode)
      .on('ready', () => {
        // const content = `🤖 Bot WhatsApp Online! ✅\nCliente:*${clientId}*`
      })
      .on('message', this.onMessage);
  }

  private static generateQrCode(input: string): void {
    QRCode.generate(input, { small: true });
  }

  private async onMessage(msg: Message): Promise<void> {
    const message = msg.body
    const [marker] = message;
    // const [marker] = message

    if (message === 'ping') {
      await msg.reply('pong');
      return;
    }
    
    if (marker === '#') {
      const chatName = message.slice(1);
      console.log({ message, marker, chatName });
      const chatId = this.getChatIdByName(chatName)?._serialized
      await msg.reply(chatId ?? 'Invalid chat name');
      return;
    }

    console.log(`Message received from ${msg.author}: `, { msg: msg.body });
  }

  public async sendMessage(content: string, chatId = '5555969290424@c.us'): Promise<void> {
    await this.client.sendMessage(chatId, content);
  }

  public getChats(): Chat[] {
    return this.chats;
  }

  public getChatIdByName(chatName: string): ChatId | undefined {
    return getChatIdByName(this.chats, chatName);
  }


  private client: Client;
}
