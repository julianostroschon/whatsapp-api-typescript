// whatsapp client
import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import QRCode from 'qrcode-terminal';

// config file

// base typess
// import ora from 'ora';
// console.log({ ora })
// export const useSpinner = ora;


export class WhatsAppClient {
    public constructor(private clientId: string) {
        this.client = new Client({
            authStrategy: new LocalAuth({
              clientId: this.clientId,
            }),
            puppeteer: {
              args: ['--no-sandbox']
            },
            webVersionCache: {
                type: "remote",
                remotePath:
                  "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
            },
          });
        // init models
    }

    public async initializeClient(): Promise<void> {
        this.subscribeEvents();
        await this.client.initialize();
    }

    private subscribeEvents(): void {
        // const spinner = useSpinner('Whats App Client | generating QR Code... \n');
        // spinner.start();
        this.client
            .on('qr', (qr) => {
                WhatsAppClient.generateQrCode(qr);
                // spinner.succeed(`QR has been generated! | Scan QR Code with you're mobile.`);
            })
            // .on('auth_failure', (message) => spinner.fail(`Authentication fail ${message}`))
            // .on('authenticated', () => spinner.succeed('User Authenticated!'))
            // .on('loading_screen', () => spinner.start('loading chat... \n'))
            .on('ready', () => console.log('Client is ready | All set!'))
            // arrow function to prevent this binding
            .on('message', async (msg: Message): Promise<void> => this.onMessage(msg))
            // .on('message_create', async (msg) => this.onSelfMessage(msg));
    }

    private static generateQrCode(qr: string): void {
        console.log({ qr })
        QRCode.generate(qr, { small: true });
    }

    private async onMessage(message: Message): Promise<void> {
        console.log(`message received: `,{ message: message.body })
        // const msgStr = message.body;
        // this.client.sendMessage('55969290424@c.us', msgStr);
    }

    // private async onSelfMessage(message: Message) {
    //     if (!message.fromMe) return;  
    //     if (message.hasQuotedMsg && !Util.getModelByPrefix (message.body)) return;
    //     this.onMessage(message);
    // }

    public async sendMessage(content: string, chatId = '55969290424@c.us'): Promise<void> {
        await this.client.sendMessage(chatId, content);
    }
    
    private client;

    // Helper functions

}

