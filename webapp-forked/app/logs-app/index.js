const winston = require('winston');
const path = require('path');
const fs = require('fs');

const logFilePath = path.join(__dirname, 'app.log');

if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, ''); 
  }

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: logFilePath })
    ],
});

logger.info('Logger has been initialized successfully');

module.exports = logger;
