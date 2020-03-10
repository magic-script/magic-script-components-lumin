// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved
import { ui } from 'lumin';
import { TransformNodeEventData } from './transform-node-event-data.js';
import { FocusRequest } from '../focus-request.js';
import { SoundEvent } from '../sound-event.js';

import extractor from '../../utilities/extractor.js';

export class UiEventData extends TransformNodeEventData {
    constructor(nativeEvent) {
        super(nativeEvent.getUiNode());

        this._addGetProperties([
            'Alignment',
            'Enabled',
            'EventPassThrough',
            'GravityWellEnabled',
            'GravityWellProperties',
            'RenderingLayer'
        ]);
    }

    get OnActivateResponse() {;
        const onActiveResponse = this._nativeEvent.getOnActivateResponse();
        return {
            focusRequest: extractor.getKeyByValue( FocusRequest, onActiveResponse.getFocusRequest() )
        };
    }

    getEventSoundID (event) {
        return this._nativeEvent.getEventSoundID(SoundEvent[event]);
    }

    static isSupported(event) {
        return (event instanceof ui.UiEventData);
    }
}