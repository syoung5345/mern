import jwt from 'jsonwebtoken';
import util from 'util';
 
export const signP = util.promisify(jwt.sign) as
    <T = object>(payload: T, secret: jwt.Secret, options?: jwt.SignOptions) => Promise<string>;
export const verifyP = util.promisify(jwt.verify) as
    <T = object>(payload: string, secret: jwt.Secret, options?: jwt.VerifyOptions) => Promise<T>;