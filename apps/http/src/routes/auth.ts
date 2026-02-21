import { Router } from "express";
import jwt from "jsonwebtoken";
import JWT_SECRET from "@repo/backend-common/config";
import { createSchema, signInSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";
const router: Router = Router();

router.post("/signin", async (req, res) => {
  const input = signInSchema.safeParse(req.body);
  if (!input.success) {
    return res.json({
      message: "Invalid email/password",
    });
    return;
  }
  try {
    const user = await prismaClient.user.findUnique({
      where: {
        email: input.data.email,
      },
    });
    if(!user)
    {
       return  res.status(400).json({message:"user not found"});
    }
    const isMatched = await bcrypt.compare(input.data.password,user?.password as string);
    if(!isMatched)
    {
       return res.status(400).json({
            message:"Invalid Credentials"
        })
    }
    const token = jwt.sign({ id:user?.id }, JWT_SECRET);
    if (token) {
      res.json({
        token
      })
    } else {
      res.status(403).send("error jwt token");
    }
  } catch (e) {
    res.status(403).json({
        message:e
    })
  }
});

router.post("/signup", async (req, res) => {
  const input = createSchema.safeParse(req.body);
  if (!input.success) {
    res.json({
      message: "Invalid inputs",
    });
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(input.data.password, 5);
    const user = await prismaClient.user.create({
      data: {
        email: input.data.email,
        username: input.data.username,
        password: hashedPassword,
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (error) {
    res.status(411).json({
      message: "user already exists with the given email/username",
    });
  }
});

export default router;
