import { ui } from 'lumin';
import { logError } from '../../../util/logger.js';

const { UiText, UiListView, UiListViewItem, Alignment, HorizontalTextAlignment } = ui;

const COLOR_RED = [1, 0, 0, 1];
const COLOR_YELLOW = [1, 1, 0, 1];
const COLOR_WHITE = [1, 1, 1, 1];
const COLOR_GRAY = [0.5, 0.5, 0.5, 0.5];

const LOG_MAX_ITEM_COUNT = 100;
const LOG_DEFAULT_ITEM_PADDING = [0.002, 0.002, 0.002, 0.002];
const LOG_ITEM_TEXT_SIZE = 0.02;
const LOG_TITLE_HEIGHT = 0.07;
const LOG_TITLE_SIZE = 0.05;
const LOG_TITLE = 'console';

function _createColoredTextNode(prism, message, color) {
  const uiText = UiText.Create(prism, message);
  uiText.setTextColor(color);
  uiText.setTextSize(LOG_ITEM_TEXT_SIZE);
  uiText.setTextAlignment(HorizontalTextAlignment.kLeft);
  // uiText.setBoundsSize([prism.getSize()[0], LOG_ITEM_TEXT_SIZE*2], true);
  return uiText;
}

function _createLogListView (prism) {
  const [width, height] = prism.getSize();
  const uiListView = UiListView.Create(prism, width, height - LOG_TITLE_HEIGHT);
  uiListView.setDefaultItemPadding(LOG_DEFAULT_ITEM_PADDING);
  const x = parseFloat(width)  / 2 - 0.002;
  const y = parseFloat(height) / 2;
  uiListView.setLocalPosition([-x, y - LOG_TITLE_HEIGHT, 0]);
  return uiListView;
}

function _createLogFrame (prism) {
  const [width, height] = prism.getSize();
  const x = parseFloat(width)  / 2 - 0.001;
  const y = parseFloat(height) / 2;
  const line = prism.createLineNode();
  line.setColor(COLOR_GRAY);
  line.addPoints([-x,  y, 0]);
  line.addPoints([ x,  y, 0]);
  line.addPoints([ x, -y, 0]);
  line.addPoints([-x, -y, 0]);
  line.addPoints([-x,  y, 0]);
  return line;
}

function _createTitle (prism) {
  const uiText = UiText.Create(prism, LOG_TITLE);
  uiText.setTextSize(LOG_TITLE_SIZE);
  const [, height] = prism.getSize();
  const y = parseFloat(height) / 2;
  uiText.setLocalPosition([-0.07, y - LOG_TITLE_HEIGHT, 0]);
  return uiText;
}

export default class SpatialLogger {
  init (prism) {
    if (prism === undefined) {
      return;
    }

    this._prism = prism;
    const rootNode = this._prism.getRootNode();
    rootNode.addChild(_createTitle(this._prism));
    rootNode.addChild(_createLogFrame(this._prism));
    
    this._logView = _createLogListView(this._prism);
    rootNode.addChild(this._logView);
  }

  _log(message, color) {
    if (this._prism === undefined) {
      return;
    }

    if (this._logView.getItemCount() >= LOG_MAX_ITEM_COUNT) {
      this._prism.deleteNode(this._logView.removeItem(0));
    }

    const uiListViewItem = UiListViewItem.Create(this._prism);
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
