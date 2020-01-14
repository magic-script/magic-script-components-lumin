// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui } from 'lumin';

import { PositionalLayoutBuilder } from './positional-layout-builder.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';

export class GridLayoutBuilder extends PositionalLayoutBuilder {
    constructor(){
        super();

        this._propertyDescriptors['columns'] = new PrimitiveTypeProperty('columns', 'setColumns', true, 'number');
        this._propertyDescriptors['rows'] = new PrimitiveTypeProperty('rows', 'setRows', true, 'number');

        // itemAlignment
        const itemAlignmentProperties = [
            new PrimitiveTypeProperty('row', undefined, undefined, 'number'),
            new PrimitiveTypeProperty('column', undefined, undefined, 'number'),
            new EnumProperty('alignment', undefined, undefined, Alignment, 'Alignment')
        ];

        this._propertyDescriptors['itemAlignment'] = new ClassProperty('itemAlignment', 'setItemAlignment', false, itemAlignmentProperties);

        // itemPadding
        const itemPaddingProperties = [
            new PrimitiveTypeProperty('row', undefined, undefined, 'number'),
            new PrimitiveTypeProperty('column', undefined, undefined, 'number'),
            new ArrayProperty('padding', undefined, undefined, 'vec4')
        ];

        this._propertyDescriptors['itemPadding'] = new ClassProperty('itemPadding', 'setItemPadding', false, itemPaddingProperties);
    }

    create(prism, properties) {
        this.throwIfInvalidPrism(prism);

        const element = ui.UiGridLayout.Create(prism);

        Object.defineProperty(element, 'itemPadding', {
            enumerable: true,
            writable: true,
            configurable: false,
            value: []
        });

        Object.defineProperty(element, 'mxsUpdateItemPadding', {
            enumerable: true,
            writable: true,
            configurable: false,
            value: () => {
                element.itemAlignment.forEach(({ row, column, padding }) => element.setItemPadding(row, column, padding));
            }
        });

        Object.defineProperty(element, 'itemAlignment', {
            enumerable: true,
            writable: true,
            configurable: false,
            value: []
        });

        Object.defineProperty(element, 'mxsUpdateItemAlignment', {
            enumerable: true,
            writable: true,
            configurable: false,
            value: () => {
                element.itemAlignment.forEach(({ row, column, alignment }) => element.setItemAlignment(row, column, Alignment[alignment]));
            }
        });

        this.update(element, undefined, properties);

        return element;
    }

    setItemAlignment (element, oldProperties, newProperties) {
      this._setPropertyValue(element, oldProperties, newProperties, 'itemAlignment',
        ({ row, column, alignment }) => element.setItemAlignment(row, column, Alignment[alignment]));
    }

    setItemPadding (element, oldProperties, newProperties) {
      this._setPropertyValue(element, oldProperties, newProperties, 'itemPadding',
        ({ row, column, padding }) => element.setItemPadding(row, column, padding));
    }
}