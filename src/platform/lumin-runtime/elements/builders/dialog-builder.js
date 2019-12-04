// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui } from 'lumin';

import { TextProviderBuilder } from './text-provider-builder.js';
import { EnumProperty } from '../properties/enum-property.js';
import { PropertyDescriptor } from '../properties/property-descriptor.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';

import { DialogType } from '../../types/dialog-type.js';
import { DialogLayout } from '../../types/dialog-layout.js';
import { EclipseButtonType } from '../../types/eclipse-button-type.js';
import { SystemIcons } from '../../types/system-icons.js';

export class DialogBuilder extends TextProviderBuilder {
    constructor() {
        super();

        // DialogContent

        this._propertyDescriptors['buttonType'] = new EnumProperty('buttonType', 'setButtonType', true, EclipseButtonType, 'EclipseButtonType');
        this._propertyDescriptors['cancelText'] = new PrimitiveTypeProperty('cancelText', 'setCancelButtonText', true, 'string');
        this._propertyDescriptors['cancelIcon'] = new EnumProperty('cancelIcon', 'setCancelButtonIcon', true, SystemIcons, 'SystemIcon');
        this._propertyDescriptors['confirmText'] = new PrimitiveTypeProperty('confirmText', 'setConfirmButtonText', true, 'string');
        this._propertyDescriptors['confirmIcon'] = new EnumProperty('confirmIcon', 'setConfirmButtonIcon', true, SystemIcons, 'SystemIcon');
        this._propertyDescriptors['expireTime'] = new PrimitiveTypeProperty('expireTime', 'setExpireTime', true, 'number');
    }


    create(prism, properties) {
        this.throwIfInvalidPrism(prism);

        this.validate(undefined, undefined, properties);

        let message = properties.message;

        if (message === undefined) {
            message = this._getText(properties.children);
        }

        if (message === undefined) {
            message = '';
        }

        const type = this.getPropertyValue('type', 'dual-action', properties);
        const layout = this.getPropertyValue('layout', 'standard', properties);
        const scrolling = this.getPropertyValue('scrolling', false, properties);
        const title = properties.title;

        let element

        if (scrolling) {
            element = ui.UiDialog.CreateScrolling(prism, title, message, DialogType[type], DialogLayout[layout]);
        } else {
            element = title === undefined
                ? ui.UiDialog.Create(prism, DialogType[type], DialogLayout[layout])
                : ui.UiDialog.Create(prism, title, message, null, DialogType[type], DialogLayout[layout]);
        }

        const unapplied = this.excludeProperties(properties, ['children', 'message', 'title', 'type', 'layout']);

        this.apply(element, undefined, unapplied);

        // Initialize the dialog:
        // - For modal dialogs, the cursor will transition to one of the dialog's action buttons
        // and will be constrained to the dialog area.
        // - For timed, modeless dialogs, the expiration timer will be started automatically.
        element.init();

        return element;
    }

    validate(element, oldProperties, newProperties) {
        super.validate(element, oldProperties, newProperties);

        PropertyDescriptor.throwIfNotTypeOf(newProperties.scrolling, 'boolean');
        PropertyDescriptor.throwIfNotTypeOf(newProperties.title, 'string');
    }

    extraTypeScript() {
        return  '    message?: string;\n' +
                '    title?: string;\n' +
                '    type?: DialogType;\n' +
                '    layout?: DialogLayout;\n' +
                '    scrolling?: boolean;\n';
    }

    tsDependentTypes() {
        return {
            DialogType: EnumProperty.getTsType(DialogType),
            DialogLayout: EnumProperty.getTsType(DialogLayout)
        };
    }
}
