import './bootstrap';
import {ApplicationConfig, NeptuneApplication} from './application';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  
  console.log('******* neptune-app *******');
  console.dir(options, {depth: 8});
  
  const app = new NeptuneApplication(options);
  await app.boot();
  await app.start();

  //const restServer = app.getSync<RestServer>('servers.RestServer');

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Neptune is running at ${process.env.NEPTUNE_URL}`);
  console.log(`Try ${url}/ping`);

  return app;
}

const config = require('../config');

if (require.main === module) {
  // Run the application
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
