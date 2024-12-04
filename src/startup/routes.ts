import express, { Express } from "express";

export default function routes(app: Express) {
  app.use(express.json());
}
