// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { LandscapeApp, ui } from 'lumin';
import { AppPrismController } from './controllers/app-prism-controller.js';
import { ReactMagicScript } from '../../react-magic-script/react-magic-script.js';

import executor from './utilities/executor.js'

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
        getRoot: () => ({ addChild: (child) => console.log('App container - adding child (scene)') })
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
    const controller = new AppPrismController(properties);
    this._prismControllers.push(controller);

    const prism = this.requestNewPrism(properties.size);
    this._prisms.push(prism);

    prism.setPrismController(controller);
    return prism;
  }

  updatePrism(props, oldProperties, newProperties) {

  }

  deletePrism(prism) {

  }
}