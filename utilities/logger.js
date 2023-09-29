const fs = require('fs');
const path = require('path');
const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const { LOG_DIR } = require('@config');

// Logs directory
const logDir = path.join(__dirname, LOG_DIR);

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Define log format
const logFormat = winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat,
    ),
    transports: [
        // Debug log setting
        new winstonDaily({
            level: 'debug',
            datePattern: 'YYYY-MM-DD',
            dirname: path.join(logDir, 'debug'), // Log file /logs/debug/*.log to save
            filename: `%DATE%.log`,
            maxFiles: 30, // Saved for 30 days
            json: false,
            zippedArchive: true,
        }),
        // Error log setting
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: path.join(logDir, 'error'), // Log file /logs/error/*.log to save
            filename: `%DATE%.log`,
            maxFiles: 30, // Saved for 30 days
            handleExceptions: true,
            json: false,
            zippedArchive: true,
        }),
    ],
});

logger.add(
    new winston.transports.Console({
        format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
    }),
);

const stream = {
    write: (message) => {
        logger.info(message.substring(0, message.lastIndexOf('\n')));
    },
};

module.exports = { logger, stream };
