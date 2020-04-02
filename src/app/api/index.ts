import express from 'express';
import bodyParser from 'body-parser';

import * as users from './user';
import * as classes from './class';
import * as rosters from './rosters';
import * as login from './login';
import * as password from './password';
import { notFound } from './common';

export const routes = express.Router();

routes.use(bodyParser.json());

routes.param('userid', users.lookupUser);
routes.param('classid', classes.lookupClass);

//Login
routes.post('/login', login.login);

routes.all('/*', login.authenticate);
routes.put('/password/:userid', password.updatePassword('current', 'newpass'));

//Users
routes.get('/users/', users.getAllUsers);
routes.get('/users/:userid', users.getUser);
routes.post('/users/', login.isAuthorized('admin'), users.createUser);
routes.put('/users/:userid', login.isAuthorized('admin'), users.updateUser);
routes.delete('/users/:userid', login.isAuthorized('admin'), users.deleteUser);

//Classes
routes.get('/classes/', classes.getAllClasses);
routes.get('/classes/:classid', classes.getClass);
routes.post('/classes/', login.isAuthorized('admin', 'teacher'), classes.createClass);
routes.put('/classes/:classid', login.isAuthorized('admin', 'teacher'), classes.updateClass);
routes.delete('/classes/:classid', login.isAuthorized('admin', 'teacher'), classes.deleteClass);

//Rosters
routes.get('/rosters/:classid', login.isAuthorized('admin', 'teacher'), rosters.getClassUsers);
routes.put('/rosters/:classid/userid', login.isAuthorized('admin', 'teacher'), rosters.addStudentToClass);
routes.delete('/rosters/:classid/userid', login.isAuthorized('admin', 'teacher'), rosters.deleteStudentFromClass)

routes.use(notFound);