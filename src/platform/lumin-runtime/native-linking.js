import { DispatchResult, TryOpenApplication } from 'lumin';

class NativeLinking {
  canOpenURL(url) {
    return new Promise((resolve, reject) => {
      if (url && typeof url === 'string' && url.length > 0) {
        resolve(true);
      } else {
        reject({ message: 'Invalid format.' });
      }
    });
  }

  openURL(url) {
    return new Promise((resolve, reject) => {
      const result = TryOpenApplication(url);
      if (result === DispatchResult.kOk) {
        resolve();
      } else {
        reject({ message: `Cannot open url: ${url}`, code: result.value });
      }
    });
  }
}

export { NativeLinking };
