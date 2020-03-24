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
      this._eventHandlers = {
        // onAppStart: [], // The rendering process hasn't started yet
        onAppPause: [],
        onAppResume: [],
        // onDeviceActive: [],
        // onDeviceReality: [],
        // onDeviceStandby: [],
        // onDeviceStart: [],
        // onDeviceStop: []
      };

      this._onAppStartData;
  }

  get OnAppStartData () {
    return this._onAppStartData;
  }

  onAppStart(args) {
    this._onAppStartData = { 
      initArgs: args,
      isImageTrackingReady: this.isImageTrackingReady(),
      isInternetConnected: this.isInternetConnected(),
      isShareableApp: this.isShareableApp(),
      isWiFiConnected: this.isWiFiConnected(),
      isWiFiEnabled: this.isWiFiEnabled(),
    };

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

    const onDestroyHandlerId = executor.callNativeFunction(prism, 'onDestroyEventSub', (closingPrism) => {
      const prismId = executor.callNativeFunction(closingPrism, 'getPrismId');
      this._prisms = this._prisms.filter(p => executor.callNativeFunction(p, 'getPrismId') !== prismId);

      if (!executor.callNativeFunction(closingPrism, 'onDestroyEventUnsub', onDestroyHandlerId)) {
        logWarning('Failed to unsubscribe from Prism.onDestroyEvent');
      }
    });

    return prism;
  }

  removePrism(prism, app) {
    const prismId = executor.callNativeFunction(prism, 'getPrismId');
    if (this._prisms.every(p => executor.callNativeFunction(p, 'getPrismId') !== prismId)) {
      return;
    }

    const controller = executor.callNativeFunction(prism, 'getPrismController');

    this._prismControllers = this._prismControllers.filter(c => c !== controller);
    this._prisms = this._prisms.filter(p => executor.callNativeFunction(p, 'getPrismId') !== executor.callNativeFunction(prism, 'getPrismId'));

    executor.callNativeAction(controller, 'deleteSceneGraph');
    executor.callNativeAction(prism, 'setPrismController', null);

    // Set Prism deletion after the current call completes.
    setTimeout(() => executor.callNativeAction(app, 'deletePrism', prism), 0)
  }
}