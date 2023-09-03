import {UserIdentityService} from '@loopback/authentication';
import {BindingScope, inject, injectable, Provider} from '@loopback/core';
import {Profile} from 'passport';
import {IStrategyOption, Strategy as TwitterStrategy} from 'passport-twitter';
import {verifyFunctionFactory} from '../strategies/types';
import {User} from '@models/core';
import {UserServiceBindings} from '@services/core';

@injectable.provider({scope: BindingScope.SINGLETON})
export class TwitterOauth implements Provider<TwitterStrategy> {
  strategy: TwitterStrategy;

  constructor(
    @inject('twitterOAuthOptions')
    public oauthOptions: IStrategyOption,
    @inject(UserServiceBindings.PASSPORT_USER_IDENTITY_SERVICE)
    public userService: UserIdentityService<Profile, User>,
  ) {
    this.strategy = new TwitterStrategy(
      this.oauthOptions,
      verifyFunctionFactory(this.userService),
    );
  }

  value() {
    return this.strategy;
  }
}
