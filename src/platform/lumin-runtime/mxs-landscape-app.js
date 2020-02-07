// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { LandscapeApp, ui } from 'lumin';
import { AppPrismController } from './controllers/app-prism-controller.js';
import { ReactMagicScript } from '../../react-magic-script/react-magic-script.js';

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
    // for (let prism of this._prisms) {
    //     // TODO: MxsPrismController(this._app.volume);
    //     // Each controller is responsible for one prism (volume)
    //     const controller = new AppPrismController(this._app, prism);
    //     this._prismControllers.push(controller);

    //     this.requestNewPrism(prism.size)
    //       .setPrismController(controller);
    // }

    const container = {};
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


  addPrism(props) {
    const controller = new AppPrismController(props.children, props);
    this._prismControllers.push(controller);

    const prism = this.requestNewPrism(props.size)
    this._prisms.push(prism);

    prism.setPrismController(controller);
    return prism;
  }

  updatePrism(props) {

  }

  deletePrism(prism) {

  }
}