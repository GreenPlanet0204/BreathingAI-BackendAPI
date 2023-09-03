import {asAuthStrategy, AuthenticationStrategy} from '@loopback/authentication';
import {injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, RedirectRoute, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {User} from '@models/core';
import {UserRepository} from '@repositories/core';
import {JwtSessionService} from '@services/core';
import {AuthenticationMethodBindings} from './keys';
import {mapProfile} from './types';

@injectable(asAuthStrategy)
export class SessionStrategy implements AuthenticationStrategy {
  name = AuthenticationMethodBindings.SESSION.key;

  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @service(JwtSessionService)
    public jwt: JwtSessionService,
  ) {}

  /**
   * authenticate a request
   * @param request
   */
  async authenticate(
    request: Request,
  ): Promise<UserProfile | RedirectRoute | undefined> {
    if (!request.cookies?.session && !request.headers.authorization) {
      throw new HttpErrors.Unauthorized(`Session not defined`);
    }
    const sessionToken =
      request.cookies?.session ?? request.headers.authorization;

    const user = await this.jwt.getUserFromToken(sessionToken);

    if (!user) {
      throw new HttpErrors.Unauthorized(`User not registered`);
    }

    return mapProfile(user as User);
  }
}
