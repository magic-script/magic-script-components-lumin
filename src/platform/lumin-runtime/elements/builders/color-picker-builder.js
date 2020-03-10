// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui } from 'lumin';

import { UiNodeBuilder } from './ui-node-builder.js';
import { ColorProperty } from '../properties/color-property.js';

import { PropertyDescriptor } from '../properties/property-descriptor.js';

const DEFAULT_COLOR = [255, 255, 255, 1];

export class ColorPickerBuilder extends UiNodeBuilder {
    constructor(){
        super();

        this._propertyDescriptors['color'] = new ColorProperty('color', 'setColor', true);
    }

    create(prism, properties) {
        this.throwIfInvalidPrism(prism);

        this.validate(undefined, undefined, properties);

        const color  = this.getPropertyValue('color', DEFAULT_COLOR, properties);
        const height = this.getPropertyValue('height', 0, properties);

        const element = this._createNode(ui.UiColorPicker,'Create', prism, ColorProperty.parse(color), height);

        const unapplied = this.excludeProperties(properties, ['color', 'height']);

        this.apply(element, undefined, unapplied);

        return element;
    }

    validate(element, oldProperties, newProperties) {
        super.validate(element, oldProperties, newProperties);

        PropertyDescriptor.throwIfNotTypeOf(newProperties.height, 'number');
    }

    extraTypeScript() {
        return  '    height?: number;\n';
    }
}
