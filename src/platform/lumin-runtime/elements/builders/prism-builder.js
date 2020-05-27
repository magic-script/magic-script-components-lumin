// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved
import { ElementBuilder } from './element-builder.js';

import { ArrayProperty } from '../properties/array-property.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';
import { PropertyDescriptor } from '../properties/property-descriptor.js';

import { HandGestureFlags }  from '../../types/hand-gesture-flags.js';
import { DeviceGestureFlags }  from '../../types/device-gesture-flags.js';

import executor from '../../utilities/executor.js';
import { logWarning, logError } from '../../../../util/logger.js';

import { mat4, vec3, quat } from 'gl-matrix';

import { XrClientProvider } from 'magic-script-components';


export class PrismBuilder extends ElementBuilder {
  constructor () {
    super();

    this._propertyDescriptors['excludeFromAutoFocus'] = new PrimitiveTypeProperty('excludeFromAutoFocus', 'setExcludeFromAutoFocus', true, 'boolean');
    this._propertyDescriptors['handGestureFilterConfidenceLevel'] = new PrimitiveTypeProperty('handGestureFilterConfidenceLevel', 'setHandGestureFilterConfidenceLevel', true, 'number');
    this._propertyDescriptors['handGestureFilterPollRate'] = new PrimitiveTypeProperty('handGestureFilterPollRate', 'setHandGestureFilterPollRate', true, 'number');
    this._propertyDescriptors['handGestureFilterPositionDelta'] = new PrimitiveTypeProperty('handGestureFilterPositionDelta', 'setHandGestureFilterPositionDelta', true, 'number');
    this._propertyDescriptors['handGestureHoverDistance'] = new PrimitiveTypeProperty('handGestureHoverDistance', 'setHandGestureHoverDistance', true, 'number');
    this._propertyDescriptors['handGestureTouchDistance'] = new PrimitiveTypeProperty('handGestureTouchDistance', 'setHandGestureTouchDistance', true, 'number');
    this._propertyDescriptors['physicsEnabled'] = new PrimitiveTypeProperty('physicsEnabled','setPhysicsEnabled', true, 'boolean');
    this._propertyDescriptors['physicsPaused'] = new PrimitiveTypeProperty('physicsPaused', 'setPhysicsPaused', true, 'boolean');
    this._propertyDescriptors['physicsWorldMeshEnabled'] = new PrimitiveTypeProperty('physicsWorldMeshEnabled', 'setPhysicsWorldMeshEnabled', true, 'boolean');
    this._propertyDescriptors['prismBloomStrength'] = new PrimitiveTypeProperty('prismBloomStrength', 'setPrismBloomStrength', true, 'number');
    this._propertyDescriptors['volumeBloomStrength'] = new PrimitiveTypeProperty('volumeBloomStrength', 'setVolumeBloomStrength', true, 'number');
    this._propertyDescriptors['trackHandGesture'] = new ArrayProperty('trackHandGesture', 'trackHandGesture', false);
    this._propertyDescriptors['trackingAutoHapticOnGesture'] = new ArrayProperty('trackingAutoHapticOnGesture', 'trackingAutoHapticOnGesture', false);

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

    Object.defineProperty(prism, 'onDestroyHandlerId', {
      enumerable: true,
      writable: true,
      configurable: false,
      value: undefined
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

    app.updatePrism(prism, newProperties);
  }

  _validatePosition (prism, oldProperties, newProperties) {
    PropertyDescriptor.throwIfNotArray(newProperties.position, 'vec3');
    PrimitiveTypeProperty.throwIfNotTypeOf(newProperties.positionRelativeToCamera, 'boolean');
  }

  _setPosition (prism, oldProperties, newProperties, app) {
    if (newProperties.anchorUuid !== undefined) {
      this._setPositionWithAnchor(prism, oldProperties, newProperties, app);
    } else if (newProperties.position !== undefined) {
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
    if (newProperties.anchorUuid !== undefined) {
      this._setOrientationWithAnchor(prism, oldProperties, newProperties, app);
    } else if (newProperties.orientation !== undefined) {
      if (this.getPropertyValue('orientationRelativeToCamera', false, newProperties)) {
        executor.callNativeAction(app, 'orientPrismRelativeToCamera', prism, newProperties.orientation);
      } else {
        executor.callNativeAction(app, 'orientPrism', prism, newProperties.orientation);
      }
    }
  }

  _getAnchorPose(properties) {
    const xrClient = XrClientProvider.getXrClient();
    return xrClient.getAnchorPose(properties.anchorUuid);
  }

  _setPositionWithAnchor (prism, oldProperties, newProperties, app) {
    const anchorPose = this._getAnchorPose(newProperties);
    if (!anchorPose) {
      return false;
    }

    let pos = vec3.create();
    mat4.getTranslation(pos, anchorPose);
    executor.callNativeAction(app, 'positionPrism', prism, pos);

    return true;
  }

  _setOrientationWithAnchor (prism, oldProperties, newProperties, app) {
    const anchorPose = this._getAnchorPose(newProperties);
    if (!anchorPose) {
      return false;
    }

    let rot = quat.create();
    mat4.getRotation(rot, anchorPose);
    executor.callNativeAction(app, 'orientPrism', prism, rot);

    return true;
  }

  _validateSize (prism, oldProperties, newProperties) {
    PropertyDescriptor.throwIfNotArray(newProperties.size, 'vec3');
  }

  _setSize (prism, oldProperties, newProperties, app) {
    if (newProperties.size !== undefined) {
      app.resizePrism(prism, newProperties.size);
    }
  }

  _trackGestures(prism, oldProperties, newProperties, propertyName, flagsEnum, startFunction, stopFunction) {
    const oldGestures = oldProperties ? oldProperties[propertyName] : undefined;
    const newGestures = newProperties ? newProperties[propertyName] : undefined;

    if (Array.isArray(oldGestures)) {
      if (Array.isArray(newGestures)) {
        const removed = oldGestures.filter(oldGesture => newGestures.every(newGesture => newGesture !== oldGesture));
        const added = newGestures.filter(newGesture => oldGestures.every(oldGesture => oldGesture !== newGesture));

        let gestureFlags;
        if (removed.length > 0) {
          gestureFlags = removed.reduce((gestures, gesture) => gestures | flagsEnum[gesture].value);
          executor.callNativeFunction(prism, stopFunction, gestureFlags);
        }

        if (added.length > 0) {
          gestureFlags = added.reduce((gestures, gesture) => gestures | flagsEnum[gesture].value);
          executor.callNativeFunction(prism, startFunction, gestureFlags);
        }
      } else {
        if (oldGestures.length > 0) {
          const gestureFlags = oldGestures.reduce((gestures, gesture) => gestures | flagsEnum[gesture].value);
          executor.callNativeFunction(prism, stopFunction, gestureFlags);
        }
      }
    } else {
      if (Array.isArray(newGestures) && newGestures.length > 0) {
        const gestureFlags = newGestures.reduce((gestures, gesture) => gestures | flagsEnum[gesture].value);
        executor.callNativeFunction(prism, startFunction, gestureFlags);
      }
    }
  }

  trackHandGesture (prism, oldProperties, newProperties) {
    this._trackGestures(prism, oldProperties, newProperties,
      'trackHandGesture', HandGestureFlags, 'startTrackHandGesture', 'stopTrackHandGesture');
  }

  trackingAutoHapticOnGesture (prism, oldProperties, newProperties) {
    this._trackGestures(prism, oldProperties, newProperties,
      'trackingAutoHapticOnGesture', DeviceGestureFlags, 'startTrackingAutoHapticOnGesture', 'stopTrackingAutoHapticOnGesture');
  }

  setOnDestroyHandler (prism, oldProperties, newProperties) {
      executor.callNativeFunction(prism, 'onDestroyEventSub', newProperties.onDestroy);
  }

  extraTypeScript() {
    return  '    onDestroy?: () => void;\n' +
    '    anchorUuid?: string;\n' +
    '    size?: vec3;\n' +
    '    position?: vec3;\n' +
    '    positionRelativeToCamera?: boolean;\n' +
    '    orientation?: quat;\n' +
    '    orientationRelativeToCamera?: boolean;\n' +
    '    debug?: boolean;\n';
  }
}
