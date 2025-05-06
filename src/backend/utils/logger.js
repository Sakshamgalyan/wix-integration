const { info } = require('console');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../../logs/payments.log')

function log(){
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${ProgramUpdateLevel.toupperCase()} : ${message}\n`;

    fs.appendFileSync(logFile, logEntry);
    console[level](logEntry.trim());
}

module.exports = {
    info: (message) => log('info', message),
    error: (message) => log('error', message),
    warn: (message) => log('warn', message),
}