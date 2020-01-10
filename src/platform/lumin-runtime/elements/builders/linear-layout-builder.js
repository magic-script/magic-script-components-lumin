// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui } from 'lumin';

import { PositionalLayoutBuilder } from './positional-layout-builder.js';
import { Orientation } from '../../types/orientation.js';
import { EnumProperty } from '../properties/enum-property.js';

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

        const element = ui.UiLinearLayout.Create(prism);

        this.update(element, undefined, properties);

        return element;
    }

    setItemAlignment (element, oldProperties, newProperties) {
        newProperties.itemAlignment
          .forEach(({ index, alignment }) => element.setItemAlignment(index, Alignment[alignment]));
    }

    setItemPadding (element, oldProperties, newProperties) {
        newProperties.itemPadding
          .forEach(({ index, padding }) => element.setItemPadding(index, padding));
    }
}