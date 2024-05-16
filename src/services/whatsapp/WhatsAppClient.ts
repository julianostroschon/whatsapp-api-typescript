import { Chat, Client,Message } from 'whatsapp-web.js';
import QRCode from 'qrcode-terminal';

import { getChatIdByName, getClientOptions, errorMarkers } from './lib';
import { env } from '../../infra/config';



export class WhatsAppClient {
  private chats: Chat[] = [];
  private defaultChat = '';
  private groupToSendErrors = '';
  public constructor(private clientId: string) {
    this.client = new Client(getClientOptions(this.clientId));
  }

  public async initializeClient(): Promise<void> {
    this.subscribeEvents();
    await this.client.initialize();

    await this.constructDefaults()
  }

  private subscribeEvents(): void {
    this.client
      .on('qr', WhatsAppClient.generateQrCode)
      .on('ready', () => {
        // const content = `🤖 Bot WhatsApp Online! ✅\nCliente:*${clientId}*`
      })
      .on('message', this.onMessage);
  }

  private async constructDefaults(): Promise<void> {
    this.chats = await this.client.getChats();
    this.defaultChat = this.getChatIdByName();
    this.groupToSendErrors = this.getChatIdByName(env.GROUP_TO_SEND_ERROR);

    this.sendMessage('🤖 Bot WhatsApp Online! ✅');
  }

  private static generateQrCode(input: string): void {
    QRCode.generate(input, { small: true });
  }

  private async onMessage(msg: Message): Promise<void> {
    const message = msg.body
    const [marker] = message;

    if (message === 'ping') {
      await msg.reply('pong');
      return;
    }
    
    if (marker === '#') {
      const chatName = message.slice(1);
      const chatId = this.getChatIdByName(chatName)
      await msg.reply(chatId ?? 'Invalid chat name');
    }
  }

  public async sendMessage(content: string, chatId: string = this.defaultChat): Promise<Message> {
    const [marker] = content;
    if (errorMarkers.includes(marker)) {
      await this.sendMessage(content, this.groupToSendErrors)
    }

    return await this.client.sendMessage(chatId, content)
  }

  public getChats(): Chat[] {
    return this.chats;
  }

  public getChatIdByName(chatName: string = env.DEFAULT_RECEIVER): string {
    return getChatIdByName(this.chats, chatName) ?? env.TECH_LEAD;
  }


  private client: Client;
}
