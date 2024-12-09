import express, { Express, NextFunction, Request, Response } from "express";
import userRouter from "../routes/User";
import { PrismaClient } from "@prisma/client";

export default function routes(app: Express) {
  app.use(express.json());
  app.use("/api/user", userRouter);
}
