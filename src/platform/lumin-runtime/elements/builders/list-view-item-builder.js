// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui } from 'lumin';

import { UiNodeBuilder } from './ui-node-builder.js';
import { ArrayProperty } from '../properties/array-property.js';
import { ColorProperty } from '../properties/color-property.js';
import { EnumProperty } from '../properties/enum-property.js';

import { Alignment } from '../../types/alignment.js';

export class ListViewItemBuilder extends UiNodeBuilder {
  constructor () {
    super();

    this._propertyDescriptors['backgroundColor'] = new ColorProperty('backgroundColor', 'setBackgroundColor', true);

    this._propertyDescriptors['padding'] = new ArrayProperty('padding', 'setPadding', false, 'vec4');
    this._propertyDescriptors['itemAlignment'] = new EnumProperty('itemAlignment', 'setItemAlignment', false, Alignment, 'Alignment');
  }

  create (prism, properties) {
    this.throwIfInvalidPrism(prism);

    const element = this._createNode(ui.UiListViewItem, 'Create', prism);

    this._addCustomProperties(element);

    this.update(element, undefined, properties);

    return element;
  }

  _addCustomProperties (element) {
    Object.defineProperty(element, 'Padding', {
      enumerable: true,
      writable: true,
      configurable: false,
      value: [0, 0, 0, 0]
    });

    Object.defineProperty(element, 'ItemAlignment', {
      enumerable: true,
      writable: true,
      configurable: false,
      value: ui.Alignment.CENTER_CENTER
    });
  }

  setPadding (element, oldProperties, newProperties) {
    const padding = newProperties.padding;
    if (padding !== undefined) {
      element.Padding = padding;
    }
  }

  setItemAlignment (element, oldProperties, newProperties) {
    const itemAlignment = newProperties.itemAlignment;
    if (itemAlignment !== undefined) {
      element.ItemAlignment = Alignment[itemAlignment];
    }
  }
}
