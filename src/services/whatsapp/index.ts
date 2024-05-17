import { Chat, Client,Message } from 'whatsapp-web.js';
import QRCode from 'qrcode-terminal';

import {
  getClientOptions,
  getChatIdByName,
  errorMarkers,
  readMessage
} from './lib';
import { env } from '../../infra/config';

export class WhatsAppClient {
  private chats: Chat[] = [];
  private defaultChat = '';
  private groupToSendErrors = '';

  public constructor(private clientId: string) {
    this.client = new Client(getClientOptions(this.clientId));
  }

  public async initializeClient(): Promise<void> {
    void this.subscribeEvents();
    void await this.client.initialize();

    void await this.constructDefaults();
  }

  private subscribeEvents(): void {
    void this.client
      .on('qr', WhatsAppClient.generateQrCode)
      .on('ready', (): void => {
        console.log(`🤖 Bot WhatsApp Online! ✅\nCliente: ${this.clientId}`);
      })
      .on('message', this.onMessage);
  }

  private async constructDefaults(): Promise<void> {
    this.chats = await this.client.getChats();
    this.defaultChat = this.getChatIdByName();
    this.groupToSendErrors = this.getChatIdByName(env.GROUP_TO_SEND_ERROR);

    void this.sendMessage('🤖 Bot WhatsApp Online! ✅');
  }

  private static generateQrCode(input: string): void {
    void QRCode.generate(input, { small: true });
  }

  private async onMessage({ body, reply }: Message): Promise<void> {
      if (body === 'ping') {
      void await reply('pong');
      return;
    }

    void await readMessage({ body, reply }, this.chats);
  }

  public async sendMessage(content: string, chatId: string = this.defaultChat): Promise<Message> {
    const [marker]: string = content;
    if (errorMarkers.includes(marker)) {
      void await this.sendMessage(content, this.groupToSendErrors);
    }

    return await this.client.sendMessage(chatId, content);
  }

  public getChatIdByName(chatName: string = env.DEFAULT_RECEIVER): string {
    return getChatIdByName(this.chats, chatName) ?? env.TECH_LEAD;
  }


  private client: Client;
}
