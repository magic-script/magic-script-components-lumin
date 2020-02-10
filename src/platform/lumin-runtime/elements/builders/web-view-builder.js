// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui } from 'lumin';

import { UiNodeBuilder } from './ui-node-builder.js';
import { WebViewAction } from '../../types/web-view-action.js';

import { ArrayProperty } from '../properties/array-property.js';
import { EnumProperty } from '../properties/enum-property.js';
import { PropertyDescriptor } from '../properties/property-descriptor.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';

export class WebViewBuilder extends UiNodeBuilder {
  constructor () {
    super();

    this._propertyDescriptors['url'] = new PrimitiveTypeProperty('url', 'loadUrl', true, 'string');
    this._propertyDescriptors['action'] = new EnumProperty('action', 'setAction', false, WebViewAction, 'WebViewAction');
    this._propertyDescriptors['scrollBy'] = new ArrayProperty('scrollBy', 'scrollBy', false, 'vec2');
  }

  create (prism, properties) {
    this.throwIfInvalidPrism(prism);

    this.validate(undefined, undefined, properties);

    const { width, height } = properties;

    const element = this._createNode(ui.UiWebView, 'Create', prism, [width, height]);

    const unapplied = this.excludeProperties(properties, ['width', 'height']);

    this.apply(element, undefined, unapplied);

    return element;
  }

  validate (element, oldProperties, newProperties) {
    super.validate(element, oldProperties, newProperties);

    PropertyDescriptor.throwIfNotTypeOf(newProperties.width, 'number');
    PropertyDescriptor.throwIfNotTypeOf(newProperties.height, 'number');
  }

  setAction (element, oldProperties, newProperties) {
    const action = newProperties.action;

    if (action === undefined) {
      return;
    }

    if (WebViewAction[action] === WebViewAction.back) {
      this._callNodeAction(element, 'goBack');
    } else if (WebViewAction[action] === WebViewAction.forward) {
      this._callNodeAction(element, 'goForward');
    } else if (WebViewAction[action] === WebViewAction.reload) {
      this._callNodeAction(element, 'reload');
    }
  }

  scrollBy (element, oldProperties, newProperties) {
    const distances = newProperties.scrollBy;

    if (Array.isArray(distances)) {
      if (distances.every(distance => typeof distance === 'number')) {
        this._callNodeAction(element, 'scrollBy', distances[0], distances[1]);
      } else {
        throw new TypeError('WebView scrollBy property should be an array of numbers: [xPixels, yPixels]');
      }
    } else {
      throw new TypeError('WebView scrollBy property should be an array: [xPixels, yPixels]');
    }
  }

  extraTypeScript() {
    return  '    width?: number;\n' +
            '    height?: number;\n';
  }
}
