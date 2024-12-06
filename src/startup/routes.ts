import express, { Express } from "express";
import userRouter from "../routes/User";

export default function routes(app: Express) {
  app.use(express.json());
  app.use("/api/user", userRouter);
}
