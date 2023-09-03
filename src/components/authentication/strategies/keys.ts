import {BindingKey} from '@loopback/core';

export namespace AuthenticationMethodBindings {
  export const LOCAL = BindingKey.create<string>('local');
  export const BASIC = BindingKey.create<string>('basic');
  export const SESSION = BindingKey.create<string>('session');
  export const OAUTH2 = BindingKey.create<string>('oauth2');
}
