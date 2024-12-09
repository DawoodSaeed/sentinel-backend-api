import { PrismaClient } from "@prisma/client";
import { logger } from "../startup/logging";
import { formattedDate } from "../helpers/date";
// Create a single instance of Prisma Client
const prisma = new PrismaClient();

// Graceful shutdown to disconnect Prisma Client when the server shuts down
if (process.env.NODE_ENV === "production") {
  prisma.$connect(); // Ensure Prisma Client is connected to the database
}

process.on("SIGINT", async () => {
  // Log the server shutdown with the formatted date using winston
  logger.info(`Shutting down the server. Date & Time is: ${formattedDate}`);

  // Disconnect Prisma Client when the server shuts down
  await prisma.$disconnect();

  // Exit the process
  process.exit(0);
});
// Export the singleton Prisma client
export default prisma;
