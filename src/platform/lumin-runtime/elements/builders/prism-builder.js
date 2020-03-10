// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved
import { ui } from 'lumin';

import { ElementBuilder } from './element-builder.js';

import { ArrayProperty } from '../properties/array-property.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';

import { executor } from '../../utilities/executor.js';
import { logWarning } from '../../../../util/logger.js';

export class PrismBuilder extends ElementBuilder {
  constructor () {
    super();

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

    this._propertyDescriptors['onDestroy'] = new EventProperty('onDestroy', 'setOnDestroyHandler', false);
  }

  create(app, properties) {
    const prism = app.addPrism(properties);

    Object.defineProperty(prism, 'addChild$Universal', {
      enumerable: true,
      writable: false,
      configurable: false,
      value: (child) => console.log('Prism is not supposed to add children !')
    });

    this._validatePosition(properties)
    this._setPosition(app, prism, properties);

    return prism;
  }

  _validatePosition (properties) {
    const { position, positionRelativeToCamera } = properties;

    ArrayProperty.throwIfNotArray(position);
    PrimitiveTypeProperty.throwIfNotTypeOf(positionRelativeToCamera, 'boolean');
  }

  _setPosition (app, prism, properties) {
    const position = this.getPropertyValue('position', [0, 0, -1], properties);
    const positionRelativeToCamera = this.getPropertyValue('positionRelativeToCamera', true, properties);

    if (positionRelativeToCamera) {
      executor.callNativeAction(app, 'positionPrismRelativeToCamera', prism, position);
    } else {
      executor.callNativeAction(app, 'positionPrism', prism, position);
    }
  }

  trackHandGesture (prism, oldProperties, newProperties) {
    // startTrackHandGesture
    // stopTrackHandGesture
    console.log('PrismBuilder.validate has not been implemented yet');
  }

  trackingAutoHapticOnGesture (prism, oldProperties, newProperties) {
      // startTrackingAutoHapticOnGesture
      // stopTrackingAutoHapticOnGesture
  }

  setOnDestroyHandler (prism, oldProperties, newProperties) {
    const onDestroy = newProperties.onDestroy;

    if (typeof onDestroy === 'function') {
      executor.callNativeFunction(prism, 'onDestroySub', onDestroy);
    } else {
      logWarning('Prism property onDestroy expects function');
    }
  }
}
