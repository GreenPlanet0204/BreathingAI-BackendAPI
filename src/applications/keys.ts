import {BindingKey} from '@loopback/core';

import {RestApplication} from '@loopback/rest';
import {SocketIoApplication} from '@loopback/socketio';

export namespace ApplicationsBindings {
  export const REST_SERVER_APPLICATION = BindingKey.create<RestApplication>(
    'application.rest-api',
  );

  export const WEB_SOCKET_APPLICATION = BindingKey.create<SocketIoApplication>(
    'application.websocket',
  );
}
