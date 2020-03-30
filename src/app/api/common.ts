import { Request, Response } from "express";


export function notFound(req: Request, res: Response) {
    res.status(404);
    res.json({ message: `Requested url ${req.originalUrl} is not found`})
}