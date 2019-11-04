// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { PropertyDescriptor } from './property-descriptor.js';

export class ClassProperty extends PropertyDescriptor {
    constructor(name, setterName, isNativeSetter, properties) {
        super(name, setterName, isNativeSetter)

        this._properties = properties;
    }

    validate(value) {
        for (const property of this._properties) {
            property.validate( value[property.Name] );
        }

        return true;
    }

    tsType() {
        const propTs = this._properties.map(p => p.generateTypeScript());
        return `{ ${propTs.join(' ')} }`
    }

    tsDependentTypes() {
        let deps = {};
        this._properties.forEach(p => {
            if (typeof p.tsDependentTypes === 'function') {
                deps = {...deps, ...p.tsDependentTypes()};
            }
        });
        return deps;
    }
}