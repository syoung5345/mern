import express from 'express';

import * as users from './user';
import { notFound } from './common';

export const routes = express.Router();

routes.param('userId', users.lookupUser);

routes.get('/users/', users.getAllUsers);
routes.get('/users/:userid', users.getUser);
routes.post('/users/', users.createUser);

routes.use(notFound);