import { Request, Response, NextFunction } from "express";
import util from 'util';
import crypto from 'crypto';

import * as config from '../../config';
import { User } from '../../models/user';
import { TokenPayload } from '../../models/token';

export async function getAllUsers(req: Request, res: Response) {
    const roles = ['admin', 'teacher'];
    const payload: TokenPayload = res.locals.login || '';
    console.log(payload.role);

    if (roles.includes(payload.role)) {
        const users = await User.find();
        res.json(users); 
    }
    else {
        const user = await User.findById(payload.sub);
        res.json(user);
    }
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
    const roles = ['admin', 'teacher'];
    const payload: TokenPayload = res.locals.login || '';
    const user = res.locals.user;

    if (user.userid === payload.sub) {
        res.json(user);
    }
    else if (roles.includes(payload.role)) {
        res.json(user);
    }
    else {
        res.status(403);
        res.json({ message: `User ${payload.preferred_username} is not authorized`});
    }
}

export async function createUser(req: Request, res: Response) {
    const salt = crypto.randomBytes(8);
    const pbkdf2P = util.promisify(crypto.pbkdf2);
    const encryptedBuffer = await pbkdf2P(req.body.password, salt, 
        config.ecryptionData.iterations, config.ecryptionData.length, config.ecryptionData.hashAlg);
    const encryptedPassword = encryptedBuffer.toString('base64');

    req.body.salt = salt;
    req.body.password = encryptedPassword;
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
