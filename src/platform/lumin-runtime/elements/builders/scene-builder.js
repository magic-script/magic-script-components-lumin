import { MxsScene } from '../mxs-scene.js';

export class SceneBuilder {
    create() {
        return new MxsScene();
    }

    validate(prism, oldProperties, newProperties) {
        console.log('SceneBuilder.validate has not been implemented yet');
    }

    update(prism, oldProperties, newProperties) {
        console.log('SceneBuilder.update has not been implemented yet');
    }
}
