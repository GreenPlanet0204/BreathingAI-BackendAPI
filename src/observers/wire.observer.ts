import {
  Application,
  CoreBindings,
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {SocketIoApplication} from '@loopback/socketio';
import {ApplicationsBindings} from '../applications/keys';
import {setupBindings} from '../wiring';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('wire')
export class WireObserver implements LifeCycleObserver {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private mainApp: Application,
    @inject(ApplicationsBindings.REST_SERVER_APPLICATION)
    private restApp: RestApplication,
    @inject(ApplicationsBindings.WEB_SOCKET_APPLICATION)
    private socketApp: SocketIoApplication,
  ) {}

  /**
   * This method will be invoked when the application initializes. It will be
   * called at most once for a given application instance.
   */
  async init(): Promise<void> {
    setupBindings(this.mainApp);
    setupBindings(this.restApp);
    setupBindings(this.socketApp);
  }
}
