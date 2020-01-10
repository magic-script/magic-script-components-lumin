// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ColorProperty } from '../properties/color-property.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';
import { TextProviderBuilder } from './text-provider-builder';

export class TextContainerBuilder extends TextProviderBuilder {
    constructor(){
        super();

        this._propertyDescriptors['textColor'] = new ColorProperty('textColor', 'setTextColor', true);
        this._propertyDescriptors['textSize'] = new PrimitiveTypeProperty('textSize', 'setTextSize', true, 'number');
    }
}
