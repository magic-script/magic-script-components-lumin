// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { PropertyDescriptor } from './property-descriptor.js';

export class TextChildrenProperty extends PropertyDescriptor {
  validate (value) {
    this.throwIfNotText(value);
    return true;
  }

  throwIfNotText (children) {
    TextChildrenProperty.throwIfNotText(children);
  }

  static _validateChildren (children) {
    let valid = true;

    valid &= Array.isArray(children)
      ? children.every(child => this._validateChildren(child))
      : typeof children === 'string' || typeof children === 'number';

    return valid;
  }

  static isValid (children) {
    return this.hasValue(children) && this._validateChildren(children);
  }

  static throwIfNotText (children) {
    if (this.hasValue(children) && !this._validateChildren(children)) {
      throw new TypeError('Children elements should be of type string or number ');
    }
  }
}
