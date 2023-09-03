import {UserIdentityService} from '@loopback/authentication';
import {BindingScope, inject, injectable, Provider} from '@loopback/core';
import {Profile} from 'passport';
import {Strategy as FacebookStrategy, StrategyOption} from 'passport-facebook';
import {verifyFunctionFactory} from '../strategies/types';
import {User} from '@models/core';
import {UserServiceBindings} from '@services/core';

@injectable.provider({scope: BindingScope.SINGLETON})
export class FacebookOauth implements Provider<FacebookStrategy> {
  strategy: FacebookStrategy;

  constructor(
    @inject('facebookOAuth2Options')
    public facebookOptions: StrategyOption,
    @inject(UserServiceBindings.PASSPORT_USER_IDENTITY_SERVICE)
    public userService: UserIdentityService<Profile, User>,
  ) {
    this.strategy = new FacebookStrategy(
      this.facebookOptions,
      verifyFunctionFactory(this.userService),
    );
  }

  value() {
    return this.strategy;
  }
}
