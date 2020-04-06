import { Request, Response } from "express";
import util from 'util';
import crypto from 'crypto';

import { User } from '../../models/user';
import * as config from '../../config';

const pbkdf2P = util.promisify(crypto.pbkdf2);

export async function updatePassword(req: Request, res: Response) { 
    const current = req.body.current;
    const password = req.body.password;
    const user: User = res.locals.user;
    const salt = Buffer.from(user.salt, 'base64');

    if (user) {
        if (user.role === 'admin') {
            const newPassword = await getNewPassword(password, salt);
            user.password = newPassword;

            await user.save();
            res.json({ updated: true });
        }
        else if (current) {
            const encryptedBuffer = await pbkdf2P(current, salt, config.ecryptionData.iterations, 
                config.ecryptionData.length, config.ecryptionData.hashAlg);
            const dbBuffer = Buffer.from(user.password, 'base64');
            

            if (encryptedBuffer.equals(dbBuffer)) {
                const newPassword = await getNewPassword(password, salt);
                user.password = newPassword;

                await user.save();
                res.json({
                    updated: true
                });
            }
        }
        else {
            res.json({ message: 'Password could not be updated' });
        }
    }
}

async function getNewPassword(password: string, salt: Buffer) {
    const newPasswordBuffer = await pbkdf2P(password, salt, config.ecryptionData.iterations, 
        config.ecryptionData.length, config.ecryptionData.hashAlg);
    return newPasswordBuffer.toString('base64');
}