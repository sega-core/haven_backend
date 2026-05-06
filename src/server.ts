import app from './app';
import config from './config/config';

import { initDb } from './db/models';
/* import { launchBot } from './tgBot'; */

(async () => {
  await initDb();
})();

/* (async () => {
  await launchBot();
})(); */

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});