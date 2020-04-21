class NativeFileSystem {
    
    writeFile(path, content, encoding) {
        return Promise.reject(new Error('Write file function is not implemented yet'));
    }

    readFile(path, encoding) {
        return Promise.reject(new Error('Read file function is not implemented yet'));
    }

    deleteFile(path) {
        return Promise.reject(new Error('Delete file function is not implemented yet'));
    }

    moveFile(srcPath, dstPath) {
        return Promise.reject(new Error('Move file function is not implemented yet'));
    }
}

export { NativeFileSystem };
