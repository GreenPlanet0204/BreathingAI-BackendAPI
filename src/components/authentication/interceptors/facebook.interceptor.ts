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

export class FacebookOauthInterceptor implements Provider<Interceptor> {
  constructor(
    @inject('facebookStrategyMiddleware')
    public facebookStrategy: ExpressRequestHandler,
  ) {}

  value() {
    return async (invocationCtx: InvocationContext, next: Next) => {
      const requestCtx = invocationCtx.getSync<RequestContext>(
        RestBindings.Http.CONTEXT,
      );
      const request = requestCtx.request;
      if (request.query['oauth2-provider-name'] === 'facebook') {
        return toInterceptor(this.facebookStrategy)(invocationCtx, next);
      }
      return next();
    };
  }
}
