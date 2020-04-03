import { DispatchResult, TryOpenApplication } from 'lumin';

class NativeLinking {
  canOpenURL(url) {
    return new Promise((resolve, reject) => {
      if (url && typeof url === 'string' && url.length > 0) {
        resolve(true);
      } else {
        reject('Invalid url format.');
      }
    });
  }

  openURL(url) {
    return new Promise((resolve, reject) => {
      const result = TryOpenApplication(url);
      if (result === DispatchResult.kOk) {
        resolve();
      } else {
        reject(result);
      }
    });
  }
}

export { NativeLinking };
