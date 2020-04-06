import { Request, Response, NextFunction } from "express";

import { Class } from '../../models/class';
import { User } from '../../models/user';
import { lookupUser } from "./user";

export async function getAllClasses(req: Request, res: Response) {
    const classes = await Class.find({}, {students: 0}).populate('teacher', 'id firstname lastname');
    res.json(classes); 
}

export async function lookupClass(req: Request, res: Response, next: NextFunction, classId: string) {
    if (classId.match(/^[a-f\d]{24}$/i)) {
        res.locals.class = await Class.findById(classId).populate('teacher', 'id firstname lastname');
    }
    else {
        const subject = classId.substr(0, 4).toUpperCase();
        const number = Number(classId.substr(4));
        res.locals.class = await Class.findOne({subject: subject, number: number}).populate('teacher', 'id firstname lastname');
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
    res.json({ 
        subject: c.subject,
        number: c.number,
        title: c.title,
        teacher: c.teacher
    });
}

export async function createClass(req: Request, res: Response) {
    const userId = req.body.teacher || '';

    if (userId.match(/^[a-f\d]{24}$/i)) {
        res.locals.user = await User.findById(userId);
    }
    else {
        res.locals.user = await User.findOne({username: userId});
    }
    // lookupUser(req, res, )

    if (res.locals.user.role === 'teacher') {
        req.body.students = [];
        req.body.teacher = res.locals.user.id;
        const c = new Class(req.body);
        await c.save();
        res.json({ 
            subject: c.subject,
            number: c.number,
            title: c.title,
            teacher: c.teacher
        });
    }
    else {
        res.json({message: `User ${req.body.teacher.username} is not a teacher`});
    }
}

export async function updateClass(req: Request, res: Response) {
    const c: Class = res.locals.class;

    c.subject = req.body.subject;
    c.number = req.body.number;
    c.title = req.body.title;
    const userId = req.body.teacher;
    if (userId.match(/^[a-f\d]{24}$/i)) {
        res.locals.user = await User.findById(userId);
    }
    else {
        res.locals.user = await User.findOne({username: userId});
    }

    c.teacher = res.locals.user.id;
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
