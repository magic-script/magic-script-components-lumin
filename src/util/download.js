import { logWarning } from './logger.js';

const REGEX_URL = /^(http(s?):\/\/.*)/;

export function isUrl(url) {
    return REGEX_URL.test(url);
}

export async function saveResource (remotePath) {
    if (!isUrl(remotePath)) {
        logWarning(`Remote path ${remotePath} is not a valid URL.`);
        return remotePath;
    }

    return await download(remotePath);
}

export default async function download (urlAddress) {
    if (!isUrl(urlAddress)) {
        throw new TypeError('Invalid URL address');
    }

    let response;
    try {
        response = await fetch(urlAddress);
    } catch (error) {
        throw new Error(`Fetching form ${urlAddress} failed, error: ${error.message}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP error, status = ${response.status}`);
    }

    return await response.cacheFile;
}
