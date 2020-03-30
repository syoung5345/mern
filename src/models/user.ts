import mongoose from 'mongoose';

import './db';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        match: /^[a-zA-Z\d]([a-zA-Z\d]|[_-][a-zA-Z\d])+$/,
        minlength: 3,
        maxlength: 30,
        index: true,
        unique: true,
        required: true
    },
    firstname: {
        type: String,
        maxlength: 100,
        trim: true,
        required: true
    },
    lastname: {
        type: String,
        maxlength: 100,
        trim: true,
        required: true
    },
    email: {
        type: String,
        match: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student'],
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
      getters: false,
      virtuals: false,
      transform: (doc, obj, options) => {
        obj.id = obj._id;
        delete obj._id;
        delete obj.__v;
        return obj;
      }
    }
  });

export interface UserData {
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    role: string,
    salt: string,
    password: string
}

export interface User extends mongoose.Document, UserData {}; 

export const User = mongoose.model<User>('User', UserSchema);