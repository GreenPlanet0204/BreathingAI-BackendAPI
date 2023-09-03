import {asAuthStrategy, AuthenticationStrategy} from '@loopback/authentication';
import {StrategyAdapter} from '@loopback/authentication-passport';
import {injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {RedirectRoute, Request} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {IVerifyOptions, Strategy} from 'passport-local';
import {User} from '@models/core';
import {UserRepository} from '@repositories/core';
import {JwtSessionService, PasswordService} from '@services/core';
import {AuthenticationMethodBindings} from './keys';

@injectable(asAuthStrategy)
export class LocalAuthStrategy implements AuthenticationStrategy {
  name = AuthenticationMethodBindings.LOCAL.key;
  passportstrategy: Strategy;
  strategy: StrategyAdapter<User>;

  /**
   * create a local passport strategy
   */
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @service(PasswordService)
    public passwordService: PasswordService,
    @service(JwtSessionService)
    public jwt: JwtSessionService,
  ) {
    /**
     * create a local passport strategy with verify function to validate credentials
     */
    this.passportstrategy = new Strategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        session: false,
      },
      this.verify.bind(this),
    );
    /**
     * wrap the passport strategy instance with an adapter to plugin to LoopBack authentication
     */
    this.strategy = new StrategyAdapter(
      this.passportstrategy,
      this.name,
      this.mapProfile.bind(this),
    );
  }

  /**
   * authenticate a request
   * @param request
   */
  async authenticate(request: Request): Promise<UserProfile | RedirectRoute> {
    return this.strategy.authenticate(request);
  }

  /**
   * authenticate user with provided username and password
   *
   * @param username
   * @param password
   * @param done
   *
   * @returns User model
   */
  verify(
    username: string,
    password: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    done: (error: any, user?: any, options?: IVerifyOptions) => void,
  ): void {
    this.userRepository
      .find({
        where: {
          email: username,
        },
        include: ['profiles', 'credentials'],
      })
      .then(async (users: User[]) => {
        const AUTH_FAILED_MESSAGE = 'User Name / Password not matching';

        if (!users?.length) {
          return done(null, null, {message: AUTH_FAILED_MESSAGE});
        }
        const user = users[0];

        const passwordMatches = await this.passwordService.verifyPassword(
          password,
          user.credentials,
        );

        if (!user.credentials || !passwordMatches) {
          return done(null, null, {message: AUTH_FAILED_MESSAGE});
        }
        // Authentication passed, return user profile
        done(null, user);
      })
      .catch(err => {
        /**
         * Error occurred in authenticating process.
         * Does not necessarily mean an unauthorized user.
         */
        done(err);
      });
  }

  /**
   * maps returned User model from verify function to UserProfile
   *
   * @param user
   */
  mapProfile(user: User): UserProfile {
    const token = JwtSessionService.createJwtFromUser(user);
    const userProfile: UserProfile = {
      [securityId]: token,
      profile: {
        ...user,
      },
    };
    return userProfile;
  }
}
