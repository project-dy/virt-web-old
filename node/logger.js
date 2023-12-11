const winston = require("winston");
const winstonDaily = require("winston-daily-rotate-file");
const process = require("process");

const { combine, timestamp, label, printf } = winston.format;

const config = { 
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    http: 3,
    info: 4,
    verbose: 5,
    silly: 6,
    custom: 7
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    http: 'magenta',
    info: 'green',
    verbose: 'cyan',
    silly: 'grey',
    custom: 'yellow'
  }
}

winston.addColors(config.colors);

//* Log file storage path → Root path/logs folder
const logDir = `${process.cwd()}/logs`;

//* Log output format definition function
const logFormat = printf(({ level, message, label, timestamp }) => {
  // console.log('logFormat', level, message, label, timestamp);
  // console.log(`${timestamp} [${label}] [${level}]: ${message}`);
  return `${timestamp} [${label}] [${level}]: ${message}`; // 날짜 [시스템이름] 로그레벨 메세지
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  levels: config.levels,
  // Define log format
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    label({ label: "virt-web" }), // Application name
    logFormat // Format log output
    //? Format: The Timestamp and Label format values defined in combine() are defined by entering the LogFormat. Level or message is automatic definition in the console
  ),
  level: "info", // Set the log level to info level
  //* How to record the actual log
  transports: [
    //* Set the file to store info level logs (automatically includes error: 0 and warn: 1 logs above info: 2)
    new winstonDaily({
      level: "info", // In INFO level
      datePattern: "YYYY-MM-DD", // File timestamp format
      dirname: logDir, // Log file storage path
      filename: `%DATE%.log`, // Log file name format
      maxFiles: 30, // Maximum number of log files
      zippedArchive: true,
    }),
    //* File setting to save the ERROR level log (automatically included in INFO, but deliberately subtracted)
    new winstonDaily({
      level: "error", // In ERROR level
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/error", // Save under /logs/error
      filename: `%DATE%.error.log`, // File name format
      maxFiles: 30,
      zippedArchive: true,
    }),
    //* File setting to save the http level log (automatically included in INFO, but deliberately subtracted)
    new winstonDaily({
      level: "http", // In HTTP level
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/http", // Save under /logs/http
      filename: `%DATE%.http.log`, // File name format
      maxFiles: 30,
      zippedArchive: true,
    }),
    //* File setting to save the custom level log (All levels)
    new winstonDaily({
      level: "custom", // In CUSTOM level
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/full", // Save under /logs/custom
      filename: `%DATE%.full.log`, // File name format
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
  //* uncaughtException (unhandled exception) log setting
  exceptionHandlers: [
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      filename: `%DATE%.exception.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

const isProduction = process.env.NODE_ENV === "production";

//* Morgan compatibliy
logger.stream = {
  write: (message) => {
    if (isProduction) {
      logger.http(message.trim());
    }
  },
};

//* On dev
if (!isProduction) {
  logger.add(
    new winston.transports.Console({
      levels: config.levels,
      level: "verbose",
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(
          (info) => {
            return `[ ${info.level} ] ▶  ${info.message}`;
          },
        ),
      )
    })
  );
}

module.exports = logger;
