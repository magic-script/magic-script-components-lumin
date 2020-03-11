// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui } from 'lumin';

import { UiNodeBuilder } from './ui-node-builder.js';
import { ColorProperty } from '../properties/color-property.js';
import { ClassProperty } from '../properties/class-property.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';
import { PropertyDescriptor } from '../properties/property-descriptor.js';

export class ProgressBarBuilder extends UiNodeBuilder {
    constructor(){
        super();

        // progressColor
        const progressColorProperties = [
            new ColorProperty('beginColor', undefined, undefined),
            new ColorProperty('endColor', undefined, undefined)
        ];

        this._propertyDescriptors['progressColor'] = new ClassProperty('progressColor', 'setProgressColor', false, progressColorProperties);

        this._propertyDescriptors['min'] = new PrimitiveTypeProperty('min', 'setMin', true, 'number');
        this._propertyDescriptors['max'] = new PrimitiveTypeProperty('max', 'setMax', true, 'number');
        this._propertyDescriptors['value'] = new PrimitiveTypeProperty('value', 'setValue', true, 'number');
    }


    create(prism, properties) {
        this.throwIfInvalidPrism(prism);

        this.validate(undefined, undefined, properties);

        const width  = properties.width;
        const height = this.getPropertyValue('height', 0.0, properties);

        const element = this._createNode(ui.UiProgressBar, 'Create', prism, width, height);

        const unapplied = this.excludeProperties(properties, ['width', 'height']);

        this.apply(element, undefined, unapplied);

        return element;
    }

    validate(element, oldProperties, newProperties) {
        super.validate(element, oldProperties, newProperties);

        PropertyDescriptor.throwIfNotTypeOf(newProperties.width, 'number');
        PropertyDescriptor.throwIfNotTypeOf(newProperties.height, 'number');
    }

    setProgressColor (element, oldProperties, newProperties) {
        const { beginColor, endColor } = newProperties.progressColor;
        if ( beginColor !== undefined && endColor !== undefined ) {
            this._callNodeAction(element, 'setProgressColor',  ColorProperty.parse(beginColor), ColorProperty.parse(endColor));
        }
    }

    extraTypeScript() {
        return  '    width?: number;\n' +
                '    height?: number;\n';
    }
}


