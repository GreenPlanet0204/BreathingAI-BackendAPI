import {
  AuthenticateFn,
  AuthenticationBindings,
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  FindRoute,
  InvokeMethod,
  InvokeMiddleware,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import cookieParser from 'cookie-parser';
const SequenceActions = RestBindings.SequenceActions;

export class RestApiSequence implements SequenceHandler {
  /**
   * Optional invoker for registered middleware in a chain.
   * To be injected via SequenceActions.INVOKE_MIDDLEWARE.
   */
  @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
  protected invokeMiddleware: InvokeMiddleware = () => false;

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS)
    protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) protected send: Send,
    @inject(SequenceActions.REJECT) protected reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;

      // CORS
      response.header('Access-Control-Allow-Origin', '*');
      response.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Methods',
      );
      if (request.method === 'OPTIONS') {
        response.status(200);
        this.send(response, 'ok');
      }

      const finished = await this.invokeMiddleware(context, [
        cookieParser(),

        // session({secret: 'breathing-ai'}),
      ]);

      if (finished) return;

      const route = this.findRoute(request);

      // usually authentication is done before proceeding to parse params
      // but in our case we need the path params to know the provider name
      const args = await this.parseParams(request, route);

      // if provider name is available in the request path params, set it in the query
      if (route.pathParams?.provider) {
        request.query['oauth2-provider-name'] = route.pathParams.provider;
      }

      //call authentication action
      await this.authenticateRequest(request);

      // Authentication successful, proceed to invoke controller
      const result = await this.invoke(route, args);

      this.send(response, result);
    } catch (error) {
      if (
        error.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        error.code === USER_PROFILE_NOT_FOUND
      ) {
        Object.assign(error, {statusCode: 401 /* Unauthorized */});
      }
      this.reject(context, error);
    }
  }
}
