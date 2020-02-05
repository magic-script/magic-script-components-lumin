// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { LandscapeApp, ui } from 'lumin';
import { AppPrismController } from './controllers/app-prism-controller.js';

import executor from './utilities/executor.js'

export class MxsLandscapeApp extends LandscapeApp {
    // The 0.5 value is the number of seconds to call `updateLoop` in an interval if
    // there are no other events waking the event loop.
    constructor(appComponent, timeDelta) {
        super(timeDelta);

        this._app = appComponent;
        this._prismSize = [appComponent.props.volumeSize];
        this._prismControllers = [];
    }

  init() {
    return 0;
  }

  onAppStart(arg) {
    for (let size of this._prismSize) {
      // TODO: MxsPrismController(this._app.volume);
      // Each controller is responsible for one prism (volume)
      let controller;
      try {
        controller = new AppPrismController(this._app);
        this._prismControllers.push(controller);
      } catch (error) {
        throw new Error(`Creating AppPrismController failed: ${error.name} - ${error.message}\n${error.stack}`);
      }

      let prism;
      try {
        prism = this.requestNewPrism(size);
      } catch (error) {
        throw new Error(`Creating Prism failed: ${error.name} - ${error.message}\n${error.stack}`);
      }

      try {
        prism.setPrismController(controller);
      } catch (error) {
        throw new Error(`Setting Prism controller failed: ${error.name} - ${error.message}\n${error.stack}`);
      }
    }
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
}