import { Router } from "express";
import jwt from "jsonwebtoken";
import JWT_SECRET from "@repo/backend-common/config";
import {createSchema,signInSchema} from "@repo/common/types"
const router:Router = Router();

router.use("/signin",(req,res)=>{
  
     const input=signInSchema.safeParse(req.body);
    if(!input.success)
    {
        res.json({
            message:"Invalid inputs"
        })
        return;
    }
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
    const input=createSchema.safeParse(req.body);
    if(!input.success)
    {
        res.json({
            message:"Invalid inputs"
        })
        return;
    }
   //TODO:credentials saved on DB
});

export default router;