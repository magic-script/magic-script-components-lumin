// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui } from 'lumin';

import { UiNodeBuilder } from './ui-node-builder.js';
import { PropertyDescriptor } from '../properties/property-descriptor.js';

export class CircleConfirmationBuilder extends UiNodeBuilder {

    create(prism, properties) {
        this.throwIfInvalidPrism(prism);

        this.validate(undefined, undefined, properties);

        const radius = this.getPropertyValue('radius', 0.0, properties);

        const element = this._createNode(ui.UiCircleConfirmation, 'Create', prism, radius);

        const unapplied = this.excludeProperties(properties, ['radius']);

        this.apply(element, undefined, unapplied);

        return element;
    }

    validate(element, oldProperties, newProperties) {
        super.validate(element, oldProperties, newProperties);

        PropertyDescriptor.throwIfNotTypeOf(newProperties.radius, 'number');
    }

    extraTypeScript() {
        return  '    radius?: number;\n';
    }
}


