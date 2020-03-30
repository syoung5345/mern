import mongoose from 'mongoose';

import './db';

const ClassSchema = new mongoose.Schema({
    subject: {
        type: String,
        minlength: 4,
        maxlength: 4,
        uppercase: true,
        required: true
    },
    number: {
        type: Number,
        min: 1000,
        max: 9999,
        required: true
    },
    title: {
        type: String,
        trim: true,
        maxlength: 200,
        required: true
    },
    teacher: {
        required: true
    },
    students: {
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

export interface ClassData {
    subject: string,
    number: number,
    title: string,
    teacher: IDBIndex,
    students: IDBArrayKey
}

export interface Class extends mongoose.Document, ClassData {}; 

export const User = mongoose.model<Class>('User', ClassSchema);