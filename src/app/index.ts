import express from 'express';
import morgan from 'morgan';
import expressSession from 'express-session';
import bodyParser from 'body-parser';
import expressHandlebars from 'express-handlebars';
import * as config from '../config';
import * as cloud from './cloud';

// APPLICATION
export const app = express();

app.engine('hb', expressHandlebars({ extname: '.hb', defaultLayout: undefined }));
app.set('views', process.cwd() + '/templates');

if (config.logFormat) {
    app.use(morgan(config.logFormat));
}

// app.use(expressSession({ ...config.sessionOptions, store: new FileStore() }));

app.use(bodyParser.urlencoded({
    type: 'application/x-www-form-urlencoded',
    extended: false,
    })
);
   
// MOUNT FEATURES
app.use(express.static("./static"));
app.use('/cloud', cloud.routes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.status(404);
    res.write(`The requested URL ${req.url} was not found on this server.`);
});