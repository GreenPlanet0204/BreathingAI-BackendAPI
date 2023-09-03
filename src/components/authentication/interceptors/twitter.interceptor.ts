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

export class TwitterOauthInterceptor implements Provider<Interceptor> {
  constructor(
    @inject('twitterStrategyMiddleware')
    public twitterStrategy: ExpressRequestHandler,
  ) {}

  value() {
    return async (invocationCtx: InvocationContext, next: Next) => {
      const requestCtx = invocationCtx.getSync<RequestContext>(
        RestBindings.Http.CONTEXT,
      );
      const request = requestCtx.request;
      if (request.query['oauth2-provider-name'] === 'twitter') {
        return toInterceptor(this.twitterStrategy)(invocationCtx, next);
      }
      return next();
    };
  }
}
