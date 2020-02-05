// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui } from 'lumin';

import { UiNodeBuilder } from './ui-node-builder.js';

import { ColorProperty } from '../properties/color-property.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';
import { PropertyDescriptor } from '../properties/property-descriptor.js';

import { Side } from '../../types/side.js';
import { TimeFormatConverter } from '../../types/time-format.js';

import validator from '../../utilities/validator.js';

const DEFAULT_TIME_FORMAT = 'hh:mm:ss';

export class TimePickerBuilder extends UiNodeBuilder {
    constructor() {
        super();

        this._propertyDescriptors['color'] = new ColorProperty('color', 'setColor', true);
        this._propertyDescriptors['time'] = new PrimitiveTypeProperty('time', 'setTime', false, 'string');
        this._propertyDescriptors['showHint'] = new PrimitiveTypeProperty('showHint', 'showTimeFormatHint', true, 'boolean');
    }

    create(prism, properties) {
        this.throwIfInvalidPrism(prism);

        this.validate(undefined, undefined, properties);

        let { defaultTime } = properties;

        const label = this.getPropertyValue('label', '', properties);
        const labelSide = this.getPropertyValue('labelSide', 'top', properties);

        if (defaultTime === undefined) {
            defaultTime = new ui.Time();
        } else if (typeof defaultTime === 'string') {
            defaultTime = TimeFormatConverter[DEFAULT_TIME_FORMAT].toTime(defaultTime);
        }

        const element = this._createNode(ui.UiTimePicker, 'Create', prism, label, Side[labelSide], DEFAULT_TIME_FORMAT, defaultTime);

        const unapplied = this.excludeProperties(properties, ['label', 'labelSide', 'defaultTime']);

        this.apply(element, undefined, unapplied);

        return element;
    }

    validate(element, oldProperties, newProperties) {
        super.validate(element, oldProperties, newProperties);

        const { label, labelSide, defaultTime } = newProperties;

        PropertyDescriptor.throwIfNotTypeOf(label, 'string');

        const message = `The provided icon ${labelSide} is not a valid value`;
        PropertyDescriptor.throwIfPredicateFails(labelSide, message, validator.validateSide);

        // message = `The provided time format ${timeFormat} is not a valid value`;
        // PropertyDescriptor.throwIfPredicateFails(dateFormat, message, validator.validateDateFormat);

        PropertyDescriptor.throwIfNotTypeOf(defaultTime, 'string');
    }

    setTime(element, oldProperties, newProperties) {
        const time = TimeFormatConverter[DEFAULT_TIME_FORMAT].toTime(newProperties.time);
        this._callNodeAction(element, 'setTime', time);
    }

    extraTypeScript() {
        return  '    label?: string;\n' +
                '    labelSide?: Side;\n' +
                '    defaultTime?: string;\n';
    }
}
