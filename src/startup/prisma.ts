import { PrismaClient } from "@prisma/client";
import { logger } from "../startup/logging";
// Create a single instance of Prisma Client
const prisma = new PrismaClient();

// Graceful shutdown to disconnect Prisma Client when the server shuts down
if (process.env.NODE_ENV === "production") {
  prisma.$connect(); // Ensure Prisma Client is connected to the database
}

process.on("SIGINT", async () => {
  const now = new Date();
  const formattedDate = now.toLocaleString("en-US", {
    weekday: "long", // e.g., "Monday"
    year: "numeric", // e.g., "2024"
    month: "long", // e.g., "December"
    day: "numeric", // e.g., "9"
    hour: "numeric", // e.g., "10"
    minute: "numeric", // e.g., "30"
    second: "numeric", // e.g., "45"
    hour12: true, // 12-hour format
  });

  // Log the server shutdown with the formatted date using winston
  logger.info(`Shutting down the server. Date & Time is: ${formattedDate}`);

  // Disconnect Prisma Client when the server shuts down
  await prisma.$disconnect();

  // Exit the process
  process.exit(0);
});
// Export the singleton Prisma client
export default prisma;
