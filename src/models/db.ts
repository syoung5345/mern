import mongoose from 'mongoose';

import * as config from '../config';
 
const credentials = {
  user: config.db.username,
  pass: config.db.password
};
 
export const db = mongoose.connect(
  `mongodb://${config.db.hostname}/${config.db.dbname}`,
  credentials.user ? credentials : undefined
);