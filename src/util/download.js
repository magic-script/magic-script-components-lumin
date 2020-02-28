import { logWarning } from './logger.js';

const REGEX_URL = /^(http(s?):\/\/.*)/;

export function isUrl(url) {
  return REGEX_URL.test(url);
}

export async function download (urlAddress, writablePath) {
    // Validate input parameters
    if (writablePath === null || writablePath === undefined || writablePath === '') {
        throw new TypeError('Invalid writable path');
    }

    const result = REGEX_URL.exec(urlAddress);
    if (result === null) {
        throw new TypeError('Invalid URL address');
    }

    // Download the asset
    let response;
    try {
        response = await fetch(result[0]);
    } catch (error) {
        throw new Error(`Fetching form ${result[0]} failed, error: ${error.message}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP error, status = ${response.status}`);
    }

    // Store the asset to the local file system
    const parts = result[0].split('/')
    const name = parts[parts.length - 1];
    const fullPath = writablePath + name;
    try {
        response = await fetch(`file://${fullPath}`, { method: 'PUT', body: response.body });
    } catch (error) {
        throw new Error(`Saving file to file://${fullPath} failed, error: ${error.message}`);
    }

    if (!response.ok) {
        throw new Error(`Saving ${name} failed, status =  ${response.status}`);
    }

    return fullPath;
}

export default async function saveResource (remotePath, localPath) {
    const result = REGEX_URL.exec(remotePath);

    if (result === null) {
        logWarning(`Remote path ${remotePath} is not a valid URL.`);
        return remotePath;
    }

    return await download(remotePath, localPath);
}
