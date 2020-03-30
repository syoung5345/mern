import { Request, Response, NextFunction } from "express";

import { User } from '../../models/user';

export async function getAllUsers(req: Request, res: Response) {
    const users = await User.find();
    res.json(users); 
}

export async function lookupUser(req: Request, res: Response, next: NextFunction, userId: string) {
    if (userId.match(/^\w(24)$/)) {
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
        res.json({ message: `Requested url ${req.originalUrl} is not found`})
    }
}

export async function getUser(req: Request, res: Response) {
    const user = await User.find(res.locals.user);
    res.json(user); 
}

export async function createUser(req: Request, res: Response) {
    // const user = req.body;
    // const user = User.insert({});
    // res.json(user);
}

