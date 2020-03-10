// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

export class MxsScene {
    constructor () {
        this.prisms = [];
    }

    addChild$Universal (child) {
        this.prisms.push(child);
    }

    removeChild (child) {
        this.prisms = this.prisms.filter(prism => prism.getPrismId() !== child.getPrismId());
    }
}
