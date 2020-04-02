import mongoose from 'mongoose';

import './db';
import { User } from './user';

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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        //how to make sure that user is teacher
        // validate: {
        //     validator: (id: mongoose.Schema.Types.ObjectId) => id == Math.floor(id),
        //     message: '{VALUE} is not an integer'
        // },
        required: true
    },
    students: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        //how to make sure user is student
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
    teacher: User,
    students: User[]
}

export interface Class extends mongoose.Document, ClassData {}; 

export const Class = mongoose.model<Class>('Class', ClassSchema);