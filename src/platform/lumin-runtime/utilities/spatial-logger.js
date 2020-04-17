import { ui } from 'lumin';
import { logError } from './logger.js';

const { UiText, Alignment, HorizontalTextAlignment } = ui;
const COLOR_RED = [1, 0, 0, 1];

function _createTextNode (prism, message, color) {
    const uiText = UiText.Create(prism, message);
 
    uiText.setAlignment(Alignment.CENTER_CENTER);
    uiText.setTextAlignment(HorizontalTextAlignment.kCenter);
    uiText.setColor(color);

    return uiText;
}

export default class SpatialLogger {
  setNativeApp (app) {
    this._app = app;
  }

  logErrorOnCreateElement (type, properties, container, error) {
    const prism = container.controller.getPrism();
    const message = `Creating element type ${type} has failed.\nProperties: ${JSON.stringify(properties)}\n${error.message}`;
  
    logError(message);
    showSpatialMessage(prism, message, COLOR_RED);
  }
 
  showSpatialMessage (prism, message, color) {
    prism.getRoot().addChild(_createTextNode(prism, message, color));
  }
}
 