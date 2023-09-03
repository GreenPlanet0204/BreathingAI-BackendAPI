import {
  Application,
  Constructor,
  createBindingFromClass,
  Provider,
} from '@loopback/core';
import {ExpressRequestHandler, toInterceptor} from '@loopback/rest';
import passport from 'passport';

import {PassportUserIdentityService, UserServiceBindings} from './services';

import {SessionStrategy} from './components/authentication/strategies/jwtSession';
import {LocalAuthStrategy} from './components/authentication/strategies/local';
import {BasicStrategy} from './components/authentication/strategies/basic';
import {
  CustomOauth2,
  CustomOauth2ExpressMiddleware,
  FacebookOauth,
  FacebookOauth2ExpressMiddleware,
  GoogleOauth,
  GoogleOauth2ExpressMiddleware,
  TwitterOauth,
  TwitterOauthExpressMiddleware,
} from '@authentication/providers';
import {
  CustomOauth2Interceptor,
  FacebookOauthInterceptor,
  GoogleOauthInterceptor,
  SessionAuth,
  TwitterOauthInterceptor,
} from '@authentication/interceptors';
import {GoogleOauth2Authentication} from '@authentication/strategies/google';
import {TwitterOauthAuthentication} from '@authentication/strategies/twitter';
import {FaceBookOauth2Authentication} from '@authentication/strategies/facebook';
import {Oauth2AuthStrategy} from '@authentication/strategies/oauth2';

export function setupBindings(app: Application) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passport.serializeUser(function (user: any, done) {
    done(null, user);
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passport.deserializeUser(function (user: any, done) {
    done(null, user);
  });

  app
    .bind(UserServiceBindings.PASSPORT_USER_IDENTITY_SERVICE)
    .toClass(PassportUserIdentityService);

  // passport strategies
  const passportStrategies: Record<string, Constructor<unknown>> = {
    facebookStrategy: FacebookOauth,
    googleStrategy: GoogleOauth,
    twitterStrategy: TwitterOauth,
    oauth2Strategy: CustomOauth2,
  };

  for (const key in passportStrategies) {
    app.add(createBindingFromClass(passportStrategies[key], {key}));
  }

  // passport express middleware
  const middlewareMap: Record<
    string,
    Constructor<Provider<ExpressRequestHandler>>
  > = {
    facebookStrategyMiddleware: FacebookOauth2ExpressMiddleware,
    googleStrategyMiddleware: GoogleOauth2ExpressMiddleware,
    twitterStrategyMiddleware: TwitterOauthExpressMiddleware,
    oauth2StrategyMiddleware: CustomOauth2ExpressMiddleware,
  };

  for (const key in middlewareMap) {
    app.add(createBindingFromClass(middlewareMap[key], {key}));
  }

  // LoopBack 4 style authentication strategies
  const strategies: Constructor<unknown>[] = [
    LocalAuthStrategy,
    FaceBookOauth2Authentication,
    GoogleOauth2Authentication,
    TwitterOauthAuthentication,
    Oauth2AuthStrategy,
    SessionStrategy,
    BasicStrategy,
  ];
  for (const s of strategies) {
    app.add(createBindingFromClass(s));
  }

  // Express style middleware interceptors
  app.bind('passport-init-mw').to(toInterceptor(passport.initialize()));
  app.bind('passport-facebook').toProvider(FacebookOauthInterceptor);
  app.bind('passport-google').toProvider(GoogleOauthInterceptor);
  app.bind('passport-twitter').toProvider(TwitterOauthInterceptor);
  app.bind('passport-oauth2').toProvider(CustomOauth2Interceptor);
  app.bind('set-jwt-user').toProvider(SessionAuth);
}
