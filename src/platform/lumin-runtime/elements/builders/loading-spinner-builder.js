// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui } from 'lumin';

import { UiNodeBuilder } from './ui-node-builder.js';

import { ArrayProperty } from '../properties/array-property.js';
import { EnumProperty } from '../properties/enum-property.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';
import { PropertyDescriptor } from '../properties/property-descriptor.js';
import { LoadingSpinnerType } from '../../types/loading-spinner-type.js';

import validator from '../../utilities/validator.js';


export class LoadingSpinnerBuilder extends UiNodeBuilder {
    constructor(){
        super();

        this._propertyDescriptors['size']  = new ArrayProperty('size', 'setSize', true, 'vec2');
        this._propertyDescriptors['value'] = new PrimitiveTypeProperty('value', 'setValue', true, 'number');
    }

    create(prism, properties) {
        this.throwIfInvalidPrism(prism);

        this.validate(undefined, undefined, properties);

        const type = LoadingSpinnerType[this.getPropertyValue('type', 'sprite-animation', properties)];
        const id   = this.getPropertyValue('resourceId', BigInt(0), properties);
        const path = this.getPropertyValue('resourcePath', '', properties);
        const height = this.getPropertyValue('height', 0, properties);
        const determinate = this.getPropertyValue('determinate', false, properties);

        const element = determinate
            ? this._createNode(ui.UiLoadingSpinner, 'CreateDeterminate', prism, height)
            : this._createNode(ui.UiLoadingSpinner, 'Create', prism, type, id, path, height);

        const unapplied = this.excludeProperties(properties, ['type', 'resourceId', 'resourcePath', 'height']);

        this.apply(element, undefined, unapplied);

        return element;
    }

    validate(element, oldProperties, newProperties) {
        super.validate(element, oldProperties, newProperties);

        const message = `The provided spinner type ${newProperties.type} is not a valid value`;
        PropertyDescriptor.throwIfPredicateFails(newProperties.type, message, validator.validateLoadingSpinnerType);

        PropertyDescriptor.throwIfNotTypeOf(newProperties.resourceId, 'number');
        PropertyDescriptor.throwIfNotTypeOf(newProperties.resourcePath, 'string');
        PropertyDescriptor.throwIfNotTypeOf(newProperties.height, 'number');
        PropertyDescriptor.throwIfNotTypeOf(newProperties.determinate, 'boolean');
    }

    extraTypeScript() {
        return  '    type?: LoadingSpinnerType;\n' +
                '    id?: bigint;\n' +
                '    path?: string;\n' +
                '    height?: number;\n' +
                '    determinate?: boolean;\n';
    }

    tsDependentTypes() {
        return {
            LoadingSpinnerType: EnumProperty.getTsType(LoadingSpinnerType)
        };
    }
}


