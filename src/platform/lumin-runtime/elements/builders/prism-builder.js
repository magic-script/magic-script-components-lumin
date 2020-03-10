// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved
import { ElementBuilder } from './element-builder.js';

import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';
import { PropertyDescriptor } from '../properties/property-descriptor.js';

import executor from '../../utilities/executor.js';
import { logWarning, logError } from '../../../../util/logger.js';

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

    this._propertyDescriptors['onDestroy'] = new PrimitiveTypeProperty('onDestroy', 'setOnDestroyHandler', false, 'function');
  }

  create (app, properties) {
    this.validate(undefined, undefined, properties);

    const prism = app.addPrism(properties);

    Object.defineProperty(prism, 'addChild$Universal', {
      enumerable: true,
      writable: false,
      configurable: false,
      value: (child) => logError('Prism is not supposed to add children !')
    });

    // Filter out 'size' property
    const { size, ...unapplied } = properties;
    this.update(prism, undefined, unapplied, app);

    return prism;
  }

  validate (prism, oldProperties, newProperties) {
    super.validate(prism, oldProperties, newProperties);

    this._validateSize(prism, oldProperties, newProperties);
    this._validatePosition(prism, oldProperties, newProperties);
    this._validateOrientation(prism, oldProperties, newProperties);
  }

  update (prism, oldProperties, newProperties, app) {
    super.update(prism, oldProperties, newProperties);

    this._setSize(prism, oldProperties, newProperties, app);
    this._setPosition(prism, oldProperties, newProperties, app);
    this._setOrientation(prism, oldProperties, newProperties, app);
  }

  _validatePosition (prism, oldProperties, newProperties) {
    PropertyDescriptor.throwIfNotArray(newProperties.position, 'vec3');
    PrimitiveTypeProperty.throwIfNotTypeOf(newProperties.positionRelativeToCamera, 'boolean');
  }

  _setPosition (prism, oldProperties, newProperties, app) {
    if (newProperties.position !== undefined) {
      if (this.getPropertyValue('positionRelativeToCamera', false, newProperties)) {
        executor.callNativeAction(app, 'positionPrismRelativeToCamera', prism, newProperties.position);
      } else {
        executor.callNativeAction(app, 'positionPrism', prism, newProperties.position);
      }
    }
  }

  _validateOrientation (prism, oldProperties, newProperties) {
    PropertyDescriptor.throwIfNotArray(newProperties.orientation, 'quat');
    PrimitiveTypeProperty.throwIfNotTypeOf(newProperties.orientationRelativeToCamera, 'boolean');
  }

  _setOrientation (prism, oldProperties, newProperties, app) {
    if (newProperties.orientation !== undefined) {
      if (this.getPropertyValue('orientationRelativeToCamera', false, newProperties)) {
        executor.callNativeAction(app, 'orientPrismRelativeToCamera', prism, newProperties.orientation);
      } else {
        executor.callNativeAction(app, 'orientPrism', prism, newProperties.orientation);
      }
    }
  }

  _validateSize (prism, oldProperties, newProperties) {
    PropertyDescriptor.throwIfNotArray(newProperties.size, 'vec3');
  }

  _setSize (prism, oldProperties, newProperties, app) {
    if (newProperties.size !== undefined) {
      app.resizePrism(prism, newProperties.size);
    }
  }

  trackHandGesture (prism, oldProperties, newProperties) {
    // startTrackHandGesture
    // stopTrackHandGesture
    logWarning('PrismBuilder.trackHandGesture has not been implemented yet');
  }

  trackingAutoHapticOnGesture (prism, oldProperties, newProperties) {
    // startTrackingAutoHapticOnGesture
    // stopTrackingAutoHapticOnGesture
    logWarning('PrismBuilder.trackingAutoHapticOnGesture has not been implemented yet');
  }

  setOnDestroyHandler (prism, oldProperties, newProperties) {
      executor.callNativeFunction(prism, 'onDestroyEventSub', newProperties.onDestroy);
  }
}
