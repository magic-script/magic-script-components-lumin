import { ElementBuilder } from './element-builder.js';
import { MxsScene } from '../mxs-scene.js';

export class SceneBuilder extends ElementBuilder {
    constructor() {
        this._appEventNames = ['onAppPause', 'onAppResume'];
    }

    _callOnAppStart (app, onAppStartHandler) {
        if (onAppStartHandler && typeof onAppStartHandler === 'function') {
            onAppStartHandler(app.OnAppStartData);
        }
    }

    _callAppFunction(app, functionName, ...args) {
        app[functionName](...args);
    }

    _updateListeners(app, oldProperties, newProperties, updateAction, predicate) {
        this._appEventNames.forEach(eventName => {
            if (predicate(oldProperties[eventName], newProperties[eventName])) {
                this._callAppFunction(app, updateAction, eventName, oldProperties.onAppPause);
            }
        });
    }

    create(app, properties) {
        this._callOnAppStart(app, properties.onAppStart);

        this._updateListeners(undefined, {}, properties, 'addListener', (oldValue, newValue) => !oldValue && newValue);

        return new MxsScene();
    }

    update (prism, oldProperties, newProperties, app) {
        this._updateListeners(app, oldProperties, newProperties, 'removeListener', (oldValue, newValue) => oldValue && !newValue);
        this._updateListeners(app,  oldProperties, newProperties, 'addListener', (oldValue, newValue) => !oldValue && newValue);
    }
}
