import { Request, Response } from 'express';

import { Class } from '../../models/class';
import { User } from '../../models/user';

export async function getClassUsers(req: Request, res: Response) {
    const classid = res.locals.class;
    const c = await Class.findOne(classid).populate('User');

    // if (c.students !== null || c?.students !== undefined) {

    // }
    // else {
    //     res.json({message: 'could not find'})
    // }

    res.json(c?.students);
}

export async function addStudentToClass(req: Request, res: Response) {
    const user: User = res.locals.user;
    const c: Class = res.locals.class;
    
    c.students.push(user);
    await c.save();
    res.json(c);
}

export async function deleteStudentFromClass(req: Request, res: Response) {
    const user: User = res.locals.user;
    const c: Class = res.locals.class;
    
    c.students = c.students.filter(s => s !== user);
    await c.save(); 
    res.json(c);
}
