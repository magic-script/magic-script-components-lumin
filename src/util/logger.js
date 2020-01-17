// MessageSeverity definition
const MessageSeverity = {};

Object.defineProperty(MessageSeverity, 'info', { enumerable: true, writable: false, value: 0 });
Object.defineProperty(MessageSeverity, 'warning', { enumerable: true, writable: false, value: 1 });
Object.defineProperty(MessageSeverity, 'error', { enumerable: true, writable: false, value: 2 });
Object.defineProperty(MessageSeverity, 'exception', { enumerable: true, writable: false, value: 3 });

export { MessageSeverity };

// Logger definition
export default class Logger {
  constructor (messageSeverity) {
    this._messageSeverity = messageSeverity;
  }

  log (message, messageSeverity) {
    if (messageSeverity !== undefined && messageSeverity >= this._messageSeverity) {
      console.log(message);
    }
  }
}
