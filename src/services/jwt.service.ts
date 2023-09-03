import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {User} from '@models/core';
import {UserRepository} from '@repositories/core';
import jwt, {JwtPayload} from 'jsonwebtoken';

const secret = 'e86b7821-073a-47ec-b444-b563cde281e7';

@injectable({scope: BindingScope.SINGLETON})
export class JwtSessionService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}
  public static createJwtFromUser(user: User) {
    return jwt.sign({userId: user.id}, secret, {
      expiresIn: '1y',
    });
  }

  async getUserFromToken(token: string): Promise<User> {
    try {
      const payload = jwt.verify(token, secret) as JwtPayload;

      if (!payload) {
        throw HttpErrors[401];
      }

      const {userId} = payload;

      if (!userId) throw HttpErrors[401];

      return await this.userRepository.findById(userId);
    } catch (error) {
      throw HttpErrors[401];
    }
  }
}
