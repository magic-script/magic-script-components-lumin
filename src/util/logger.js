import configuration from '../configuration.js';

// MessageSeverity definition
const MessageSeverity = {};

Object.defineProperties(MessageSeverity, {
  'info': { enumerable: true, writable: false, value: 0 },
  'warning': { enumerable: true, writable: false, value: 1 },
  'error': { enumerable: true, writable: false, value: 2 },
  'exception': { enumerable: true, writable: false, value: 3 }
});

export { MessageSeverity };

// Logger definition
function log (message, messageSeverity) {
    const severity = messageSeverity === undefined ? MessageSeverity.info : messageSeverity;

    if (severity >= configuration.logMinMessageSeverity) {
      console.log(message);
    }
  }

export default log;
