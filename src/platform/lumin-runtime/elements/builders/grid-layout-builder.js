// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui } from 'lumin';

import { PositionalLayoutBuilder } from './positional-layout-builder.js';
import { ArrayProperty } from '../properties/array-property.js';
import { ClassProperty } from '../properties/class-property.js';
import { EnumProperty } from '../properties/enum-property.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';
import { Alignment } from '../../types/alignment.js';

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

        const element = this._createNode(ui.UiGridLayout, 'Create', prism);

        this._addCustomProperties(element);

        this.update(element, undefined, properties);

        return element;
    }

    _addCustomProperties (element) {
        const getItemCell = (gridLayout, item) => {
          const nodeId = item.getNodeId();
          const rows = gridLayout.getCurrentRows();
          const columns = gridLayout.getCurrentColumns();
          let row = 0;
          let column = 0;

          while (row < rows) {
            while (column < columns) {
              const node = gridLayout.getItem(row, column);
              if (node !== null && node.getNodeId() === nodeId) {
                return { row, column };
              } else {
                column++;
              }
            }
            column = 0;
            row++;
          }

          return undefined;
        };

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
          value: (itemIndex) => {
            if (itemIndex < this._callNodeFunction(element, 'getItemCount')) {
              const cell = getItemCell(element, this._callNodeFunction(element, 'getItem', itemIndex));
              if (cell !== undefined) {
                element.itemPadding
                  .filter(({ row, column }) => row === cell.row && cell.column === column)
                  .forEach(({ row, column, padding }) => this._callNodeAction(element, 'setItemPadding', row, column, padding));
              }
            }
          }
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
          value: (itemIndex) => {
            if (itemIndex < this._callNodeFunction(element, 'getItemCount')) {
              const cell = getItemCell(element, this._callNodeFunction(element, 'getItem', itemIndex));
              if (cell !== undefined) {
                element.itemAlignment
                  .filter(({ row, column }) => row === cell.row && cell.column === column)
                  .forEach(({ row, column, alignment }) => this._callNodeAction(element, 'setItemAlignment', row, column, Alignment[alignment]));
              }
            }
          }
        });
    }

    setItemAlignment (element, oldProperties, newProperties) {
      this._setPropertyValue(element, oldProperties, newProperties, 'itemAlignment',
        ({ row, column, alignment }) => this._callNodeAction(element, 'setItemAlignment', row, column, Alignment[alignment]));
    }

    setItemPadding (element, oldProperties, newProperties) {
      this._setPropertyValue(element, oldProperties, newProperties, 'itemPadding',
        ({ row, column, padding }) => this._callNodeAction(element, 'setItemPadding', row, column, padding));
    }
}