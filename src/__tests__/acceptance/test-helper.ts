import {NeptuneApplication} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import {NeptuneDataSource} from '../../datasources';
import dbConfig from '../../datasources/neptune.datasource.config';
import config from '../../../config';
import supertest from 'supertest';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    host: process.env.API_HOST,
    // port: +process.env.API_PORT,
    port: 9000,
    // openApiSpec: {
    //   // useful when used with OpenAPI-to-GraphQL to locate your application
    //   setServersFromRequest: true,
    // },
  });

  console.log('******* tests *******');
  console.dir(restConfig, {depth: 8});
  console.dir(dbConfig, {depth: 8});

  const app = new NeptuneApplication({
    ...config,
    rest: restConfig,
  });

  await app.boot();

  //app.bind('datasources.neptune').to(testDb);

  await app.start();

  const client = supertest('http://localhost:9000');
  //const client = createRestAppClient(app);

  return {app, client};
}

export const testDb = new NeptuneDataSource({
  ...dbConfig,
});

export function errorToMessage(bodyError: object): string {
  return JSON.stringify(bodyError, null, 2);
}

export interface AppWithClient {
  app: NeptuneApplication;
  client: Client;
}
