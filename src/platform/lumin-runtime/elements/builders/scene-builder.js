import { ElementBuilder } from './element-builder.js';
import { MxsScene } from '../mxs-scene.js';

export class SceneBuilder extends ElementBuilder {
    create() {
        return new MxsScene();
    }
}
