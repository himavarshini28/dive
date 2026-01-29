import { Router } from "express";
import authMiddleware from "../middleware";
const router:Router = Router();

router.use("/create",authMiddleware,(req,res)=>{
    //TODO
    res.send("room");
});



export default router;