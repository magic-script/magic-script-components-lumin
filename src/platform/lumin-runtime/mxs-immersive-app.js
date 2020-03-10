// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ImmersiveApp, ui } from 'lumin';
import { AppPrismController } from './controllers/app-prism-controller.js';

export class MxsImmersiveApp extends ImmersiveApp {
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
        const controller = new AppPrismController(this._app);
        this._prismControllers.push(controller);

        const prism = this.requestNewPrism(size);
        this.positionPrism(prism, [0, 0, -1]);
        prism.setPrismController(controller);
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
