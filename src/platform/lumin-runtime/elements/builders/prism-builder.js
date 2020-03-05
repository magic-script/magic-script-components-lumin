// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved
import { ui } from 'lumin';

import { ElementBuilder } from './element-builder.js';

import { ArrayProperty } from '../properties/array-property.js';
import { EnumProperty } from '../properties/enum-property.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';

import { Alignment } from '../../types/alignment.js';
import { CursorHoverState } from '../../types/cursor-hover-state.js';

import validator from '../../utilities/validator.js';
import { logError } from '../../utilities/logger.js';

export class PrismBuilder extends ElementBuilder {
  constructor () {
      super();

      this._propertyDescriptors['position'] = new ArrayProperty('localPosition', 'setLocalPosition', true, 'vec3');
      this._propertyDescriptors['excludeFromAutoFocus'] = new PrimitiveTypeProperty('excludeFromAutoFocus', 'setExcludeFromAutoFocus', true, 'boolean');
      this._propertyDescriptors['handGestureFilterConfidenceLevel'] = new PrimitiveTypeProperty('handGestureFilterConfidenceLevel', 'setHandGestureFilterConfidenceLevel', true, 'number');
      this._propertyDescriptors['setHandGestureFilterPollRate'] = new PrimitiveTypeProperty('handGestureFilterPollRate', 'setHandGestureFilterPollRate', true, 'number');
      this._propertyDescriptors['setHandGestureFilterPositionDelta'] = new PrimitiveTypeProperty('handGestureFilterPositionDelta', 'setHandGestureFilterPositionDelta', true, 'number');
      this._propertyDescriptors['setHandGestureHoverDistance'] = new PrimitiveTypeProperty('handGestureHoverDistance', 'setHandGestureHoverDistance', true, 'number');
      this._propertyDescriptors['setHandGestureTouchDistance'] = new PrimitiveTypeProperty('handGestureTouchDistance', 'setHandGestureTouchDistance', true, 'number');
      this._propertyDescriptors['setPhysicsEnabled'] = new PrimitiveTypeProperty('physicsEnabled','setPhysicsEnabled', true, 'boolean');
      this._propertyDescriptors['setPhysicsPaused'] = new PrimitiveTypeProperty('physicsPaused', 'setPhysicsPaused', true, 'boolean');
      this._propertyDescriptors['setPhysicsWorldMeshEnabled'] = new PrimitiveTypeProperty('physicsWorldMeshEnabled', 'setPhysicsWorldMeshEnabled', true, 'boolean');
      this._propertyDescriptors['setPrismBloomStrength'] = new PrimitiveTypeProperty('prismBloomStrength', 'setPrismBloomStrength', true, 'number');
      this._propertyDescriptors['setVolumeBloomStrength'] = new PrimitiveTypeProperty('volumeBloomStrength', 'setVolumeBloomStrength', true, 'number');
      this._propertyDescriptors['trackHandGesture'] = new PrimitiveTypeProperty('trackHandGesture', 'trackHandGesture', false, 'number');
      this._propertyDescriptors['trackingAutoHapticOnGesture'] = new PrimitiveTypeProperty('trackingAutoHapticOnGesture', 'trackingAutoHapticOnGesture', false, 'number');

    this._propertyDescriptors['onDestroy'] = new EventProperty('onDestroy', 'onDestroySub', true);
  }

  create(prism, properties) {
    logError('Prism should be created by the App, no by PrismBuilder!');
  }

  validate(prism, oldProperties, newProperties) {

  }

  update(prism, oldProperties, newProperties) {

  }

  trackHandGesture(prism, oldProperties, newProperties) {
    // startTrackHandGesture
    // stopTrackHandGesture
  }

  trackingAutoHapticOnGesture(prism, oldProperties, newProperties) {
      // startTrackingAutoHapticOnGesture
      // stopTrackingAutoHapticOnGesture
  }
}
