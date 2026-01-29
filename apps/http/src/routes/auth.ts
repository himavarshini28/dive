import { Router } from "express";
import jwt from "jsonwebtoken";
import JWT_SECRET from "../config";
const router:Router = Router();

router.use("/signin",(req,res)=>{
  
     const userId = 1;   
    const token= jwt.sign({id:userId},JWT_SECRET);
    if(token)
    {
        res.send(token);
    }
    else 
    {
        res.status(403).send("error jwt token");
    }
});

router.use("signup",(req,res)=>{
    //TODO:zod validation
   //TODO:credentials saved on DB
});

export default router;