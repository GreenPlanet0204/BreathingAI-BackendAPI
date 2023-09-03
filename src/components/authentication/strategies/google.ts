import {asAuthStrategy, AuthenticationStrategy} from '@loopback/authentication';
import {StrategyAdapter} from '@loopback/authentication-passport';
import {extensionFor, inject, injectable} from '@loopback/core';
import {RedirectRoute, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {Strategy} from 'passport-google-oauth2';
import {User} from '@models/core';
import {mapProfile, PassportAuthenticationBindings} from './types';

@injectable(
  asAuthStrategy,
  extensionFor(PassportAuthenticationBindings.OAUTH2_STRATEGY),
)
export class GoogleOauth2Authentication implements AuthenticationStrategy {
  name = 'oauth2-google';
  protected strategy: StrategyAdapter<User>;

  /**
   * create an oauth2 strategy for google
   */
  constructor(
    @inject('googleStrategy')
    public passportstrategy: Strategy,
  ) {
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
}
