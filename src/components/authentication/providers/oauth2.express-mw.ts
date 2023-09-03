import passport from 'passport';
import {BindingScope, inject, injectable, Provider} from '@loopback/core';
import {ExpressRequestHandler} from '@loopback/rest';
import {Strategy as OAuth2Strategy} from 'passport-oauth2';

@injectable.provider({scope: BindingScope.SINGLETON})
export class CustomOauth2ExpressMiddleware
  implements Provider<ExpressRequestHandler>
{
  constructor(
    @inject('oauth2Strategy')
    public oauth2Strategy: OAuth2Strategy,
  ) {
    passport.use(this.oauth2Strategy);
  }

  value() {
    return passport.authenticate('oauth2');
  }
}
