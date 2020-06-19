// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved
import { WorldImageTrackingEventData as _WorldImageTrackingEventData } from 'lumin';
import { ServerEvent } from './server-event.js';

export class WorldImageTrackingEventData extends ServerEvent {
    constructor(nativeEvent) {
        super(nativeEvent);

        this._addGetProperties([
            'Name',
            'Position',
            'Rotation'
        ]);
    }

    static isSupported(event) {
        return (event instanceof _WorldImageTrackingEventData);
    }
}
