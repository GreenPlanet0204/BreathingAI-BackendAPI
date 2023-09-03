import {BootMixin} from '@loopback/boot';
import {Application, ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestServer} from '@loopback/rest';

import {ServiceMixin} from '@loopback/service-proxy';
import {ApplicationsBindings} from './applications/keys';
import dotenv from 'dotenv';
import {
  BroswerExtensionSocket,
  BrowserExtensionApi,
} from '@applications/BrowserExtension';
import {oauth2ProfileFunction} from '@authentication/strategies/types';

export {ApplicationConfig};

export class BrethingAiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(Application)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here

    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
      models: {
        dirs: ['models'],
        extensions: ['.mdoels.js'],
        nested: true,
      },
      repositories: {
        dirs: ['repositories'],
        extensions: ['.repository.js'],
        nested: true,
      },
    };

    this.lifeCycleObserver(BrowserExtensionApi);
    this.lifeCycleObserver(BroswerExtensionSocket);

    dotenv.config();
  }

  public async setupAppliations() {
    const browserExtensionRestServerApi = await this.get(
      ApplicationsBindings.REST_SERVER_APPLICATION,
    );
    const browserExtensionSocket = await this.get(
      ApplicationsBindings.WEB_SOCKET_APPLICATION,
    );

    // Setup Sub Applicaiotion
    browserExtensionRestServerApi
      .bind('authentication.oauth2.profile.function')
      .to(oauth2ProfileFunction);
    browserExtensionRestServerApi
      .bind('facebookOAuth2Options')
      .to(this.options.facebookOptions);
    browserExtensionRestServerApi
      .bind('googleOAuth2Options')
      .to(this.options.googleOptions);
    browserExtensionRestServerApi
      .bind('twitterOAuthOptions')
      .to(this.options.twitterOptions);
    browserExtensionRestServerApi
      .bind('customOAuth2Options')
      .to(this.options.oauth2Options);

    const webSocketApplicationServer = browserExtensionSocket.socketServer;
    const restApplicationServer = await browserExtensionRestServerApi.getServer(
      RestServer,
    );

    return {
      restApplicationerverUrl: restApplicationServer.url,
      webSocketApplicationerverUrl: webSocketApplicationServer.url,
    };
  }
}
