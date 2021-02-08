import { injectable, inject } from 'tsyringe';
import { Transporter } from 'nodemailer';
import sgMail from '@sendgrid/mail';

import mailConfig from '@config/mail';

import AppError from '@shared/errors/AppError';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class SendGridMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {}

  public async sendMail({
    from,
    to,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { email } = mailConfig.defaults.from;

    const msg = {
      to: to.email,
      from: from?.email || email,
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    };

    (async () => {
      try {
        if (!process.env.SENDGRID_API_KEY) {
          throw new AppError('SENDGRID_API_KEY is not defined', 500);
        }

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        await sgMail.send(msg);
      } catch (error) {
        console.error(error); // eslint-disable-line no-console

        if (error.response) {
          console.error(error.response.body); // eslint-disable-line no-console
        }
      }
    })();
  }
}
