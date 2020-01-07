// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved
import { PropertyDescriptor } from './property-descriptor.js';

const CONTENT_TYPE_NAME = 'Content';

export class ComponentChildrenProperty extends PropertyDescriptor {
  validate (value) {
    this.throwIfNotComponent(value);
    return true;
  }

  throwIfNotComponent (children) {
    ComponentChildrenProperty.throwIfNotComponent(children);
  }

  static _isComponent (children) {
    return children.type && children.type.name === CONTENT_TYPE_NAME;
  }

  static isValid (children) {
    return this.hasValue(children) &&
           typeof children === 'object' &&
           this._isComponent(children);
  }

  static throwIfNotComponent (children) {
    if (this.hasValue(children) && !this._isComponent(children)) {
      throw new TypeError('Children element should be component');
    }
  }
}
