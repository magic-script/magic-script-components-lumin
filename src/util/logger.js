import configuration from '../configuration.js';

// MessageSeverity definition
const MessageSeverity = {};

Object.defineProperties(MessageSeverity, {
  'info': { enumerable: true, writable: false, value: 0 },
  'warning': { enumerable: true, writable: false, value: 1 },
  'error': { enumerable: true, writable: false, value: 2 },
  'exception': { enumerable: true, writable: false, value: 3 }
});

function logWithSeverity(severity, ...messageArgs) {
  if (severity >= configuration.logMinMessageSeverity) {
    console.log(...messageArgs);
  }
}

function logInfo(...messageArgs) {
  logWithSeverity(MessageSeverity.info, ...messageArgs);
}

function logWarning(...messageArgs) {
  logWithSeverity(MessageSeverity.warning, ...messageArgs);
}

function logError(...messageArgs) {
  logWithSeverity(MessageSeverity.error, ...messageArgs);
}

function logException(...messageArgs) {
  logWithSeverity(MessageSeverity.exception, ...messageArgs);
}

export { MessageSeverity, logWithSeverity, logInfo, logWarning, logError, logException };

// Logger definition
function log (message, messageSeverity) {
  const severity = messageSeverity === undefined ? MessageSeverity.info : messageSeverity;
  logWithSeverity(severity, message)
}

export default log;
