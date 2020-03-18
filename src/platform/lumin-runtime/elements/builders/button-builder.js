// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui } from 'lumin';

import { TextContainerBuilder } from './text-container-builder.js';
import { ArrayProperty } from '../properties/array-property.js';
import { ColorProperty } from '../properties/color-property.js';
import { PropertyDescriptor } from '../properties/property-descriptor.js';

import { EclipseButtonType } from '../../types/eclipse-button-type.js';
import { LabelDisplayMode } from '../../types/label-display-mode.js';
import { SystemIcons } from '../../types/system-icons.js';
import { Side } from '../../types/side.js';

import executor from '../../utilities/executor.js';
import validator from '../../utilities/validator.js';

export class ButtonBuilder extends TextContainerBuilder {
    constructor(){
        super();

        this._propertyDescriptors['iconSize'] = new ArrayProperty('iconSize', 'setIconSize', true, 'vec2');
        this._propertyDescriptors['iconColor'] = new ColorProperty('iconColor', 'setIconColor', true);
    }


    create(prism, properties) {
        this.throwIfInvalidPrism(prism);

        this.validate(undefined, undefined, properties);

        let element;
        if (properties.type === undefined) {
            const text = this.getText(properties.children, properties.text);
            const height = this.getPropertyValue('height', 0.0, properties);
            const width = this.getPropertyValue('width', 0.0, properties);
            const roundness = this.getPropertyValue('roundness', 1.0, properties);

            element = this._createNode(ui.UiButton, 'Create', prism, text, width, height, roundness);
        } else {
            element = this._createNode(ui.UiButton, 'CreateEclipseButton', prism, this.getEclipseButtonParams(properties));
        }

        const unapplied = this.excludeProperties(properties, ['children', 'text', 'width', 'height', 'roundness']);

        this.apply(element, undefined, unapplied);

        return element;
    }

    validate(element, oldProperties, newProperties) {
        super.validate(element, oldProperties, newProperties);

        PropertyDescriptor.throwIfNotTypeOf(newProperties.width, 'number');
        PropertyDescriptor.throwIfNotTypeOf(newProperties.height, 'number');
        PropertyDescriptor.throwIfNotTypeOf(newProperties.roundness, 'number');
        PropertyDescriptor.throwIfNotTypeOf(newProperties.iconPath, 'string');
        PropertyDescriptor.throwIfNotTypeOf(newProperties.iconScale, 'number');
        PropertyDescriptor.throwIfNotTypeOf(newProperties.outlineButton, 'boolean');

        this._validateEnumerationValue(newProperties.type, 'button type', validator.validateEclipseButtonType);
        this._validateEnumerationValue(newProperties.iconType, 'icon type', validator.validateSystemIcon);
        this._validateEnumerationValue(newProperties.labelSide, 'label side', validator.validateSide);
        this._validateEnumerationValue(newProperties.labelDisplayMode, 'label display mode', validator.validateLabelDisplayMode);

    }

    _validateEnumerationValue(value, messageSubject, predicate) {
        PropertyDescriptor.throwIfPredicateFails(value, `The provided ${messageSubject} ${value} is not a valid value`, predicate);
    }

    getText(children, text) {
        return text === undefined ? this._getText(children) : text;
    }

    _createEclipseButtonParams (properties) {
        const text = this.getText(properties.children, properties.text);
        const { type, iconPath, labelSide, height, iconType } = properties;

        // 1. EclipseButtonParams(type, iconType, text, labelSide, height)
        if (type !== undefined && text !== undefined && labelSide !== undefined && height !== undefined && iconType !== undefined) {
            return executor.callNativeConstructor(ui.EclipseButtonParams, EclipseButtonType[type], SystemIcons[iconType], text, Side[labelSide], height);
        }

        // 2. EclipseButtonParams(type, iconPath, text, labelSide, height)
        if (type !== undefined && iconPath !== undefined && text !== undefined && labelSide !== undefined && height !== undefined) {
            return executor.callNativeConstructor(ui.EclipseButtonParams, EclipseButtonType[type], iconPath, text, Side[labelSide], height);
        }

        // 3. EclipseButtonParams(type, iconPath, text, height)
        if (type !== undefined && iconPath !== undefined && text !== undefined && height !== undefined) {
            return executor.callNativeConstructor(ui.EclipseButtonParams, EclipseButtonType[type], iconPath, text, height);
        }

        // 4. EclipseButtonParams(type, iconPath, height)
        if (type !== undefined && iconPath !== undefined && height !== undefined) {
            return executor.callNativeConstructor(ui.EclipseButtonParams, EclipseButtonType[type], iconPath, height);
        }

        // 5. EclipseButtonParams(type, text, height)
        if (type !== undefined && text !== undefined && height !== undefined) {
            return executor.callNativeConstructor(ui.EclipseButtonParams, EclipseButtonType[type], text, height);
        }

        // 6. EclipseButtonParams(type, iconType, height)
        if (type !== undefined && iconType !== undefined && height !== undefined) {
            return executor.callNativeConstructor(ui.EclipseButtonParams, EclipseButtonType[type], SystemIcons[iconType], height);
        }

        // 7. EclipseButtonParams(type)
        if (type !== undefined) {
            return executor.callNativeConstructor(ui.EclipseButtonParams, EclipseButtonType[type]);
        }

        throw new TypeError('Cannot create button with provided parameters');
    }

    _setEclipseButtonParamsProperty (eclipseButtonParams, name, value) {
        if (value !== undefined) {
            eclipseButtonParams[name] = value;
        }
    }

    _setEclipseButtonParamsProperties (eclipseButtonParams, properties) {
        this._setEclipseButtonParamsProperty(eclipseButtonParams, 'labelDisplayMode', LabelDisplayMode[properties.labelDisplayMode]);
        this._setEclipseButtonParamsProperty(eclipseButtonParams, 'iconScale', properties.iconScale);
        this._setEclipseButtonParamsProperty(eclipseButtonParams, 'outlineButton', properties.outlineButton);
    }

    getEclipseButtonParams (properties) {
        const eclipseButtonParams = this._createEclipseButtonParams(properties);
        this._setEclipseButtonParamsProperties(eclipseButtonParams, properties);
        return eclipseButtonParams;
    }

    extraTypeScript() {
        return  '    width?: number;\n' +
                '    height?: number;\n' +
                '    roundness?: number;\n';
    }
}


