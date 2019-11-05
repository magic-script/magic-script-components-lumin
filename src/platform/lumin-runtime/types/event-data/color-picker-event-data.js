// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved
import { ui } from 'lumin';
import { UiEventData } from './ui-event-data.js';

export class ColorPickerEventData extends UiEventData {
    constructor(nativeEvent) {
        super(nativeEvent);

        this._addGetProperties([
            'Color'
        ]);
    }

    static isSupported(event) {
        return (event.getUiNode() instanceof ui.UiColorPicker);
    }
}
