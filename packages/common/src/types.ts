import {z} from "zod";

export const createSchema =
z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(3).max(20),
    name:z.string().min(2).max(30)
})

export const signInSchema =
z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(3).max(20)
})

export const createRoomSchema =
z.object({
    name:z.string().min(2).max(30)
})