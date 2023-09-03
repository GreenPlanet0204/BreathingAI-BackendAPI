import {oauth2ProfileFunction} from '@authentication/strategies/types';

import {BrethingAiApplication} from './application';
import {config as appConfig} from './config';

/**
 * Prepare server config
 * @param oauth2Providers
 */
export async function serverConfig(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  oauth2Providers: any,
) {
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      gracePeriodForClose: 5000, // 5 seconds
      expressSettings: {
        'trust proxy': true,
      },
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
    },
    facebookOptions: oauth2Providers['facebook-login'],
    googleOptions: oauth2Providers['google-login'],
    twitterOptions: oauth2Providers['twitter-login'],
    oauth2Options: oauth2Providers['oauth2'],
  };
  return config;
}

/**
 * bind resources to application
 * @param app
 */
export async function setupApplication(app: BrethingAiApplication) {
  app.bind('authentication.oauth2.profile.function').to(oauth2ProfileFunction);
}

export async function startApplication(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  oauth2Providers: any,
): Promise<BrethingAiApplication> {
  const config = await serverConfig(oauth2Providers);
  const app = new BrethingAiApplication(config);
  await setupApplication(app);
  await app.boot();
  await app.migrateSchema();
  await app.start();

  return app;
}

export async function main() {
  const app = await startApplication(appConfig.oauthProviders);
  const urls = await app.setupAppliations();

  console.log(`API is running at ${urls.restApplicationerverUrl}`);
  console.log(`Websocket is running at ${urls.webSocketApplicationerverUrl}`);
}

if (require.main === module) {
  main().catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
