import {z} from "zod";

export const createSchema =
z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(3).max(20),
    email:z.string().email()
})

export const signInSchema =
z.object({
    email: z.string().email(),
    password: z.string().min(3).max(20)
})

export const createRoomSchema =
z.object({
    name:z.string().min(2).max(50)
})