// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { PropertyDescriptor } from './property-descriptor.js';
import { ComponentChildrenProperty } from './component-children-property.js';
import { TextChildrenProperty } from './text-children-property.js';

export class ChildrenProperty extends PropertyDescriptor {
  validate (value) {
    this.throwIfNotTextOrComponent(value);
    return true;
  }

  throwIfNotTextOrComponent (children) {
    ChildrenProperty.throwIfNotTextOrComponent(children);
  }

  static isValid (children) {
    return ComponentChildrenProperty.isValid(children) || TextChildrenProperty.isValid(children);
  }

  static throwIfNotTextOrComponent (children) {
    if (this.hasValue(children) && !this.isValid(children)) {
      throw new TypeError('Children element should be of type string, number or component ');
    }
  }
}
