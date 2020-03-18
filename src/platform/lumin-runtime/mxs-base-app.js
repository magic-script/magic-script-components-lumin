// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { AppPrismController } from './controllers/app-prism-controller.js';
import { ReactMagicScript } from '../../react-magic-script/react-magic-script.js';

import executor from './utilities/executor.js';
import { logInfo } from '../../util/logger.js';

export class MxsBaseApp {
  constructor(appComponent) {
      this._app = appComponent;
      this._prisms = [];
      this._prismControllers = [];
  }

  onAppStart(arg) {
    const container = {
      controller: {
        getRoot: () => ({ addChild: (child) => logInfo('App container - adding child (scene)') })
      }
    };

    ReactMagicScript.render(this._app, container);
  }

  updateLoop(delta) {
    if ( this._app.props.updateLoop !== undefined
      && typeof this._app.props.updateLoop === 'function') {
      this._app.props.updateLoop(delta);
    }

    return true;
  }

  eventListener(event) {
    if ( this._app.props.eventListener !== undefined
      && typeof this._app.props.eventListener === 'function') {
      // TODO: Convert Lumin RT event data to (abstract) Mxs event data
      this._app.props.eventListener(event);
    }

    return true;
  }

  getContainer(nodeName) {
    const prismController = this._prismControllers
      .find( controller => controller.findChild(nodeName) !== undefined );

    if (prismController === undefined) {
      throw new Error(`Cannot find container for node ${nodeName}`);
    }

    return prismController.getContainer(nodeName);
  }


  addPrism(properties, app) {
    const prismSize = properties.size;

    if (!Array.isArray(prismSize)) {
      throw new TypeError(`Prism size is not a vec3: ${prismSize}`);
    }

    const prism = executor.callNativeFunction(app, 'requestNewPrism', prismSize);
    this._prisms.push(prism);

    const controller = new AppPrismController(properties);
    this._prismControllers.push(controller);

    executor.callNativeAction(prism, 'setPrismController', controller);
    return prism;
  }

  removePrism(prism, app) {
    const controller = executor.callNativeFunction(prism, 'getPrismController');

    this._prismControllers = this._prismControllers.filter(c => c !== controller);
    this._prisms = this._prisms.filter(p => executor.callNativeFunction(p, 'getPrismId') !== executor.callNativeFunction(prism, 'getPrismId'));

    executor.callNativeAction(controller, 'deleteSceneGraph');
    executor.callNativeAction(prism, 'setPrismController', null);

    // Set Prism deletion after the current call completes.
    setTimeout(() => executor.callNativeAction(app, 'deletePrism', prism), 0)
  }
}