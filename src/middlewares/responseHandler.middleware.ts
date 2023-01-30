import { Request, Response, NextFunction } from "express";

export const responseHandler = (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    res.send = (data: any) => {
        const { statusCode, ...response } = data;
        const status = (statusCode >= 400) ? "failed" : "success";
        res.send = originalSend;
        return res.status(statusCode).send({ status, data: response})
    }
    next();
}