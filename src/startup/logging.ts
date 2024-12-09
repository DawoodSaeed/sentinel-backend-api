import winston from "winston";
import "express-async-errors"; // Ensure async errors are handled

// Create the logger instance
const logger = winston.createLogger({
  level: "info", // Default log level
  format: winston.format.combine(
    winston.format.colorize(), // Colorize logs for console output
    winston.format.simple() // Simple log format
  ),
  transports: [
    // Console transport for logging to the console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Colorize console output
        winston.format.simple() // Keep it simple
      ),
      level: "info", // Set the level for console logs
    }),
    // File transport for logging to a file
    new winston.transports.File({
      filename: "logfile.log",
      format: winston.format.combine(
        winston.format.timestamp(), // Add a timestamp to the logs
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}]: ${message}`; // Custom log format
        })
      ),
      level: "info", // Set the level for file logs
    }),
  ],
});

// Handle uncaught exceptions
winston.exceptions.handle(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
    level: "error",
  }),
  new winston.transports.File({
    filename: "uncaughtExceptions.log",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ level, message, timestamp }) => {
        return `${timestamp} [${level}]: ${message}`; // Custom format
      })
    ),
    level: "error",
  })
);

// Handling unhandled promise rejections globally
process.on("unhandledRejection", (ex) => {
  logger.error(`Unhandled Rejection: ${ex}`);
  throw ex; // Rethrow to let uncaughtException handler catch it
});

// Export the logger so it can be used in the app
export { logger };
