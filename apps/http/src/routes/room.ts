import { Router } from "express";
import authMiddleware from "../middleware";
import { createRoomSchema } from "@repo/common/types";
const router:Router = Router();

router.use("/create",authMiddleware,(req,res)=>{
    //TODO
     const input=createRoomSchema.safeParse(req.body);
        if(!input.success)
        {
            res.json({
                message:"Invalid inputs"
            })
        }
    res.send("room");
});
    


export default router;