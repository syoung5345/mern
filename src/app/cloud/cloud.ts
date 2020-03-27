import { Response, Request, NextFunction } from "express";

export function cloud(req: Request, res: Response, next: NextFunction) {
    res.redirect(303, '/todo/list');
}

export function view(req: Request, res: Response, next: NextFunction) {
    res.sendFile('/css/cloud.css');
}

export function download(req: Request, res: Response, next: NextFunction) {
    const path = req.body.path || '';
    const filename = req.body.filename || '';
    res.download(path, filename);
}