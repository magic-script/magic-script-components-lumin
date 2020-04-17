// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui, Desc2d, INVALID_RESOURCE_ID } from 'lumin';
import { getSize } from 'magic-script-polyfills/src/size.js';
import { readfileSync } from 'magic-script-polyfills/src/fs-sync.js';

import { UiNodeBuilder } from './ui-node-builder.js';
import { ArrayProperty } from '../properties/array-property.js';
import { ColorProperty } from '../properties/color-property.js';
import { EnumProperty } from '../properties/enum-property.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';
import { PropertyDescriptor } from '../properties/property-descriptor.js';

import { ImageFitMode } from '../../types/image-fit-mode.js';
import { SystemIcons } from '../../types/system-icons.js';

import loadRemoteResource from '../../utilities/resource-download.js';
import executor from '../../utilities/executor.js';
import validator from '../../utilities/validator.js';

import { isUrl } from '../../../../util/download.js';
import { logError, logWarning } from '../../../../util/logger.js';

const DEFAULT_TEXTURE_COORDINATES = [[0, 1], [1,1], [1,0], [0,0]];

export class ImageBuilder extends UiNodeBuilder {
  constructor () {
    super();

    this._propertyDescriptors['ui'] = new PrimitiveTypeProperty('ui', 'setIsUI', true, 'boolean');
    this._propertyDescriptors['opaque'] = new PrimitiveTypeProperty('opaque', 'setIsOpaque', true, 'boolean');
    this._propertyDescriptors['color'] = new ColorProperty('color', 'setColor', true);
    this._propertyDescriptors['texCoords'] = new ArrayProperty('texCoords', 'setTexCoords', false, 'vec4');

    // Expects Id
    this._propertyDescriptors['imageFrameResource'] = new PrimitiveTypeProperty('imageFrameResource', 'setImageFrameResource', true, 'number');
    this._propertyDescriptors['renderResource'] = new PrimitiveTypeProperty('renderResource', 'setRenderResource', true, 'number');
  }

  create (prism, properties) {
    this.throwIfInvalidPrism(prism);

    this.validate(undefined, undefined, properties);

    const { icon, filePath, resourceId, height, width, color } = properties;

    const absolutePath = this.getPropertyValue('absolutePath', false, properties);
    const useFrame = this.getPropertyValue('useFrame', false, properties);

    let element;
    if (typeof icon === 'string') {
      element = this._createNode(ui.UiImage, 'Create', prism, SystemIcons[icon], height);
    } else if (resourceId) {
      element = this._createNode(ui.UiImage, 'Create', prism, resourceId, width, height, useFrame);
    } else if (filePath) {
      if (isUrl(filePath)) {
        // Create placeholder image
        element = this._createNode(ui.UiImage, 'Create', prism, INVALID_RESOURCE_ID, width, height, useFrame);

        loadRemoteResource(filePath, properties, element, prism, 'setRenderResource',
          (localPath) => executor.callNativeFunction(prism, 'createTextureResourceId', Desc2d.DEFAULT, localPath, true),
          (localPath) => {
            this._applyFitMode(element, localPath, ImageFitMode[properties.fit], { width: properties.width, height: properties.height});
          });
      } else {
        element = this._createNode(ui.UiImage, 'Create', prism, filePath, width, height, absolutePath, useFrame);
        
        // Manually set 'fit' property since 'filePath' won't be part of the unapplied properties array
        this._setFit(element, undefined, properties);
      }
    } else if (color) {
      element = this._createNode(ui.UiImage, 'Create', prism, INVALID_RESOURCE_ID, width, height, useFrame);
    }

    const unapplied = this.excludeProperties(properties, ['icon', 'filePath', 'resourceId', 'height', 'width', 'fit']);

    this.apply(element, undefined, unapplied);

    return element;
  }

  update (element, oldProperties, newProperties, prism) {
    // this.throwIfNotInstanceOf(element, ui.UiImage);
    super.update(element, oldProperties, newProperties);

    this._validateSize(newProperties);
    this._setSize(element, newProperties);

    this._validateFilePath(newProperties);
    this._setFilePath(element, oldProperties, newProperties, prism);

    this._validateFit(newProperties);
    this._setFit(element, oldProperties, newProperties, prism);
  }

  validate (element, oldProperties, newProperties) {
    super.validate(element, oldProperties, newProperties);

    const message = `The provided icon ${newProperties.icon} is not a valid value`;
    PropertyDescriptor.throwIfPredicateFails(newProperties.icon, message, validator.validateSystemIcon);

    PropertyDescriptor.throwIfNotTypeOf(newProperties.resourceId, 'number');

    this._validateSize(newProperties);
    this._validateFilePath(newProperties);
    this._validateFit(newProperties);
  }

  _validateSize (properties) {
    PropertyDescriptor.throwIfNotTypeOf(properties.height, 'number');
    PropertyDescriptor.throwIfNotTypeOf(properties.width, 'number');
  }

  _setSize (element, properties) {
    let { height, width } = properties;

    if (width || height) {
      if (width === undefined) {
        width = this._callNodeFunction(element, 'getSize')[0];
      }

      if (height === undefined) {
        height = this._callNodeFunction(element, 'getSize')[1];
      }

      this._callNodeAction(element, 'setSize', [width, height]);
    }
  }

  setTexCoords (element, oldProperties, newProperties) {
    const texCoords = newProperties.texCoords;
    texCoords.forEach(coordinate => PropertyDescriptor.throwIfNotArray(coordinate, 'vec2'));
    this._callNodeAction(element, 'setTexCoords', texCoords);
  }

  _calculateTexCoords (fitMode, originalSize, targetSize) {
    const MAX = 1.0, MIN = 0, MID = 0.5;

    // Default value works for 'stretch' ImageFitMode only !
    const offset = { x: 0, y: 0 };

    if (fitMode === ImageFitMode['aspect-fill'] || 
        fitMode === ImageFitMode['aspect-fit']) {
      const ratio = {
        h: targetSize.width / originalSize.width,
        v: targetSize.height / originalSize.height
      };
      const factor = fitMode === ImageFitMode['aspect-fill']
        ? Math.max(ratio.h, ratio.v)
        : Math.min(ratio.h, ratio.v);
      const calculatedSize = {
        width: factor * originalSize.width,
        height: factor * originalSize.height
      };
      offset.x = MID * (MAX - (targetSize.width / calculatedSize.width));
      offset.y = MID * (MAX - (targetSize.height / calculatedSize.height));
    }

    const x0 = MIN + offset.x;
    const x1 = MAX - offset.x;
    const y0 = MIN + offset.y;
    const y1 = MAX - offset.y;
    return [[x0, y1], [x1, y1], [x1, y0], [x0, y0]];
  }

  _applyFitMode (element, filePath, fitMode, targetSize) {
    if (fitMode === undefined) {
      return;
    }

    let imageSize;
    try {
      imageSize = getSize(readfileSync(filePath, 'r', 0o644));
    } catch (error) {
      logError(error.message);
    }

    if (imageSize) {
      const texCoords = this._calculateTexCoords(fitMode, { width: imageSize.width, height: imageSize.height }, targetSize);
      this._callNodeAction(element, 'setTexCoords', texCoords);
    } else {
      // Apply 'stretch' as default
      this._callNodeAction(element, 'setTexCoords', DEFAULT_TEXTURE_COORDINATES);
    }
  }

  _validateFit (properties) {
    const fit = properties.fit;
    const message = `The provided image fit ${fit} is not a valid value`;
    PropertyDescriptor.throwIfPredicateFails(fit, message, validator.validateImageFitMode);
  }

  _setFit (element, oldProperties, newProperties, prism) {
    if (isUrl(newProperties.filePath)) {
      const resourceId = element.getRenderResource();
      if (resourceId !== INVALID_RESOURCE_ID) {
        const resource = prism.getResource(resourceId);
        const filePath = resource.getBasePath();
        const fileName = resource.getFileName();
        this._applyFitMode(element, `${filePath}/${fileName}`, ImageFitMode[newProperties.fit], { width: newProperties.width, height: newProperties.height});
      } else {
        logWarning('The remote resource has not been loaded yet. Could not apply "fit" property');
      }
    } else {
      this._applyFitMode(element, newProperties.filePath, ImageFitMode[newProperties.fit], { width: newProperties.width, height: newProperties.height});
    }
  }

  _validateFilePath (newProperties) {
    PropertyDescriptor.throwIfNotTypeOf(newProperties.filePath, 'string');
  }

  _setFilePath (element, oldProperties, newProperties, prism) {
    if (oldProperties.filePath === undefined) {
      if (newProperties.filePath !== undefined) {
        const absolutePath = newProperties.absolutePath === true;
        this._callNodeAction(element, 'setRenderResource',
          this._callNodeFunction(prism, 'createTextureResourceId', Desc2d.DEFAULT, newProperties.filePath, absolutePath));
      }
    } else {
      if (newProperties.filePath !== undefined) {
        if (oldProperties.filePath !== newProperties.filePath) {
          const oldResourceId = this._callNodeFunction(element, 'getRenderResource');
          const absolutePath = newProperties.absolutePath === true;

          this._callNodeAction(element, 'setRenderResource',
            this._callNodeFunction(prism, 'createTextureResourceId', Desc2d.DEFAULT, newProperties.filePath, absolutePath));

            this._callNodeAction(prism, 'destroyResource', oldResourceId);
        }
      } else {
        this._callNodeAction(prism, 'destroyResource',
          this._callNodeFunction(element, 'getRenderResource'));
      }
    }
  }

  extraTypeScript() {
    return  '    width?: number;\n' +
            '    height?: number;\n' +
            '    icon?: SystemIcon;\n' +
            '    filePath?: string;\n' +
            '    resourceId?: bigint;\n' +
            '    absolutePath?: boolean;\n' +
            '    useFrame?: boolean;\n';
  }
}
