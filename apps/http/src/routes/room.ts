import { Router } from "express";
import authMiddleware, { authRequest } from "../middleware";
import { createRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
const router: Router = Router();

const generateSlug = (name:String) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
}

router.post("/create", authMiddleware, async(req, res) => {
    const userId = (req as authRequest).userId;

    const input = createRoomSchema.safeParse(req.body);
    if(!input.success) {
        res.status(400).json({
            message: "Invalid inputs",
            errors: input.error
        });
        return;  
    }
    
    try {
        let baseSlug = generateSlug(input.data.name as String);
        let slug = baseSlug;
        let counter = 1;
        
        while(true) {
            const existingRoom = await prismaClient.room.findUnique({
                where: { slug }
            });
            if(!existingRoom) break;
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
      
        const room = await prismaClient.room.create({
            data: {
                slug: slug,
                name: input.data.name,
                adminId: userId,
            }
        });
        
       
        res.status(201).json({
            message: "Room created successfully",
            room: {
                id: room.id,
                slug: room.slug,
                name: room.name,
                createdAt: room.createdAt
            }
        });
        
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({
            message: "Failed to create room",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});
    


export default router;