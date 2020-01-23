// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved
import log, { MessageSeverity } from '../../../../util/logger.js';

export class ElementBuilder {
    constructor() {
        // { name: PropertyDescriptor }
        this._propertyDescriptors = {};
    }

    update(element, oldProperties, newProperties) {
        this._applyAction(newProperties, (value, descriptor) => {
            if (this._validateProperty(value, descriptor)) {
                this._setProperty(value, descriptor, element, oldProperties, newProperties);
            }
        });
    }

    apply(element, oldProperties, newProperties) {
        this._applyAction(newProperties, (value, descriptor) => {
            this._setProperty(value, descriptor, element, oldProperties, newProperties);
        });
    }

    validate(element, oldProperties, newProperties) {
        this._applyAction(newProperties, this._validateProperty);
    }

    _applyAction(properties, action){
        for (const [name, value] of Object.entries(properties)) {
            const descriptor = this._propertyDescriptors[name];
            if (descriptor !== undefined && value !== undefined) {
                action(properties[name], descriptor);
            }
        }
    }

    _setProperty(value, descriptor, element, oldProperties, newProperties) {
        if (descriptor.IsNativeSetter) {
            if (typeof element[descriptor.SetterName] === 'function') {
                try {
                    element[descriptor.SetterName](descriptor.parse(value));
                } catch (error) {
                    throw new Error(`[Native.${descriptor.SetterName}]: ${error.name} - ${error.message}\n${error.stack}`);
                }
            } else {
                throw new Error(`${JSON.stringify(element)} does not have method ${descriptor.SetterName}`);
            }
        } else {
            try {
                this[descriptor.SetterName](element, oldProperties, newProperties);
            } catch (error) {
                throw new Error(`[Builder.${descriptor.SetterName}]: ${error.name} - ${error.message}\n${error.stack}`);
            }
        }
    }

    _validateProperty(value, descriptor) {
        if ( descriptor.validate(value) ) {
            return true;
        } else {
            log(`Property ${descriptor.Name} does not have a valid value: ${value}`, MessageSeverity.error);
            return false;
        }
    }

    throwIfNotInstanceOf(element, ...expectedTypes) {
        if ( !expectedTypes.some(instanceType => element instanceof instanceType)){
            throw new TypeError(`Component is not a instance of the required type ${expectedTypes.toString()}`);
        }
    }

    getPropertyValue(name, defaultValue, properties) {
        const  value = properties[name];
        return value !== undefined ? value : defaultValue;
    }

    /**
     * Returns a string with any extra TypeScript code that should be injected
     * into this props Interface.
     *
     * This should be used for any props not handled automatically via _propertyDescriptors.
     */
    extraTypeScript() {
        return '';
    }

    /**
     * Returns an object mapping dependent type names to their TypeScript type syntax.
     *
     * This should be used for types not handled automatically via _propertyDescriptors.
     */
    tsDependentTypes() {
        return {};
    }
}