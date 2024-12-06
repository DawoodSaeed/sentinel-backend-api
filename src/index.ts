import express, { Request, Response } from "express";
import routes from "./startup/routes";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

routes(app, prisma);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is up and working  ...");
});

async function main() {
  app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
  });
}

main()
  .then(() => {
    prisma.$disconnect();
  })
  .catch((ex) => {
    console.log("Server has shutown.");
    prisma.$disconnect();
    process.exit(0);
  });

// Security Features
// 1. Santize the input parameters
// 2. Use Helmet to secure the application
// 3. Use Rate Limiter to limit the number of requests
// 4. Use CORS to secure the application
// 5. Use HTTPS to secure the application
// 6. Use JWT to secure the application
// 7. Use OAuth to secure the application
// 8. Use CSRF to secure the application
// 9. Use Content Security Policy to secure the application
// 10. Use X-Content-Type-Options to secure the application
// 11. Use X-Frame-Options to secure the application
// 12. Use X-XSS-Protection to secure the application
// 13. Use NoSQL Injection to secure the application
// 14. Use SQL Injection to secure the application
// 15. Use Cross Site Scripting to secure the application
// 16. Use Cross Site Request Forgery to secure the application
// 17. Use Secure Cookies to secure the application
