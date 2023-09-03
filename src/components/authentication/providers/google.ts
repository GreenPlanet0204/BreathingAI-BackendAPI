import {UserIdentityService} from '@loopback/authentication';
import {BindingScope, inject, injectable, Provider} from '@loopback/core';
import {Profile} from 'passport';
import {
  Strategy as GoogleStrategy,
  StrategyOptions,
} from 'passport-google-oauth2';
import {verifyFunctionFactory} from '../strategies/types';
import {User} from '@models/core';
import {UserServiceBindings} from '@services/core';

@injectable.provider({scope: BindingScope.SINGLETON})
export class GoogleOauth implements Provider<GoogleStrategy> {
  strategy: GoogleStrategy;

  constructor(
    @inject('googleOAuth2Options')
    public oauth2Options: StrategyOptions,
    @inject(UserServiceBindings.PASSPORT_USER_IDENTITY_SERVICE)
    public userService: UserIdentityService<Profile, User>,
  ) {
    this.strategy = new GoogleStrategy(
      this.oauth2Options,
      verifyFunctionFactory(this.userService),
    );
  }

  value() {
    return this.strategy;
  }
}
