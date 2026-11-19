const path = require("path");
const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const isTest = process.env.NODE_ENV === "test";

const logger = createLogger({
  level: process.env.LOG_LEVEL || "http",
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
                new DailyRotateFile({
          filename: path.join(__dirname, "logs", "combined-%DATE%.log"),
          datePattern: "YYYY-MM-DD",
          utc: true,
          maxSize: "20m",
          maxFiles: "14d",
          zippedArchive: true,
        }),
        new DailyRotateFile({
          filename: path.join(__dirname, "logs", "error-%DATE%.log"),
          level: "error",
          datePattern: "YYYY-MM-DD",
          utc: true,
          maxSize: "20m",
          maxFiles: "30d",
          zippedArchive: true,
        }),
      ],
});

module.exports = logger;