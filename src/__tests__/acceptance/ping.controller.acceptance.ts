import {Client} from '@loopback/testlab';
import {BrethingAiApplication} from '../../application';
import {setupApplication} from './test-helper';

describe('PingController', () => {
  let app: BrethingAiApplication;
  let api: Client;

  before('setupApplication', async () => {
    ({app, api} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET api/ping', async () => {
    await api.get('/api/ping?msg=world').expect(200);
  });
});
