import express, { Request, Response } from "express";
import http from "http";
const app = express();
const PORT = process.env.PORT || 3000;

import routes from "./startup/routes";

routes(app);



app.get("/", (req: Request, res: Response) => {
  res.send("Api is working ...");
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running at: http://localhost:${PORT}`);
});
