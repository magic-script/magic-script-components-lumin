// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui } from 'lumin';

import { UiNodeBuilder } from './ui-node-builder.js';
import { EnumProperty } from '../properties/enum-property.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';
import { PropertyDescriptor } from '../properties/property-descriptor.js';

import { Orientation } from '../../types/orientation.js';

export class ScrollBarBuilder extends UiNodeBuilder {
  constructor () {
    super();

    this._propertyDescriptors['thumbSize'] = new PrimitiveTypeProperty('thumbSize', 'setThumbSize', true, 'number');
    this._propertyDescriptors['thumbPosition'] = new PrimitiveTypeProperty('thumbPosition', 'setThumbPosition', true, 'number');

    this._propertyDescriptors['orientation'] = new EnumProperty('orientation', 'setOrientation', false, Orientation, 'Orientation');
  }

  create (prism, properties) {
    this.throwIfInvalidPrism(prism);

    this.validate(undefined, undefined, properties);

    const width = properties.length;
    const height = this.getPropertyValue('thickness', 0, properties);

    const element = this._createNode(ui.UiScrollBar, 'Create', prism, width, height);

    Object.defineProperty(element, 'Orientation', {
      enumerable: true,
      writable: true,
      configurable: false,
      value: ui.Orientation.kVertical
    });

    const unapplied = this.excludeProperties(properties, ['length', 'thickness']);

    this.apply(element, undefined, unapplied);

    return element;
  }

  setOrientation (element, oldProperties, newProperties) {
    const orientation = newProperties.orientation;
    if (orientation !== undefined) {
      element.Orientation = Orientation[orientation];
    }
  }

  validate (element, oldProperties, newProperties) {
    super.validate(element, oldProperties, newProperties);

    this._validateSize(newProperties);
  }

  _validateSize (properties) {
    PropertyDescriptor.throwIfNotTypeOf(properties.thickness, 'number');
    PropertyDescriptor.throwIfNotTypeOf(properties.length, 'number');
  }

  extraTypeScript() {
    return  '    length?: number;\n' +
            '    thickness?: number;\n';
  }
}
