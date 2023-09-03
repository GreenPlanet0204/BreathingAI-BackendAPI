import {asAuthStrategy, AuthenticationStrategy} from '@loopback/authentication';
import {StrategyAdapter} from '@loopback/authentication-passport';
import {injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {RedirectRoute, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {BasicStrategy as Strategy} from 'passport-http';
import {User} from '@models/core';
import {UserRepository} from '@repositories/core';
import {mapProfile} from './types';
import {AuthenticationMethodBindings} from './keys';

/**
 * basic passport strategy
 */
@injectable(asAuthStrategy)
export class BasicStrategy implements AuthenticationStrategy {
  name = AuthenticationMethodBindings.BASIC.key;
  passportstrategy: Strategy;
  strategy: StrategyAdapter<User>;

  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {
    /**
     * create a basic passport strategy with verify function to validate credentials
     */
    this.passportstrategy = new Strategy(this.verify.bind(this));
    /**
     * wrap the passport strategy instance with an adapter to plugin to LoopBack authentication
     */
    this.strategy = new StrategyAdapter(
      this.passportstrategy,
      this.name,
      mapProfile.bind(this),
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
    done: (error: any, user?: any) => void,
  ): void {
    this.userRepository
      .find({
        where: {
          email: username,
        },
        include: ['profiles', 'credentials'],
      })
      .then((users: User[]) => {
        if (!users?.length) {
          return done(null, false);
        }
        const user = users[0];
        if (!user.credentials || user.credentials.password !== password) {
          return done(null, false);
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
}
