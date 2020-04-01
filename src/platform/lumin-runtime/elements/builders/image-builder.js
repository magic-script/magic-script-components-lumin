// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui, Desc2d, INVALID_RESOURCE_ID } from 'lumin';
import { SystemIcons } from '../../types/system-icons.js';

import { UiNodeBuilder } from './ui-node-builder.js';
import { ArrayProperty } from '../properties/array-property.js';
import { ColorProperty } from '../properties/color-property.js';
import { EnumProperty } from '../properties/enum-property.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';
import { PropertyDescriptor } from '../properties/property-descriptor.js';

import loadRemoteResource from '../../utilities/resource-download.js';
import executor from '../../utilities/executor.js';
import validator from '../../utilities/validator.js';

import { isUrl } from '../../../../util/download.js';

import { getSize } from 'magic-script-polyfills/src/size.js';
import { readfileSync } from 'magic-script-polyfills/src/fs-sync.js';

/**
 * @exports ImageContentMode
 * @description Represents content mode of image.
 */ 
const ImageContentMode = {
  aspectFill: 'aspectFill',
  aspectFit: 'aspectFit',
  stretch: 'stretch'
}

// const REGEX_URL = /^(http(s?):\/\/.*)/;
// const REGEX_FILE_PATH = new RegExp('^(/)?([^/\0]+(/)?)+$');
const REGEX_LOCAL_PATH = /^(\/)?([^\/\0]+(\/)?)+$/;

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

    // Custom props
    this._propertyDescriptors['contentMode'] = new EnumProperty('contentMode', 'setContentMode', false, ImageContentMode, 'ImageContentMode');
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
          (localPath) => executor.callNativeFunction(prism, 'createTextureResourceId', Desc2d.DEFAULT, localPath, true));
      } else {
        element = this._createNode(ui.UiImage, 'Create', prism, filePath, width, height, absolutePath, useFrame);
      }
    } else if (color) {
      element = this._createNode(ui.UiImage, 'Create', prism, INVALID_RESOURCE_ID, width, height, useFrame);
    }

    const unapplied = this.excludeProperties(properties, ['icon', 'filePath', 'resourceId', 'height', 'width']);

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
  }

  validate (element, oldProperties, newProperties) {
    super.validate(element, oldProperties, newProperties);

    const message = `The provided icon ${newProperties.icon} is not a valid value`;
    PropertyDescriptor.throwIfPredicateFails(newProperties.icon, message, validator.validateSystemIcon);

    PropertyDescriptor.throwIfNotTypeOf(newProperties.resourceId, 'number');

    this._validateSize(newProperties);
    this._validateFilePath(newProperties);
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

  _getTexCoords (dimension, size, mode) {
    let offset = { u: 0, v: 0 };

    if (mode === ImageContentMode.aspectFill || 
        mode === ImageContentMode.aspectFit) {
      const factors = { h: size.width / dimension.width, v: size.height / dimension.height };
      const factor = (mode === ImageContentMode.aspectFill) ? Math.max(factors.h, factors.v) : Math.min(factors.h, factors.v);
      const target = { width: factor * dimension.width, height: factor * dimension.height };
      offset.u = 0.5 * (1.0 - (size.width / target.width));
      offset.v = 0.5 * (1.0 - (size.height / target.height));
    } else if (mode === ImageContentMode.stretch) {
      offset.u = 0;
      offset.v = 0;
    }

    const u0 = 0 + offset.u;
    const u1 = 1 - offset.u;
    const v0 = 0 + offset.v;
    const v1 = 1 - offset.v;
    return [[u0, v1], [u1,v1], [u1,v0], [u0,v0]];
  }

  setContentMode (element, oldProperties, newProperties) {
    if (!REGEX_LOCAL_PATH.test(newProperties.filePath)) {
      return;
    }

    let meta;
    try {
      meta = getSize(readfileSync(newProperties.filePath, 'r', 0o644));
    } catch (error) {
      logError(error.message);
    }

    if (meta) {
      this._setContentMode(element, oldProperties, newProperties, meta);
    } else {
      this._callNodeAction(element, 'setTexCoords', [[0, 1], [1,1], [1,0], [0,0]]);
    }
  }

  _setContentMode (element, oldProperties, newProperties, meta) {
    const contentMode = this.getPropertyValue('contentMode', ImageContentMode.aspectFill, newProperties);
    const size = { width: newProperties.width, height: newProperties.height };
    const dimensions = { width: meta.width, height: meta.height };
    const texCoords = this._getTexCoords(dimensions, size, contentMode);
    this._callNodeAction(element, 'setTexCoords', texCoords);
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
