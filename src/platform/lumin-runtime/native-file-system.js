import {
    utf8Encode, utf8Decode, rawEncode, rawDecode, base64Encode, base64Decode,
    open, close, read, write, fstat, unlink, rename
} from './uv-utils.js'

/**
 * Encode a string using RNFS encoding strings.
 * @param {string} str
 * @param {"utf8"|"ascii"|"base64"} encoding
 * @returns Uint8Array
 */
function encode(str, encoding = 'utf8') {
    switch (encoding) {
        case 'utf8': return utf8Encode(str)
        case 'ascii': return rawEncode(str)
        case 'base64': return base64Encode(str)
    }
    throw new Error(`Unsupported encoding '${encoding}'`)
}

/**
 * Decode a string using RNFS encoding strings.
 * @param {Uint8Array} bin
 * @param {"utf8"|"ascii"|"base64"} encoding
 * @returns string
 */
function decode(bin, encoding = 'utf8') {
    switch (encoding) {
        case 'utf8': return utf8Decode(bin)
        case 'ascii': return rawDecode(bin)
        case 'base64': return base64Decode(bin)
    }
    throw new Error(`Unsupported encoding '${encoding}'`)
}

export class NativeFileSystem {
    /**
       * @param {string} path
       * @param {string} contents
       * @param {"utf8"|"ascii"|"base64"} encoding
       * @returns {Promise<void>}
       */
    async writeFile(path, contents, encoding = 'utf8') {
        const fd = await open(path, 'w', 0o644)
        try {
            const binary = encode(contents, encoding)
            let offset = 0
            while (offset < binary.length) {
                const bytesWritten = await write(fd, binary.subarray(offset), offset)
                if (bytesWritten === 0) throw new Error('Unable to write bytes')
                offset += bytesWritten
            }
        } finally {
            await close(fd)
        }
    }

    /**
       * @param {string} path
       * @param {"utf8"|"ascii"|"base64"} encoding
       * @returns {Promise<string>}
       */
    async readFile(path, encoding = 'utf8') {
        const fd = await open(path, 'r', 0o444)
        try {
            const { size } = await fstat(fd)
            const bin = new Uint8Array(size)
            let offset = 0
            while (offset < size) {
                const bytesRead = await read(fd, bin, offset)
                if (bytesRead === 0) throw new Error('Unable to read bytes')
                offset += bytesRead
            }
            return decode(bin, encoding)
        } finally {
            await close(fd)
        }
    }

    /**
       * @param {string} path
       * @returns {Promise<void>}
       */
    deleteFile(path) { return unlink(path) }

    /**
       * @param {string} srcPath
       * @param {string} dstPath
       * @returns {Promise<void>}
       */
    moveFile(srcPath, dstPath) { return rename(srcPath, dstPath) }
}
