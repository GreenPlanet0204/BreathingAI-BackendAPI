import {BrowserExtensionApi} from '@applications/BrowserExtension';
import {ApplicationConfig} from '@loopback/core';
import {BrethingAiApplication} from './application';

/**
 * Export the OpenAPI spec from the application
 */
async function exportOpenApiSpec(): Promise<void> {
  const config: ApplicationConfig = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST ?? 'localhost',
      openApiSpec: {
        setServersFromRequest: true,
      },
    },
    websocket: {
      port: 5000,
    },
  };
  const outFile = process.argv[2] ?? '';
  const app = new BrethingAiApplication(config);
  const restApp = new BrowserExtensionApi(app, config);
  await app.boot();
  await restApp.exportOpenApiSpec(outFile);
}

exportOpenApiSpec().catch(err => {
  console.error('Fail to export OpenAPI spec from the application.', err);
  process.exit(1);
});
