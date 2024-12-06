import express, { Express, NextFunction, Request, Response } from "express";
import userRouter from "../routes/User";
import { PrismaClient } from "@prisma/client";

interface ExpressRequest extends Request {
  prisma?: PrismaClient;
}

export default function routes(app: Express, prisma: PrismaClient) {
  app.use(express.json());
  app.use("/api/user", prismaMiddleware(prisma), userRouter);
}

function prismaMiddleware(prisma: PrismaClient) {
  return (req: ExpressRequest, res: Response, next: NextFunction) => {
    req.prisma = prisma; // Attach Prisma to the request object
    next();
  };
}
