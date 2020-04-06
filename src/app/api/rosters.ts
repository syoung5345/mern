import { Request, Response } from 'express';

import { Class } from '../../models/class';
import { User } from '../../models/user';
import { notFound } from './common';

export async function getClassUsers(req: Request, res: Response) {
    const c = await Class.findById(res.locals.class.id, {students: 1}).populate('User');

    if (c) {
        res.json(c.students);
    }
    else {
        notFound(req, res);
    }
}

export async function addStudentToClass(req: Request, res: Response) {
    const user: User = res.locals.user;
    const c: Class = res.locals.class;
    
    if (c.students.includes(user)) {
        res.json(c);
    }
    else {
        c.students.push(user);
        await c.save();
        res.json(c);
    }
}

export async function deleteStudentFromClass(req: Request, res: Response) {
    const user: User = res.locals.user;
    const c: Class = res.locals.class;
    
    c.students = c.students.filter(s => s.toString() !== user.id);

    await c.save(); 
    res.json(c);
}
