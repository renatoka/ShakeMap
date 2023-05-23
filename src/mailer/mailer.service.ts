import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const fs = require('fs');
const Brevo = require('sib-api-v3-sdk');

@Injectable()
export class MailerService {
  constructor(private configService: ConfigService) {}

  async sendMail(data: any, template: string) {
    try {
      const { sender, receivers, subject, params } = data;

      const BrevoApiKey = this.configService.get<string>('BREVO_API_KEY');
      const client = Brevo.ApiClient.instance;
      const apiKey = client.authentications['api-key'];
      apiKey.apiKey = BrevoApiKey;
      const transactionalEmailsApi = new Brevo.TransactionalEmailsApi();

      const emailTemplate = fs.readFileSync(
        `./src/mailer/templates/${template}.html`,
        'utf8',
      );

      await transactionalEmailsApi.sendTransacEmail({
        sender: sender,
        to: receivers,
        subject: subject,
        htmlContent: `${emailTemplate}`,
        params: params,
      });

      console.log(`Email sent to ${receivers.email}`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
