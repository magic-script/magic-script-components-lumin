import { ElementBuilder } from './element-builder.js';
import { MxsScene } from '../mxs-scene.js';

export class SceneBuilder extends ElementBuilder {
    constructor() {
        super();
        this._appEventNames = ['onAppPause', 'onAppResume'];
    }

    _callOnAppStart (app, onAppStartHandler) {
        if (onAppStartHandler && typeof onAppStartHandler === 'function') {
            onAppStartHandler(app.OnAppStartData);
        }
    }

    _updateListeners(app, oldProperties, newProperties, updateAction, selector) {
        this._appEventNames.forEach(eventName => {
            app[updateAction](eventName, selector(oldProperties[eventName], newProperties[eventName]));
        });
    }

    create(app, properties) {
        this._callOnAppStart(app, properties.onAppStart);

        this._updateListeners(app, {}, properties, 'addListener', (oldValue, newValue) => newValue);

        return new MxsScene();
    }

    update (prism, oldProperties, newProperties, app) {
        this._updateListeners(app, oldProperties, newProperties, 'removeListener', (oldValue, newValue) => oldValue);
        this._updateListeners(app,  oldProperties, newProperties, 'addListener', (oldValue, newValue) => newValue);
    }
}
