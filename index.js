import configuration from './src/configuration.js';
import { generateTypeScript } from './src/util/gen-type-script.js';

export default {
    _init() {
        this._nativeFactory = new configuration.nativeFactory(configuration.nativeMapping);
    },

    bootstrap(app) {
        this._init();

        this._app = this._nativeFactory.createApp(app);
    },

    getContainer(nodeName) {
        return this._app.getContainer(nodeName);
    },

    generateTypeScript
}
