import express, { Request, NextFunction, Response } from "express"
import jwt  from "jsonwebtoken";
import JWT_SECRET from "@repo/backend-common/config";
const authMiddleware=(req:Request,res:Response,next:NextFunction)=>{
     const token=req.headers.authorization;
    const decode=jwt.verify(token ||"",JWT_SECRET);
    if(decode)
    { //@ts-ignore
        req.decode=decode ;
    }
    else 
    {
        res.status(401).send("Invalid or missing token");
    }
}

export default authMiddleware;