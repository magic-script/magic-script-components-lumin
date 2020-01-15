// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

export class EventData {
    constructor(nativeEvent) {
        this._nativeEvent = nativeEvent;
        this._propertyNames = [];
    }

    _addGetProperties(propertyNames) {
        // Do not filter before storing propertyNames because there is no _nativeEvent
        // instance available when generating TypeScript declarations
        this._propertyNames = propertyNames;

        propertyNames
            .filter( name => typeof this._nativeEvent[`get${name}`] === 'function')
            .forEach( name => {
                Object.defineProperty(this, name, {
                    enumerable: true,
                    get:  () => this._nativeEvent[`get${name}`]()
                })
            });
    }

    static isSupported(event) {
        throw new Error('EventData.isSupported should be overridden');
    }
}