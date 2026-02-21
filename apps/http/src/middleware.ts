import express, { Request, NextFunction, Response, RequestHandler } from "express"
import jwt  from "jsonwebtoken";
import JWT_SECRET from "@repo/backend-common/config";

export interface authRequest extends Request
{
    userId: string
}

const authMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token=req.headers.authorization;
        if (!token) {
            res.status(401).send("Missing token");
            return;
        }
        
        const decode = jwt.verify(token, JWT_SECRET) as { id: string };
        if(decode)
        {
            (req as authRequest).userId = decode.id;
            next(); 
        }
        else 
        {
            res.status(401).send("Invalid token");
            return; 
        }
    } catch (error) {
        res.status(401).send("Invalid or expired token");
        return;
    }
}

export default authMiddleware;