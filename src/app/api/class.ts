import { Request, Response, NextFunction } from "express";

import { Class } from '../../models/class';
import { User } from '../../models/user';

export async function getAllClasses(req: Request, res: Response) {
    const classes = await Class.find({}, {students: 0}).populate('User');
    
    console.log(classes);
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
    const c = res.locals.class;
    console.log(c.teacher);
    console.log(c.teacher.username);
    res.json({ 
        subject: c.subject,
        number: c.number,
        title: c.title,
        teacher: c.teacher
    });
}

// the teacher field may be either a document id or a username. 
export async function createClass(req: Request, res: Response) {
    req.body.students = [];
    const c = new Class(req.body);

    await c.save();
    res.json({ 
        subject: c.subject,
        number: c.number,
        title: c.title,
        teacher: c.teacher
    });
}

export async function updateClass(req: Request, res: Response) {
    const c: Class = res.locals.class;

    c.subject = req.body.subject;
    c.number = req.body.number;
    c.title = req.body.title;
    // the teacher field may be either a document id or a username. 
    //if id, use req.body, else find user's id
    c.teacher = req.body.teacher;
    c.students = c.students;

    await c.save();
    res.json({ 
        subject: c.subject,
        number: c.number,
        title: c.title,
        teacher: c.teacher
    });
}

export async function deleteClass(req: Request, res: Response) {
    const c: Class = res.locals.class;
    
    await c.remove();
    res.json(c);
}
