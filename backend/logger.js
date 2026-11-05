const path = require("path");
const { createLogger, format, transports } = require("winston");

const isTest = process.env.NODE_ENV === "test";

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack, ...meta }) => {
      const extra = Object.keys(meta).length ? " " + JSON.stringify(meta) : "";
      return `${timestamp} ${level}: ${stack || message}${extra}`;
    })
  ),
  transports: isTest
    ? [new transports.Console({ silent: true })]
    : [
        new transports.Console(),
        new transports.File({ filename: path.join(__dirname, "logs", "error.log"), level: "error" }),
        new transports.File({ filename: path.join(__dirname, "logs", "combined.log") }),
      ],
});

module.exports = logger;