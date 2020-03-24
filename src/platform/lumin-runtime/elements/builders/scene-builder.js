import { ElementBuilder } from './element-builder.js';
import { MxsScene } from '../mxs-scene.js';

export class SceneBuilder extends ElementBuilder {
    create(app, properties) {

        this._callOnAppStart(app, properties.onAppStart);

        return new MxsScene();
    }

    _callOnAppStart (app, onAppStartHandler) {
        if (onAppStartHandler && typeof onAppStartHandler === 'function') {
            onAppStartHandler(app.OnAppStartData);
        }
    }
}
