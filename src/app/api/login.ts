import { Request, Response, NextFunction } from "express";
import util from 'util';
import crypto from 'crypto';

import * as jwt from '../../utils/jwt';
import * as config from '../../config';
import { User } from "../../models/user";
import { TokenPayload } from '../../models/token';

export async function login(req: Request, res: Response) {
    const username = req.body.username;
    const password = req.body.password;
    const user = await databaseLookup(username);

    if (user) {
        const salt = Buffer.from(user.salt, 'base64');
        const pbkdf2P = util.promisify(crypto.pbkdf2);
        const encryptedBuffer = await pbkdf2P(password, salt, config.ecryptionData.iterations, 
            config.ecryptionData.length, config.ecryptionData.hashAlg);

        const dbBuffer = Buffer.from(user.password, 'base64');
    
        //check password and username combo with database
        if (user.username === username && encryptedBuffer.equals(dbBuffer)) {
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
    }
}

export async function databaseLookup(username: string) {
    return await User.findOne({ username: username });
}

//Are they who they say they are? If not give 401 challenge
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


export function isAuthorized(...roles:string[]) {
    return async function(req: Request, res: Response, next: NextFunction) {
        const payload: TokenPayload = res.locals.login || '';
    
        if (roles.includes(payload.role)) {
            next();
        }
        else {
            res.status(403);
            res.json({ message: `User ${payload.preferred_username} not authorized` });
        }
    }
}
