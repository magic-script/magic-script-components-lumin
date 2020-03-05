// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { PropertyDescriptor } from './property-descriptor.js';

export class ArrayProperty extends PropertyDescriptor {
    constructor(name, setterName, isNativeSetter, arrayType) {
        super(name, setterName, isNativeSetter)

        this._arrayType = arrayType;
    }

    validate(value) {
        this.throwIfNotArray(value, this._arrayType);
        return true;
    }

    tsType() {
        if (PropertyDescriptor.hasValue(this._arrayType)) {
            return this._arrayType;
        } else if (this._name === 'points') {
            // Special case for LineBuilder
            return 'vec3[]';
        }
        return 'any[]';
    }

    tsDependentTypes() {
        return {
            vec2: '[number, number]',
            vec3: '[number, number, number]',
            vec4: '[number, number, number, number]',
            quat: 'vec4',
            mat4: '[number, number, number, number, ' +
                   'number, number, number, number, ' +
                   'number, number, number, number, ' +
                   'number, number, number, number]'
        }
    }
}
