import { PropertyDescriptor } from './property-descriptor.js';
import chroma from 'chroma-js';

// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

class ColorProperty extends PropertyDescriptor {
  // Value is:
  //   string: 'hotpink'; '#ff3399'; 'F39'
  //   number: 0xff3399
  //    array: [r, g, b, a?]: example: [128, 64, 0, 0.7]; [0.5, 0.25, 0, 0.7]
  //   object:
  //    { h:120, s:1, l:0.75 }
  //    { l:80, c:25, h:200 }
  //    { c:1, m:0.5, y:0, k:0.2}
  //    { r:255, g:165, b:0, a: 0.8 }

  // In Javascript number 1 and 1.0 are the same type so there will be the following constraint:
  // [0...255, 0...255, 0...255, 0...1] is valid RGBA
  // [1, 1, 1, 0...1] will be treated as RGB values are 0...255
  // [0..0.99, 0..0.99, 0..0.99, 0..0.1] will be valid and used for backwards compatability (the GL format)
  // However, if you really need to have value of 1 and use the GL format: RGB values are 0...1, one of the values needs to be declared as string.
  // ['1.0',  1,     1,     0..1]
  // [1,     '1.0',  1,     0..1]
  // [1,      1,     '1.0', 0..1]
  validate (value) {
    return ColorProperty.validate(value);
  }

  static validate (value) {
    return this._isGlFormat(value) || chroma.valid(value);
  }

  parse (value) {
    return ColorProperty.parse(value);
  }

  static parse (value) {
    if (this._isGlFormat(value)) {
      return value;
    }

    const [r, g, b, a] = chroma(value).rgba(false);
    return [r / 255, g / 255, b / 255, a];
  }

  static _isGlFormat (value) {
    if (!Array.isArray(value)) {
      return false;
    }

    const [r, g, b] = value;
    if (r < 1 && g < 1 && b < 1) {
        return true;
    }

    return (typeof r === 'string' || typeof g === 'string' || typeof b === 'string');
  }
}

export { ColorProperty };
