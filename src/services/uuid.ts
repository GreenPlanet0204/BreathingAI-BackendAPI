import {v5} from 'uuid';

export function createUuid(namespace: UuidNamespaces, value: string) {
  return v5(value, namespace);
}

export enum UuidNamespaces {
  CUSTOMER = '5fe9d329-3b04-4846-bece-f14b576073d9',
  USER = '3633e60f-cedd-43e0-aba8-05e89b3e6a33',
  SOCKET = '6df06b1c-8841-428e-bc37-ddb71d4a5627',
  CONTENT = '539ec8b8-12df-4bbc-a156-d2b16ad1a033',
  USER_IMPROVEMENTS = '69913b73-df7a-43d6-8419-53760e75b090',
  USER_SETTINGS = '69913b73-df7a-43d6-8419-53760e75b142',
  USER_SCREENTIME = 'e04158a2-9b8c-4758-a6b1-4fd2940c6421',
  USER_TOKEN = 'ca04e609-7278-43ef-b38f-6f16c625cd42',
}
