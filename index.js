import configuration from './src/configuration.js';
import { generateTypeScript } from './src/util/gen-type-script.js';
import { PlatformInformation } from './src/platform/lumin-runtime/platform-information.js';
import { NativePlaneDetector } from './src/platform/lumin-runtime/native-plane-detector.js';
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
        XrClientProvider.getXrClient()._setNativeApp(this._app);
    },

    getContainer(nodeName) {
        return this._app.getContainer(nodeName);
    },

    generateTypeScript,

    PlatformInformation,

    NativePlaneDetector
}
