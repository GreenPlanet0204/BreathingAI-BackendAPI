import {
  Interceptor,
  InvocationContext,
  Next,
  Provider,
  service,
} from '@loopback/core';
import {RequestContext, RestBindings} from '@loopback/rest';
import {SecurityBindings} from '@loopback/security';
import {mapProfile} from '../strategies/types';
import {JwtSessionService} from '@services/core';

export class SessionAuth implements Provider<Interceptor> {
  constructor(
    @service(JwtSessionService)
    public jwt: JwtSessionService,
  ) {}

  value() {
    return async (invocationCtx: InvocationContext, next: Next) => {
      const requestCtx = invocationCtx.getSync<RequestContext>(
        RestBindings.Http.CONTEXT,
      );

      const request = requestCtx.request;

      if (request.cookies.session) {
        const user = await this.jwt.getUserFromToken(request.cookies.session);
        if (user) {
          requestCtx.bind(SecurityBindings.USER).to(mapProfile(user));
        }
      }
      return next();
    };
  }
}
