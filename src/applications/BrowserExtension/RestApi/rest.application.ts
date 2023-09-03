import {AuthenticationComponent} from '@loopback/authentication';

import {
  Application,
  ApplicationConfig,
  ContextTags,
  CoreBindings,
  inject,
  lifeCycleObserver,
} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import path from 'path';
import {
  PingController,
  SecurityController,
  SubscriptionController,
  UserController,
  CustomerController,
  UserDevicesController,
  UserVitalsController,
  Oauth2Controller,
} from '@controllers/core';
import {RestApiSequence} from './sequence';
import {ApplicationsBindings} from '../../keys';
import {RepositoryMixin} from '@loopback/repository';
import {ServiceMixin} from '@loopback/service-proxy';

import {
  EmailService,
  JwtSessionService,
  PassportUserIdentityService,
  PasswordService,
  PaymentService,
  UserService,
} from '@services/core';

import {PostgreSqlDataSource} from '@datasources/postgre-sql.datasource';
import {
  UserVitalsRepository,
  UserRepository,
  UserCredentialsRepository,
  UserIdentityRepository,
  VitalSignsRepository,
  UserDevicesRepository,
  DeviceAuthenticationRepository,
  SubscriptionRepository,
  CustomerRepository,
  ImprovemnetEventRepository,
  CreatorRepository,
  ContentRepository,
  UserImprovementsRepository,
  UserColorRepository,
  UserBookmarksRepository,
  UserTokenRepository,
} from '@repositories/core';
import {
  SettingsController,
  ColorsController,
  BrowserExtensionEvents,
  AnalyticsController,
} from '@controllers/browser-extension';
import {ExtensionSettingsRepository} from '@repositories/browser-extension';
import {ScreenTimeController} from '@controllers/browser-extension/screentime.controller';
import {UserScreenTimeRepository} from '@repositories/browser-extension/user-screentime.repository';

export {ApplicationConfig};

/**
 * Rest API
 */
@lifeCycleObserver('', {
  tags: {[ContextTags.KEY]: ApplicationsBindings.REST_SERVER_APPLICATION},
})
export class BrowserExtensionApi extends RepositoryMixin(
  ServiceMixin(RestApplication),
) {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) mainApp: Application,
    @inject(CoreBindings.APPLICATION_CONFIG) mainAppConfig: ApplicationConfig,
  ) {
    const options = {...mainAppConfig};

    options.rest = {
      ...options.rest,
      port: process.env.REST_PORT,
      protocol: 'http',
      openApiSpec: {
        setServersFromRequest: true,
      },
      cors: {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: true,
        optionsSuccessStatus: 204,
        maxAge: 86400,
        credentials: true,
      },
    };

    super(options);

    // Set up the custom sequence
    this.sequence(RestApiSequence);

    this.component(AuthenticationComponent);

    // Set up default home page
    this.static('/', path.join(__dirname, './public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });

    // @TODO
    // this.configure(AuthenticationBindings.COMPONENT).to({
    //   failOnError: true,
    //   defaultMetadata: {
    //     starategy: 'session',
    //   },
    // });

    this.component(RestExplorerComponent);

    this.dataSource(new PostgreSqlDataSource());

    //services
    this.service(PasswordService);
    this.service(PaymentService);
    this.service(PassportUserIdentityService);
    this.service(JwtSessionService);
    this.service(EmailService);
    this.service(UserService);

    //repositories
    this.repository(UserRepository);
    this.repository(UserCredentialsRepository);
    this.repository(UserIdentityRepository);
    this.repository(UserVitalsRepository);
    this.repository(VitalSignsRepository);
    this.repository(UserDevicesRepository);
    this.repository(DeviceAuthenticationRepository);
    this.repository(SubscriptionRepository);
    this.repository(CustomerRepository);
    this.repository(ContentRepository);
    this.repository(UserImprovementsRepository);
    this.repository(ImprovemnetEventRepository);
    this.repository(CreatorRepository);
    this.repository(UserColorRepository);
    this.repository(UserBookmarksRepository);
    this.repository(UserTokenRepository);

    //Extension Repositories
    this.repository(ExtensionSettingsRepository);
    this.repository(UserScreenTimeRepository);

    //Core Ccontrollers
    this.controller(PingController);
    this.controller(SecurityController);
    this.controller(UserController);
    this.controller(CustomerController);
    this.controller(UserDevicesController);
    this.controller(UserVitalsController);
    this.controller(SubscriptionController);
    this.controller(Oauth2Controller);
    this.controller(AnalyticsController);
    this.controller(ScreenTimeController);

    //Extension Crontrollers
    this.controller(SettingsController);
    this.controller(ColorsController);
    this.controller(BrowserExtensionEvents);
  }
}
