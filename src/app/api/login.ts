import { Request, Response, NextFunction } from "express";

import * as jwt from '../../utils/jwt';
import * as config from '../../config';
import { User } from "../../models/user";

export interface TokenPayload {
    sub: string;
    preferred_username: string;
    role: string;
}

//authentication(is user logged in)
export async function login(req: Request, res: Response) {
    const username = req.body.username;
    const password = req.body.password;
    // const user = await User.findOne({username: username });
    const user = await databaseLookup(username);

    //check password and username combo in database
    if (user && user.username === username && user.password === password) {
        const token = await jwt.signP<TokenPayload>(
            { 
                sub: user.id,
                preferred_username: user.username,
                role: user.role
            },
            config.jwtSecret,
            { expiresIn: '1hr' }
        );
        res.json({ login: true, token: token });
    }
    else {
        res.json({ login: false, message: 'invalid username / password'});
    }


    //encript password
}

export async function databaseLookup(username: string) {
    return await User.findOne({username: username });
}

//are they who they say they are
//if not give 401 challenge
export async function authenticate(req: Request, res: Response, next: NextFunction) {
    let payload: TokenPayload | null = null;

    const authorizationHeader = req.get('Authorization') || '';
    const match = authorizationHeader.match(/Bearer\s+(\S+)/i);

    if (match) {
        const token = match[1];
       
        try {
          payload = await jwt.verifyP<TokenPayload>(token, config.jwtSecret);
        }
        catch (err) {
          console.log(err);
        }
    }

    if (payload) {
        res.locals.login = payload;
        next();
    }
    else {
        res.status(401);
        res.json({ message: 'User not authenticated' });
    }
}


export async function isAuthorized(req: Request, res: Response, next: NextFunction) {
    const payload: TokenPayload = res.locals.login || '';

    const roles = ['admin', 'teacher'];

    //if admin or teacher
    if (roles.includes(payload.role)) {
        next();
    }
    else {
        res.status(403);
        res.json({ message: `User ${payload.preferred_username} not authorized` });
    }
}
