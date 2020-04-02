import { Request, Response, NextFunction } from "express";

import { Class } from '../../models/class';
import { User } from '../../models/user';

// These services should hide any students—you should not be able to 
// read or write students using these services. 

export async function getAllClasses(req: Request, res: Response) {
    const classes = await Class.find().populate('User', 'id firstname lastname');
    res.json(classes); 
}

export async function lookupClass(req: Request, res: Response, next: NextFunction, classId: string) {
    if (classId.match(/^[a-f\d]{24}$/i)) {
        res.locals.class = await Class.findById(classId).populate('User', 'id firstname lastname');
    }
    else {
        const subject = classId.substr(0, 4).toUpperCase();
        const number = Number(classId.substr(4));
        res.locals.class = await Class.findOne({subject: subject, number: number}).populate('User', 'id firstname lastname');
    }
    
    if (res.locals.class) {
        next();
    }
    else {
        res.status(404);
        res.json({ message: `Could not find class: ${classId}`})
    }
}

export async function getClass(req: Request, res: Response) {
    const c = await Class.find(res.locals.class).populate('User', 'id firstname lastname');
    res.json(c);
}

// the teacher field may be either a document id or a username. 
export async function createClass(req: Request, res: Response) {
    const c = new Class(req.body);
    await c.save();
    res.json(c);
}

export async function updateClass(req: Request, res: Response) {
    const c: Class = res.locals.class;

    c.subject = req.body.subject;
    c.number = req.body.number;
    c.title = req.body.title;
    // the teacher field may be either a document id or a username. 
    c.teacher = req.body.teacher;
    c.students = req.body.students;

    await c.save();
    res.json(c);
}

export async function deleteClass(req: Request, res: Response) {
    const c: Class = res.locals.class;
    
    await c.remove();
    res.json(c);
}
