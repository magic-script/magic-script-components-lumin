// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui } from 'lumin';

import { PositionalLayoutBuilder } from './positional-layout-builder.js';
import { ArrayProperty } from '../properties/array-property.js';
import { ClassProperty } from '../properties/class-property.js';
import { EnumProperty } from '../properties/enum-property.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';
import { Alignment } from '../../types/alignment.js';
import { Orientation } from '../../types/orientation.js';

export class LinearLayoutBuilder extends PositionalLayoutBuilder {
    constructor() {
        super();

        this._propertyDescriptors['orientation'] = new EnumProperty('orientation', 'setOrientation', true, Orientation, 'Orientation');

        // itemAlignment
        const itemAlignmentProperties = [
            new PrimitiveTypeProperty('index', undefined, undefined, 'number'),
            new EnumProperty('alignment', undefined, undefined, Alignment, 'Alignment')
        ];

        this._propertyDescriptors['itemAlignment'] = new ClassProperty('itemAlignment', 'setItemAlignment', false, itemAlignmentProperties);

        // itemPadding
        const itemPaddingProperties = [
            new PrimitiveTypeProperty('index', undefined, undefined, 'number'),
            new ArrayProperty('padding', undefined, undefined, 'vec4')
        ];

        this._propertyDescriptors['itemPadding'] = new ClassProperty('itemPadding', 'setItemPadding', false, itemPaddingProperties);
    }

    create(prism, properties) {
        this.throwIfInvalidPrism(prism);

        const element = this._createNode(ui.UiLinearLayout, 'Create', prism);

        this._addCustomProperties(element);

        this.update(element, undefined, properties);

        return element;
    }

    _addCustomProperties (element) {
        Object.defineProperty(element, 'itemPadding', {
          enumerable: true,
          writable: true,
          configurable: false,
          value: []
        });

        Object.defineProperty(element, 'mxsSetItemPadding', {
          enumerable: true,
          writable: false,
          configurable: false,
          value: (itemIndex) =>
            element.itemPadding.filter(({ index }) => index == itemIndex )
              .forEach(({ index, padding }) => this._callNodeAction(element, 'setItemPadding', index, padding))
        });

        Object.defineProperty(element, 'itemAlignment', {
          enumerable: true,
          writable: true,
          configurable: false,
          value: []
        });

        Object.defineProperty(element, 'mxsSetItemAlignment', {
          enumerable: true,
          writable: false,
          configurable: false,
          value: (itemIndex) =>
            element.itemAlignment.filter(({ index }) => index == itemIndex )
              .forEach(({ index, alignment }) => this._callNodeAction(element, 'setItemAlignment', index, Alignment[alignment]))
        });
    }

    setItemAlignment (element, oldProperties, newProperties) {
      this._setPropertyValue(element, oldProperties, newProperties, 'itemAlignment',
        ({ index, alignment }) => this._callNodeAction(element, 'setItemAlignment', index, Alignment[alignment]));
    }

    setItemPadding (element, oldProperties, newProperties) {
      this._setPropertyValue(element, oldProperties, newProperties, 'itemPadding',
        ({ index, padding }) => this._callNodeAction(element, 'setItemPadding', index, padding));
    }
}