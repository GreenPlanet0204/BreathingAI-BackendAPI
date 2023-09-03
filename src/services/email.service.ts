import * as nodemailer from 'nodemailer';
import {injectable, BindingScope} from '@loopback/core';
import {config} from '../config';

export type IEmail = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

export interface EmailManager<T = Object> {
  sendMail(mailObj: IEmail): Promise<T>;
}

@injectable({scope: BindingScope.SINGLETON})
export class EmailService {
  constructor() {}

  async sendMail(mailObj: IEmail): Promise<object> {
    try {
      const transporter = nodemailer.createTransport(config.email);
      const result = await transporter.sendMail(mailObj);
      return result;
    } catch (error) {
      console.log('failed to send invitation', error);
      throw new Error(error);
    }
  }
}
