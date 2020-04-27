import { ui, VEC3_ZERO } from 'lumin';
import { logError } from './logger.js';

const { UiText, UiListView, UiListViewItem, Alignment, HorizontalTextAlignment, DialogType } = ui;

const COLOR_RED = [1, 0, 0, 1];
const COLOR_YELLOW = [1, 1, 0, 1];
const COLOR_WHITE = [1, 1, 1, 1];

const LOG_PRISM_SIZE = [1.0, 1.5, 0];
const LOG_PRISM_POSITION = [-1.0, 0, 0];
const LOG_PRISM_ORIENTATION = VEC3_ZERO;
const LOG_MAX_ITEM_COUNT = 100;
const LOG_DEFAULT_ITEM_PADDING = [0.01, 0.01, 0.01, 0.01];
const LOG_ITEM_TEXT_SIZE = 0.03;
const LOG_ITEM_BOUNDS_WIDTH = LOG_PRISM_SIZE[0];

function _createColoredTextNode(prism, message, color) {
  const uiText = UiText.Create(prism, message);
  uiText.setColor(color);
  uiText.setTextSize(LOG_ITEM_TEXT_SIZE);
  uiText.setBoundsSize([LOG_ITEM_BOUNDS_WIDTH, 0]);
  uiText.setWrapEnabled(true);
  return uiText;
}

function _createLogListView (prism, width, height) {
  const uiListView = UiListView.Create(prism, width, height);
  uiListView.setAlignment(Alignment.BOTTOM_CENTER);
  uiListView.setDefaultItemPadding(LOG_DEFAULT_ITEM_PADDING);
  return uiListView;
}

function _createLogPrism (app, size, position, orientation) {
  const prism = app.requestNewPrism(size);
  app.positionPrism(prism, position);
  app.orientPrism(prism, orientation);
  return prism;
}

export default class SpatialLogger {
  setNativeApp (app) {
    this._app = app;
    this._prism = _createLogPrism(this._app, LOG_PRISM_SIZE, LOG_PRISM_POSITION, LOG_PRISM_ORIENTATION);
    this._logView = _createLogListView(this._prism, LOG_PRISM_SIZE[0], LOG_PRISM_SIZE[1]);
    this._prism.addChild(this._logView);
  }

  _log(message, color) {
    if (this._app === undefined) {
      return;
    }
    
    if (this._logView.getItemCount() >= LOG_MAX_ITEM_COUNT) {
      this._prism.deleteNode(this._logView.removeItem(0));
    }

    const uiListViewItem = UiListViewItem.Create(prism);
    uiListViewItem.addChild(_createColoredTextNode(this._prism, message, color));
    this._logView.addItem(uiListViewItem);
  }

  logInfo(message) {
    this._log(message, COLOR_WHITE);
  }

  logWarning (message) {
    this._log(message, COLOR_YELLOW);
  }

  logError (message) {
    this._log(message, COLOR_RED);
  }
}
 