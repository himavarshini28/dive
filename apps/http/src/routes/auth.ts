import { Router } from "express";
import jwt from "jsonwebtoken";
import JWT_SECRET from "@repo/backend-common/config";
import {createSchema,signInSchema} from "@repo/common/types"
import {prismaClient} from "@repo/db/client";
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

router.use("signup",async (req,res)=>{
    const input=createSchema.safeParse(req.body);
    if(!input.success)
    {
        res.json({
            message:"Invalid inputs"
        })
        return;
    }
    try {
        
        await prismaClient.user.create(
            {
                data:{
                    email: input.data.email,
                    username:input.data.username,
                    password:input.data.password
                }
            }

        )
        res.json({
            userId:"123"
        })
    } catch (error) {
        res.status(409).json({
            message: "user already exists with the given email/username"
        })
    }
   
  
});

export default router;