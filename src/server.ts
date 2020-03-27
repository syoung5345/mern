import http from 'http';

import { app } from './app';
import * as config from './config';

const server = http.createServer(app);
server.listen(config.portNumber, () => {
    console.log(`Listening on port ${config.portNumber}...`);
});