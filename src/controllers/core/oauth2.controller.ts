// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-passport-login
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  get,
  param,
  RequestWithSession,
  Response,
  RestBindings,
} from '@loopback/rest';
import {oAuth2InterceptExpressMiddleware} from '@authentication/interceptors/types';
import {AuthenticationMethodBindings} from '@authentication/strategies/keys';
import {JwtSessionService} from '@services/core';
import {User} from '@models/core';

/**
 * Login controller for third party oauth provider
 *
 * This controller demonstrates using passport strategies both as express middleware and as an independent strategy
 *
 * The method loginToThirdParty uses the @authenticate decorator to plugin passport strategies independently
 * The method thirdPartyCallBack uses the passport strategies as express middleware
 */
export class Oauth2Controller {
  constructor() {}

  @authenticate(AuthenticationMethodBindings.OAUTH2.key)
  @get('/auth/thirdparty/{provider}')
  /**
   * This method uses the @authenticate decorator to plugin passport strategies independently
   *
   * Endpoint: '/auth/thirdparty/{provider}'
   *          an endpoint for api clients to login via a third party app, redirects to third party app
   */
  loginToThirdParty(
    @param.path.string('provider') provider: string,
    @inject(AuthenticationBindings.AUTHENTICATION_REDIRECT_URL)
    redirectUrl: string,
    @inject(AuthenticationBindings.AUTHENTICATION_REDIRECT_STATUS)
    status: number,
    @inject(RestBindings.Http.RESPONSE)
    response: Response,
  ) {
    return {
      redirectUrl: redirectUrl,
    };
  }

  @oAuth2InterceptExpressMiddleware()
  @get('/auth/thirdparty/{provider}/callback')
  /**
   * This method uses the passport strategies as express middleware
   *
   * Endpoint: '/auth/thirdparty/{provider}/callback'
   *          an endpoint which serves as a oauth2 callback for the thirdparty app
   *          this endpoint sets the user profile in the session
   */
  async thirdPartyCallBack(
    @param.path.string('provider') provider: string,
    @inject(RestBindings.Http.REQUEST) request: RequestWithSession,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    if (request.user) {
      response.cookie(
        'session',
        JwtSessionService.createJwtFromUser(request.user as User),
      );
      response.redirect('https://app.breathing.ai/success');
    }
  }
}
