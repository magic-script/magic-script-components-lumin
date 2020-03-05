// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

const extractor = {
    getKeyByValue (collection, lookupValue)  {
        const [key] = Object.entries(collection)
            .find(([, value]) => value === lookupValue);
        return key;
    }
}

export default extractor