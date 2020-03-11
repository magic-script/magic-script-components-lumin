import { PropertyDescriptor } from './property-descriptor.js';
import chroma from 'chroma-js';

// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

const RGBAVec4 = 'RGBAVec4';

class ColorProperty extends PropertyDescriptor {
  // Value is:
  //   string: 'hotpink'; '#ff3399'; 'F39'
  //   number: 0xff3399
  //    array: [r, g, b, a],
  //    example HDR color: [0.5, 0.25, 0, 0.7], [0.5, 1.25, 2, 0.7]
  //   object:
  //    { h:120, s:1, l:0.75 }
  //    { l:80, c:25, h:200 }
  //    { c:1, m:0.5, y:0, k:0.2}
  //    { r:255, g:165, b:0, a: 0.8, type?: 'RGBAVec4' } if `type` is missing the default interpretation will be as RBGA32.
  validate (value) {
    return ColorProperty.validate(value);
  }

  static validate (value) {
    return this._isGlFormat(value) ||
           this._isRGBAVec4Format(value) ||
           chroma.valid(value);
  }

  parse (value) {
    return ColorProperty.parse(value);
  }

  static parse (value) {
    if (this._isGlFormat(value)) {
      return value;
    }

    if (this._isRGBAVec4Format(value)) {
      return [value.r, value.g, value.b, value.a];
    }

    const [r, g, b, a] = chroma(value).rgba(false);
    return [r / 255, g / 255, b / 255, a];
  }

  static _isGlFormat (value) {
    return Array.isArray(value);
  }

  static _isRGBAVec4Format (value) {
    return typeof value === 'object' && value.type === RGBAVec4;
  }

  tsType() {
    return 'color';
  }

  tsDependentTypes() {
    return {
      color: 'string | number | vec4 | color_hsl | color_lch | color_cmyk | color_rgba',
      color_hsl: '{ h: number, s: number, l: number }',
      color_lch: '{ l: number, c: number, h: number }',
      color_cmyk: '{ c: number, m: number, y: number, k: number }',
      color_rgba: '{ r: number, g: number, b: number, a: number, type?: string }'
    };
  }

}

export { ColorProperty };
