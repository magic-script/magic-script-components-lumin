// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui } from 'lumin';
import { Alignment } from '../../types/alignment';

import { UiNodeBuilder } from './ui-node-builder.js';
import { ArrayProperty } from '../properties/array-property.js';
import { ClassProperty } from '../properties/class-property.js';
import { EnumProperty } from '../properties/enum-property.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';
import { PropertyDescriptor } from '../properties/property-descriptor.js';

export class PageViewBuilder extends UiNodeBuilder {
  constructor () {
    super();

    this._propertyDescriptors['defaultPageAlignment'] = new EnumProperty('defaultPageAlignment', 'setDefaultPageAlignment', true, Alignment, 'Alignment');
    this._propertyDescriptors['defaultPagePadding'] = new ArrayProperty('defaultPagePadding', 'setDefaultPagePadding', true, 'vec4');
    this._propertyDescriptors['visiblePage'] = new PrimitiveTypeProperty('visiblePage', 'showPage', true, 'number');

    // pageAlignment
    const pageAlignmentProperties = [
      new PrimitiveTypeProperty('index', undefined, undefined, 'number'),
      new EnumProperty('alignment', undefined, undefined, Alignment, 'Alignment')
    ];

    this._propertyDescriptors['pageAlignment'] = new ClassProperty('pageAlignment', 'setPageAlignment', false, pageAlignmentProperties);

    // pagePadding
    const pagePaddingProperties = [
      new PrimitiveTypeProperty('index', undefined, undefined, 'number'),
      new ArrayProperty('padding', undefined, undefined, 'vec4')
    ];

    this._propertyDescriptors['pagePadding'] = new ClassProperty('pagePadding', 'setPagePadding', false, pagePaddingProperties);
  }

  create (prism, properties) {
    this.throwIfInvalidPrism(prism);

    this.validate(undefined, undefined, properties);

    const height = this.getPropertyValue('height', 0, properties);
    const width = this.getPropertyValue('width', 0, properties);

    const element = this._createNode(ui.UiPageView, 'Create', prism, width, height);

    const unapplied = this.excludeProperties(properties, ['height', 'width']);

    this.apply(element, undefined, unapplied);

    return element;
  }

  update (element, oldProperties, newProperties) {
    super.update(element, oldProperties, newProperties);

    this._validateSize(newProperties);
    this._setSize(element, newProperties);
  }

  validate (element, oldProperties, newProperties) {
    super.validate(element, oldProperties, newProperties);

    this._validateSize(newProperties);
  }

  setPageAlignment (element, oldProperties, newProperties) {
    newProperties.pageAlignment.forEach(({ index, alignment }) =>
      this._callNodeAction(element, 'setPageAlignment', index, Alignment[alignment]));
  }

  setPagePadding (element, oldProperties, newProperties) {
    newProperties.pagePadding.forEach(({ index, padding }) =>
      this._callNodeAction(element, 'setPagePadding', index, padding));
  }

  _validateSize (properties) {
    PropertyDescriptor.throwIfNotTypeOf(properties.height, 'number');
    PropertyDescriptor.throwIfNotTypeOf(properties.width, 'number');
  }

  _setSize (element, properties) {
    let { height, width } = properties;

    if (width || height) {
      if (width === undefined) {
        width = this._callNodeFunction(element, 'getSize')[0];
      }

      if (height === undefined) {
        height = this._callNodeFunction(element, 'getSize')[1];
      }

      this._callNodeFunction(element, 'setSize', [width, height]);
    }
  }

  extraTypeScript() {
    return  '    width?: number;\n' +
            '    height?: number;\n';
  }
}
