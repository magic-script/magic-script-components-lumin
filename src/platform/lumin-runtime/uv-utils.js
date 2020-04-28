import uv, { Fs, fs } from 'uv'

/**
 * @param {string} path
 * @param {uv.Flags} flags
 * @param {number} mode
 * @returns {Promise<number>} fd
 */
export const open = (path, flags, mode) => new Promise((resolve, reject) => fs.open(new Fs(), path, flags, mode, (error, fd) => error ? reject(error) : resolve(fd)))

/**
 * @param {number} fd
 * @returns {Promise<void>}
 */
export const close = (fd) => new Promise((resolve, reject) => fs.close(new Fs(), fd, (error) => error ? reject(error) : resolve()))

/**
 * @param {number} fd
 * @param {ArrayBuffer|ArrayBufferView} buffer
 * @param {number} position
 * @returns {Promise<number>} bytesRead
 */
export const read = (fd, buffer, position) => new Promise((resolve, reject) => fs.read(new Fs(), fd, buffer, position, (error, bytesRead) => error ? reject(error) : resolve(bytesRead)))

/**
 * @param {number} fd
 * @param {ArrayBuffer|ArrayBufferView} buffer
 * @param {number} position
 * @returns {Promise<number>} bytesWritten
 */
export const write = (fd, buffer, position) => new Promise((resolve, reject) => fs.write(new Fs(), fd, buffer, position, (error, bytesWritten) => error ? reject(error) : resolve(bytesWritten)))

/**
 * @param {number} fd
 * @returns {Promise<uv.StatEntry>}
 */
export const fstat = (fd) => new Promise((resolve, reject) => fs.fstat(new Fs(), fd, (error, meta) => error ? reject(error) : resolve(meta)))

/**
 * @param {string} path
 * @param {string} newPath
 * @returns {Promise<void>}
 */
export const rename = (path, newPath) => new Promise((resolve, reject) => fs.rename(new Fs(), path, newPath, (error) => error ? reject(error) : resolve()))

/**
 * @param {string} path
 * @returns {Promise<void>}
 */
export const unlink = (path) => new Promise((resolve, reject) => fs.unlink(new Fs(), path, (error) => error ? reject(error) : resolve()))

/**
 * Convert a utf8 encoded Uint8Array into a unicode string (with surrogate pairs.)
 * @param {Uint8Array} bin
 * @returns {string}
 */
export function utf8Decode(bin) {
    let str = ''
    for (let i = 0, l = bin.length; i < l;) {
        const byte = bin[i++]
        const codePoint = byte < 0x80
            ? byte
            : byte >= 0xc0 && byte < 0xe0
                ? (byte & 0x1f) << 6 |
                bin[i++] & 0x3f
                : byte >= 0xe0 && byte < 0xf0
                    ? (byte & 0xf) << 12 |
                    (bin[i++] & 0x3f) << 6 |
                    bin[i++] & 0x3f
                    : byte >= 0xf0 && byte < 0xf8
                        ? (byte & 0x7) << 18 |
                        (bin[i++] & 0x3f) << 12 |
                        (bin[i++] & 0x3f) << 6 |
                        bin[i++] & 0x3f
                        : -1
        if (codePoint < 0) {
            throw new Error('Invalid UTF-8 value found in decoding')
        }
        str += String.fromCodePoint(codePoint)
    }
    return str
}

/**
 * @param {string} str
 * @returns {number}
 */
export function utf8Length(str) {
    let sizeNeeded = 0
    const length = str.length
    for (let i = 0; i < length; i++) {
        const codePoint = str.codePointAt(i)
        if (codePoint === undefined) break
        if (codePoint < 0x80) {
            sizeNeeded++
        } else if (codePoint < 0x800) {
            sizeNeeded += 2
        } else if (codePoint < 0x10000) {
            sizeNeeded += 3
        } else {
            i++
            sizeNeeded += 4
        }
    }
    return sizeNeeded
}

/**
 * Convert a unicode string (with surrogate pairs) into an utf8 encoded Uint8Array
 * @param {string} str
 * @returns {Uint8Array}
 */
export function utf8Encode(str) {
    const length = utf8Length(str)
    const buffer = new Uint8Array(length)
    let offset = 0
    for (let i = 0; i < length; i++) {
        const codePoint = str.codePointAt(i)
        if (codePoint === undefined) break
        if (codePoint < 0x80) {
            buffer[offset++] = codePoint
        } else if (codePoint < 0x800) {
            buffer[offset++] = 0xc0 | (codePoint >> 6)
            buffer[offset++] = 0x80 | (codePoint & 0x3f)
        } else if (codePoint < 0x10000) {
            buffer[offset++] = 0xe0 | (codePoint >> 12)
            buffer[offset++] = 0x80 | ((codePoint >> 6) & 0x3f)
            buffer[offset++] = 0x80 | (codePoint & 0x3f)
        } else {
            i++
            buffer[offset++] = 0xf0 | (codePoint >> 18)
            buffer[offset++] = 0x80 | ((codePoint >> 12) & 0x3f)
            buffer[offset++] = 0x80 | ((codePoint >> 6) & 0x3f)
            buffer[offset++] = 0x80 | (codePoint & 0x3f)
        }
    }
    return buffer
}

/**
 * @param {Uint8Array} bin
 * @returns {string}
 */
export function rawDecode(bin) {
    let str = ''
    for (let i = 0, l = bin.length; i < l; i++) {
        str += String.fromCharCode(bin[i])
    }
    return str
}

/**
 * @param {string} str
 * @returns {Uint8Array}
 */
export function rawEncode(str) {
    const bin = new Uint8Array(str.length)
    for (let i = 0, l = str.length; i < l; i++) {
        bin[i] = str.charCodeAt(i)
    }
    return bin
}

function getCodes() {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
}

/** @type {number[]} */
let map

function getMap() {
    if (map) return map
    map = []
    const codes = getCodes()
    for (let i = 0, l = codes.length; i < l; i++) {
        map[codes.charCodeAt(i)] = i
    }
    return map
}

// Loop over input 3 bytes at a time
// a,b,c are 3 x 8-bit numbers
// they are encoded into groups of 4 x 6-bit numbers
// aaaaaa aabbbb bbbbcc cccccc
// if there is no c, then pad the 4th with =
// if there is also no b then pad the 3rd with =
/**
 * @param {Uint8Array} bin
 * @returns {string}
 */
export function base64Decode(bin) {
    let b64 = ''
    const codes = getCodes()
    for (let i = 0, l = bin.length; i < l; i += 3) {
        const a = bin[i]
        const b = i + 1 < l ? bin[i + 1] : -1
        const c = i + 2 < l ? bin[i + 2] : -1
        b64 +=
            // Higher 6 bits of a
            codes[a >> 2] +
            // Lower 2 bits of a + high 4 bits of b
            codes[((a & 3) << 4) | (b >= 0 ? b >> 4 : 0)] +
            // Low 4 bits of b + High 2 bits of c
            (b >= 0 ? codes[((b & 15) << 2) | (c >= 0 ? c >> 6 : 0)] : '=') +
            // Lower 6 bits of c
            (c >= 0 ? codes[c & 63] : '=')
    }
    return b64
}

// loop over input 4 characters at a time
// The characters are mapped to 4 x 6-bit integers a,b,c,d
// They need to be reassembled into 3 x 8-bit bytes
// aaaaaabb bbbbcccc ccdddddd
// if d is padding then there is no 3rd byte
// if c is padding then there is no 2nd byte
/**
 * @param {string} b64
 * @returns {Uint8Array}
 */
export function base64Encode(b64) {
    const map = getMap()
    const bytes = []
    let j = 0
    for (let i = 0, l = b64.length; i < l; i += 4) {
        const a = map[b64.charCodeAt(i)]
        const b = map[b64.charCodeAt(i + 1)]
        const c = map[b64.charCodeAt(i + 2)]
        const d = map[b64.charCodeAt(i + 3)]

        // higher 6 bits are the first char
        // lower 2 bits are upper 2 bits of second char
        bytes[j] = (a << 2) | (b >> 4)

        // if the third char is not padding, we have a second byte
        if (c < 64) {
            // high 4 bits come from lower 4 bits in b
            // low 4 bits come from high 4 bits in c
            bytes[j + 1] = ((b & 0xf) << 4) | (c >> 2)

            // if the fourth char is not padding, we have a third byte
            if (d < 64) {
                // Upper 2 bits come from Lower 2 bits of c
                // Lower 6 bits come from d
                bytes[j + 2] = ((c & 3) << 6) | d
            }
        }
        j = j + 3
    }
    return new Uint8Array(bytes)
}
