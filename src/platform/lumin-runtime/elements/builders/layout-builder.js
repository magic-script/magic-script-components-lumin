// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { UiNodeBuilder } from './ui-node-builder.js';
import { PropertyDescriptor } from '../properties/property-descriptor.js';

export class LayoutBuilder extends UiNodeBuilder {

    update(element, oldProperties, newProperties) {
        super.update(element, oldProperties, newProperties);

        this._validateSize(newProperties);
        this._setSize(element, newProperties);
    }

    validate(element, oldProperties, newProperties) {
        super.validate(element, oldProperties, newProperties);

        this._validateSize(newProperties);
    }

    _validateSize(properties) {
        PropertyDescriptor.throwIfNotTypeOf(properties.height, 'number');
        PropertyDescriptor.throwIfNotTypeOf(properties.width, 'number');
    }

    _setSize(element, properties) {
        let { height, width } = properties;

        if (width || height) {
            if (width === undefined) {
                width = this._callNodeFunction(element, 'getSize')[0];
            }

            if (height === undefined) {
                height = this._callNodeFunction(element, 'getSize')[1];
            }

            this._callNodeAction(element, 'setSize', [width, height]);
        }
    }

    extraTypeScript() {
        return  '    width?: number;\n' +
                '    height?: number;\n';
    }

}