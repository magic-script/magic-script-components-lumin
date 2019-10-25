// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { PropertyDescriptor } from './property-descriptor.js';

export class ArrayProperty extends PropertyDescriptor {
    constructor(name, setterName, isNativeSetter, arrayType) {
        super(name, setterName, isNativeSetter)

        this._arrayType = arrayType;
    }

    validate(value) {
        if (!super.validate(value)) {
            return false;
        }

        this.throwIfNotArray(value, this._arrayType);
        return true;
    }
}
