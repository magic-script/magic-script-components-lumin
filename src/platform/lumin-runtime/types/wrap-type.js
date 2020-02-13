// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved
import { utils } from 'lumin';

/**
 * @exports Wrap
 * @description Control texture wrapping when a texture coordinate is outside the [0, 1] range.
 */
export const Wrap = {
    'clamp-to-edge': utils.Wrap.kClampToEdge,
    'mirrored-repeat': utils.Wrap.kMirroredRepeat,
    'repeat': utils.Wrap.kRepeat
};
