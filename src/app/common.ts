import { Request, Response, NextFunction } from "express";


export function notFound(req: Request, res: Response) {
    res.status(404);
    res.render('notFound.hb', {url: req.originalUrl});
}

export function serverError(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    res.status(500);
    res.render('serverError.hb');
}