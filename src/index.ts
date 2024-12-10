import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import routes from "./startup/routes";
import { logger } from "./startup/logging";
import { formattedDate } from "./helpers/date";
const app = express();
const PORT = process.env.PORT || 3000;

// For security features
app.use(helmet());
helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
});
app.use(cors());
routes(app);

app.get("/", (req: Request, res: Response) => {
  logger.info(`Test end point is hit at ${formattedDate}`);
  res.send("Backend is up and working  ...");
});

app.listen(PORT, () => {
  logger.info(
    `Server is running at: http://localhost:${PORT} at ${formattedDate}`
  );
});
