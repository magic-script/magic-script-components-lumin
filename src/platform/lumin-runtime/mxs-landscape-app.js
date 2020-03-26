// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { LandscapeApp } from 'lumin';

export class MxsLandscapeApp extends LandscapeApp {
  constructor(timeDelta, baseApp) {
    super(timeDelta);

    this._baseApp = baseApp;
  }

  get OnAppStartData () {
    return this._baseApp.OnAppStartData;
  }

  init() {
    return 0;
  }

  onAppStart(arg) {
    this._baseApp.onAppStart(arg);
  }

  addListener(eventName, eventHandler) {
  }

  removeListener(eventName, eventHandler) {
  }

  updateLoop(delta) {
    return this._baseApp.updateLoop(delta);
  }

  eventListener(event) {
    return this._baseApp.eventListener(event);
  }

  getContainer(nodeName) {
    return this._baseApp.getContainer(nodeName);
  }

  addPrism(properties) {
    return this._baseApp.addPrism(properties, this);
  }

  removePrism(prism) {
    this._baseApp.removePrism(prism, this);
  }
}
