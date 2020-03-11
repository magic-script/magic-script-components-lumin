// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { LandscapeApp, ui } from 'lumin';
import { AppPrismController } from './controllers/app-prism-controller.js';
import { ReactMagicScript } from '../../react-magic-script/react-magic-script.js';

import executor from './utilities/executor.js';
import { logInfo } from '../../util/logger.js';

export class MxsLandscapeApp extends LandscapeApp {
    // The 0.5 value is the number of seconds to call `updateLoop` in an interval if
    // there are no other events waking the event loop.
    constructor(appComponent, timeDelta) {
        super(timeDelta);

        this._app = appComponent;
        this._prisms = [];
        this._prismControllers = [];
    }

  init() {
    return 0;
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


  addPrism(properties) {
    const prismSize = properties.size;

    if (!Array.isArray(prismSize)) {
      throw new TypeError(`Prism size is not a vec3: ${prismSize}`);
    }

    const prism = this.requestNewPrism(prismSize);
    this._prisms.push(prism);

    const controller = new AppPrismController(properties);
    this._prismControllers.push(controller);

    prism.setPrismController(controller);
    return prism;
  }

  removePrism(prism) {
    const controller = prism.getPrismController();

    this._prismControllers = this._prismControllers.filter(c => c !== controller);
    this._prisms = this._prisms.filter(p => p.getPrismId() !== prism.getPrismId());

    controller.deleteSceneGraph();
    prism.setPrismController(null);
    this.deletePrism(prism);
  }
}