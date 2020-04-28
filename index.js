import configuration from './src/configuration.js';
import { generateTypeScript } from './src/util/gen-type-script.js';
import { PlatformInformation } from './src/platform/lumin-runtime/platform-information.js';
import { NativeLinking } from './src/platform/lumin-runtime/native-linking.js';
import { NativePlaneDetector } from './src/platform/lumin-runtime/native-plane-detector.js';
import { NativeFileSystem } from './src/platform/lumin-runtime/native-file-system.js';
import { XrClient } from './src/platform/lumin-runtime/xr-client.js';
import { XrClientProvider } from 'magic-script-components';

XrClientProvider.setXrClient(new XrClient());

export default {
    _init() {
        this._nativeFactory = new configuration.nativeFactory(configuration.nativeMapping);
    },

    bootstrap(app) {
        this._init();

        this._app = this._nativeFactory.createApp(app);
        XrClientProvider.getXrClient().setNativeApp(this._app);
    },

    getContainer(nodeName) {
        return this._app.getContainer(nodeName);
    },

    generateTypeScript,
    PlatformInformation,
    NativeLinking,
    NativePlaneDetector,
    NativeFileSystem
}
