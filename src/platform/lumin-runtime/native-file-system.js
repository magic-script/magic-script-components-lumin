import { open, write, close, read } from "magic-script-polyfills/src-ts/fs-promised.ts"
import { b64ToBin, rawToBin, strToBin, binToStr } from "magic-script-polyfills/src/bintools.js"


class NativeFileSystem {
    
     async writeFile(path, contents, encoding) {
        const fd = await open(path, "w", 0o644);
        try {
            const body = encoding === 'utf8' ? strToBin(contents)
            : encoding === 'base64' ? b64ToBin(contents)
            : encoding === 'ascii' ? rawToBin(contents) 
            : `Unsupported encoding '${encoding}'`;
            if(body === `Unsupported encoding '${encoding}'`) {
                throw new Error(body)
            }
            await write(fd, body, 0);
        } finally {
            await close(fd);
        }
    }

    async readFile(path, encoding) {
        const fd = await open(path, "r", 0o444);
        try {
            let content = new Uint8Array(64 * 1024);
            await read(fd, content, 0);
            binToStr(content);
        } finally {
            await close(fd);
        }
    }

    deleteFile(path) {
        return new Promise(new Error('Function delete is not implemented yet'))    
    }

    moveFile(srcPath, dstPath) {
        return new Promise(new Error('Function delete is not implemented yet'))    
    }
}

export { NativeFileSystem };
