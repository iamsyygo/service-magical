import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  transporter: Transporter;

  // fix: Cannot find  'ConfigService'.
  // @Inject(ConfigService)
  // private configService: ConfigService;

  constructor(
    @Inject(ConfigService)
    private configService: ConfigService,
  ) {
    this.initEmail();
  }

  initEmail() {
    try {
      const transport = {
        host: this.configService.get('EMAIL_HOST'),
        port: +this.configService.get('EMAIL_PORT'),
        secure: this.configService.get('EMAIL_SECURE', false),
        auth: {
          user: this.configService.get('EMAIL_USER'),
          pass: this.configService.get('EMAIL_PASS'),
        },
      };

      this.transporter = createTransport(transport);
    } catch (error) {
      console.error('邮件服务初始化失败', error);
    }
  }

  //   async sendMail({ to, subject, html }) {
  //     await this.transporter.sendMail({
  //       from: {
  //         name: '标题',
  //         address: '发件人的邮箱地址',
  //       },
  //       to,
  //       subject,
  //       html,
  //     });
  //   }

  sendMail(
    mailOptions: Mail.Options,
    callback?: (err: Error | null, info: any) => void,
  ) {
    return this.transporter.sendMail.apply(this.transporter, arguments);
  }
}
