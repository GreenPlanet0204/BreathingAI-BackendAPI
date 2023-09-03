import {BrethingAiApplication} from '../../application';
import {createRestAppClient, Client} from '@loopback/testlab';
import {startApplication} from '../..';
import * as path from 'path';
import {ApplicationsBindings} from '../../applications/keys';
import {SocketIoApplication} from '@loopback/socketio';

const oauth2Providers = require(path.resolve(
  __dirname,
  './oauth2-test-provider',
));

export async function setupApplication(): Promise<AppWithClient> {
  const app = await startApplication(oauth2Providers);
  const restApplication = await app.get(
    ApplicationsBindings.REST_SERVER_APPLICATION,
  );
  const socket = await app.get(ApplicationsBindings.WEB_SOCKET_APPLICATION);
  const api = createRestAppClient(restApplication);
  return {app, api, socket};
}

export interface AppWithClient {
  app: BrethingAiApplication;
  api: Client;
  socket: SocketIoApplication;
}
