import { Request, Response, NextFunction } from "express";

import { User } from '../../models/user';

export async function getAllUsers(req: Request, res: Response) {
    const users = await User.find();
    res.json(users); 
}

export async function lookupUser(req: Request, res: Response, next: NextFunction, userId: string) {
    if (userId.match(/^[a-f\d]{24}$/i)) {
        res.locals.user = await User.findById(userId);
    }
    else {
        res.locals.user = await User.findOne({username: userId});
    }
    
    if (res.locals.user) {
        next();
    }
    else {
        res.status(404);
        res.json({ message: `Could not find user: ${userId}`})
    }
}

export async function getUser(req: Request, res: Response) {
    const user = await User.find(res.locals.user);
    // const user = res.locals.user;
    res.json(user); 
}

export async function createUser(req: Request, res: Response) {
    const user = new User(req.body);
    await user.save();
    res.json(user);
}

export async function updateUser(req: Request, res: Response) {
    const user: User = res.locals.user;

    user.username = req.body.username;
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.role = req.body.role;
    user.salt = user.salt;
    user.password = user.password;

    await user.save();
    res.json(user);
}

export async function deleteUser(req: Request, res: Response) {
    const user: User = res.locals.user;
    
    await user.remove();
    res.json(user);
}
