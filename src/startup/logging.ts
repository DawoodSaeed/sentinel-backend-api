import winston from "winston";
import "express-async-errors"; // Ensure async errors are handled
import path from "path";

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

// Define the log file path
const logFilePath = path.join(__dirname, "logs", "app.log");

// Create the logger
const fileLogger = winston.createLogger({
  level: "error", // Adjust the level as needed (e.g., 'info', 'warn', etc.)
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    // File transport
    new winston.transports.File({
      filename: logFilePath,
      handleExceptions: true, // Capture unhandled exceptions
    }),
  ],
  exitOnError: false, // Prevent exiting the process on error
});

// Export the logger so it can be used in the app
export { logger, fileLogger };
