import {injectable, BindingScope} from '@loopback/core';
import {UserCredentials} from '@models/core';
import bcrypt from 'bcrypt';

const saltRounds = 10;

@injectable({scope: BindingScope.SINGLETON})
export class PasswordService {
  constructor() {}

  async encryptPassword(password: string) {
    if (!password) {
      throw new Error('No password');
    }
    const hash = await bcrypt.hash(password, saltRounds);

    return hash;
  }

  async verifyPassword(password: string, account?: UserCredentials) {
    if (!account) return false;
    const verified = await bcrypt.compare(password, account.password);
    return verified;
  }
}
