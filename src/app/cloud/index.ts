import express from 'express';
import * as cloud from "./cloud";

// ROUTER
export const routes = express.Router();

routes.get('/', function(req: express.Request, res: express.Response) {
    const data = {
       currentDirectory: process.cwd(),
       items: [
           {
                directory: true,
                name: 'code'
           },
           {
                directory: false,
                name: 'hello.txt'
           },
           {
                directory: false,
                name: 'a.html'
           }
       ]
    };
    res.status(200);
    res.type("text/html");
    res.render('cloud.hb', data);
});

routes.get('/', cloud.view);
routes.post('/download', cloud.download);
