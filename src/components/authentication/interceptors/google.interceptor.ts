import {
  inject,
  Interceptor,
  InvocationContext,
  Next,
  Provider,
} from '@loopback/core';
import {
  ExpressRequestHandler,
  RequestContext,
  RestBindings,
  toInterceptor,
} from '@loopback/rest';

export class GoogleOauthInterceptor implements Provider<Interceptor> {
  constructor(
    @inject('googleStrategyMiddleware')
    public googleStrategy: ExpressRequestHandler,
  ) {}

  value() {
    return async (invocationCtx: InvocationContext, next: Next) => {
      const requestCtx = invocationCtx.getSync<RequestContext>(
        RestBindings.Http.CONTEXT,
      );
      const request = requestCtx.request;

      if (request.query['oauth2-provider-name'] === 'google') {
        return toInterceptor(this.googleStrategy)(invocationCtx, next);
      }
      return next();
    };
  }
}
