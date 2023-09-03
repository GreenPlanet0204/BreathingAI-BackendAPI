import {
  ApplicationConfig,
  ContextTags,
  CoreBindings,
  inject,
  lifeCycleObserver,
} from '@loopback/core';
import {SocketIoApplication} from '@loopback/socketio';

import {BrethingAiApplication} from '../../../application';
import debugFactory from 'debug';
import {ApplicationsBindings} from '../../keys';
import {SocketIoController} from '@controllers/socket/socket.controller';

export {ApplicationConfig};

const debug = debugFactory('socket');

@lifeCycleObserver('', {
  tags: {[ContextTags.KEY]: ApplicationsBindings.WEB_SOCKET_APPLICATION},
})
export class BroswerExtensionSocket extends SocketIoApplication {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) mainApp: BrethingAiApplication,
    @inject(CoreBindings.APPLICATION_CONFIG) mainAppConfig: ApplicationConfig,
  ) {
    super(mainAppConfig);

    this.socketServer.use((socket, next) => {
      debug('Global middleware - socket:', socket.id);
      next();
    });

    const ns = this.socketServer.route(SocketIoController);
    ns.use((socket, next) => {
      debug(
        'Middleware for namespace %s - socket: %s',
        socket.nsp.name,
        socket.id,
      );
      next();
    });
  }
}
