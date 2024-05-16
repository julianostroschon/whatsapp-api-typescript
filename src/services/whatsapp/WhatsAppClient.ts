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
      .on('ready', (): void => console.log('Client is ready | All set!'))
      .on('message', WhatsAppClient.onMessage);
  }

  private static generateQrCode(input: string): void {
    QRCode.generate(input, { small: true });
  }

  private static async onMessage(message: Message): Promise<void> {
    console.log(`Message received from ${message.author}: `, { message: message.body });
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
