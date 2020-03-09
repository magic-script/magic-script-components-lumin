export class SceneBuilder {
    constructor() {
    }

    create() {
        const scene = { prisms: [] };

        Object.defineProperty(scene, 'addChild$Universal', {
          enumerable: true,
          writable: false,
          configurable: false,
          value: (child) => scene.prisms.push(child)
        });

        return scene;
    }

    validate(prism, oldProperties, newProperties) {
        console.log('SceneBuilder.validate has not been implemented yet');
    }

    update(prism, oldProperties, newProperties) {
        console.log('SceneBuilder.update has not been implemented yet');
    }
}
