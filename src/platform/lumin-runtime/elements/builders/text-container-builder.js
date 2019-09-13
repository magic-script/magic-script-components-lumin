// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ArrayProperty } from '../properties/array-property.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';
import { TextProviderBuilder } from './text-provider-builder';

export class TextContainerBuilder extends TextProviderBuilder {
    constructor(){
        super();

        this._propertyDescriptors['textColor'] = new ArrayProperty('textColor', 'setTextColor', true, 'vec4');
        this._propertyDescriptors['textSize'] = new PrimitiveTypeProperty('textSize', 'setTextSize', true, 'number');
    }
}
