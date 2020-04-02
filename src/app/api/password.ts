import { Request, Response } from "express";

import { User } from '../../models/user';

export function updatePassword(current: string, password: string) { 
    return async function (req: Request, res: Response) {
        const user: User = res.locals.user;
    
        user.username = req.body.username;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.email = req.body.email;
        user.role = req.body.role;
        user.salt = user.salt;
    
        // verify that it is the correct password before updating.
        if (user.password === current) {
            user.password = password;

            //encript before storing in db

            await user.save();
            //return obj with updated property set to true if updated successfully
            res.json({
                updated: true
            });
        }
        else {
            res.json({ message: 'could not update password' });
        }
    
    }
}