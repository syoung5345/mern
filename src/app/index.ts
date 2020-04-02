import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import expressHandlebars from 'express-handlebars';

import * as config from '../config';
import * as common from './common';
import * as api from './api';

// APPLICATION
export const app = express();

app.engine('hb', expressHandlebars({ extname: '.hb', defaultLayout: undefined }));
app.set('views', process.cwd() + '/templates');

if (config.logFormat) {
    app.use(morgan(config.logFormat));
}

app.use(bodyParser.urlencoded({
    type: 'application/x-www-form-urlencoded',
    extended: false,
    })
);
   
// MOUNT FEATURES
app.use('/api', api.routes);
app.use(express.static("./static"));

app.use(common.notFound);

app.use(common.serverError);