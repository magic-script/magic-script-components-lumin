// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved
import { ui } from 'lumin';

import { ElementBuilder } from './element-builder.js';

import { ArrayProperty } from '../properties/array-property.js';
import { EnumProperty } from '../properties/enum-property.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';

import { Alignment } from '../../types/alignment.js';
import { CursorHoverState } from '../../types/cursor-hover-state.js';

import validator from '../../utilities/validator.js';

export class TransformBuilder extends ElementBuilder {
  constructor () {
    super();

    this._propertyDescriptors['name'] = new PrimitiveTypeProperty('name', 'setName', true, 'string');
    this._propertyDescriptors['parentedBoneName'] = new PrimitiveTypeProperty('parentedBoneName', 'setParentedBoneName', true, 'string');
    this._propertyDescriptors['skipRaycast'] = new PrimitiveTypeProperty('skipRaycast', 'setSkipRaycast', true, 'boolean');
    this._propertyDescriptors['triggerable'] = new PrimitiveTypeProperty('triggerable', 'setTriggerable', true, 'boolean');
    this._propertyDescriptors['visible'] = new PrimitiveTypeProperty('visible', 'setVisible', true, 'boolean');
    this._propertyDescriptors['visibilityInherited'] = new PrimitiveTypeProperty('visibilityInherited', 'setVisibilityInherited', true, 'boolean');
    this._propertyDescriptors['anchorPosition'] = new ArrayProperty('anchorPosition', 'setAnchorPosition', true, 'vec3');
    this._propertyDescriptors['localPosition'] = new ArrayProperty('localPosition', 'setLocalPosition', true, 'vec3');
    this._propertyDescriptors['localRotation'] = new ArrayProperty('localRotation', 'setLocalRotation', true, 'quat');
    this._propertyDescriptors['localScale'] = new ArrayProperty('localScale', 'setLocalScale', true, 'vec3');
    this._propertyDescriptors['localTransform'] = new ArrayProperty('localTransform', 'setLocalTransform', true, 'mat4');
    this._propertyDescriptors['cursorHoverState'] = new EnumProperty('cursorHoverState', 'setCursorHoverState', true, CursorHoverState, 'CursorHoverState');

    this._propertyDescriptors['offset'] = new ArrayProperty('offset', 'setOffset', false, 'vec3');
    this._propertyDescriptors['padding'] = new ArrayProperty('padding', 'setPadding', false, 'vec4');
    this._propertyDescriptors['itemAlignment'] = new EnumProperty('itemAlignment', 'setItemAlignment', false, Alignment, 'Alignment');
  }

  create (prism, properties) {
    this.throwIfInvalidPrism(prism);

    this.validate(undefined, undefined, properties);

    const defaultTransform = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];

    const localTransform = this.getPropertyValue('localTransform', defaultTransform, properties);

    const element = this._createNode(prism, 'createTransformNode', localTransform);

    this._addCustomProperties(element);

    const unapplied = this.excludeProperties(properties, ['localTransform']);

    this.apply(element, undefined, unapplied);

    return element;
  }

  _addCustomProperties (element) {
    // Attach 'offset' property
    // the property is used when TransformNode is used by another node as content/model
    Object.defineProperty(element, 'offset', {
      enumerable: true,
      writable: true,
      configurable: false,
      value: [0, 0, 0]
    });

    // Attach 'padding' property
    // the property is used when TransformNode is used by another node as content/model
    Object.defineProperty(element, 'padding', {
      enumerable: true,
      writable: true,
      configurable: false,
      value: [0, 0, 0, 0]
    });

    // Attach 'itemAlignment' property
    // the property is used when TransformNode is used by another node as content/model
    Object.defineProperty(element, 'itemAlignment', {
      enumerable: true,
      writable: true,
      configurable: false,
      value: ui.Alignment.TOP_LEFT
    });
  }

  excludeProperties (properties, exclude) {
    const subset = Object.assign({}, properties);
    exclude.forEach(name => {
      if (properties.hasOwnProperty(name) !== undefined) {
        delete subset[name];
      }
    });
    return subset;
  }

  setOffset (element, oldProperties, newProperties) {
    const offset = newProperties.offset;
    if (offset !== undefined) {
      element.offset = offset;
    }
  }

  setPadding (element, oldProperties, newProperties) {
    const padding = newProperties.padding;
    if (padding !== undefined) {
      element.padding = padding;
    }
  }

  setItemAlignment (element, oldProperties, newProperties) {
    const itemAlignment = newProperties.itemAlignment;
    if (itemAlignment !== undefined) {
      element.itemAlignment = Alignment[itemAlignment];
    }
  }

  throwIfInvalidPrism (prism) {
    if (!validator.validatePrism(prism)) {
      throw new TypeError('Parameter "prism" is not instance of Prism');
    }
  }
}
