// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui, Desc2d } from 'lumin';
import { SystemIcons } from '../../types/system-icons.js';

import { UiNodeBuilder } from './ui-node-builder.js';
import { ArrayProperty } from '../properties/array-property.js';
import { ColorProperty } from '../properties/color-property.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';
import { PropertyDescriptor } from '../properties/property-descriptor.js';

import validator from '../../utilities/validator.js';
import { isUrl } from '../../../../util/download.js';

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
        // Create transperant image
        element = this._createNode(ui.UiImage, 'Create', prism, BigInt(0), width, height, useFrame);
        element.setColor([0.1, 0.1, 0.1, 0.1]);
        // show spinner while downloading.
        const spinner = this._createNode(ui.UiLoadingSpinner, 'Create', prism, ui.LoadingSpinnerType.k2dSpriteAnimation);
        const [w, h] = spinner.getSize();
        const [x, y, z] = spinner.getLocalPosition();
        spinner.setLocalPosition([x - (w / 2), y - (h / 2), z]);
        element.addChild(spinner);

        // Initiate image download
      } else {
        element = this._createNode(ui.UiImage, 'Create', prism, filePath, width, height, absolutePath, useFrame);
      }
    } else if (color) {
      element = this._createNode(ui.UiImage, 'Create', prism, BigInt(0), width, height, useFrame);
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

  _validateFilePath (newProperties) {
    PropertyDescriptor.throwIfNotTypeOf(newProperties.filePath, 'string');
  }

  _setFilePath (element, oldProperties, newProperties, prism) {
    if (oldProperties.filePath === undefined) {
      if (newProperties.filePath !== undefined) {
        this._callNodeAction(element, 'setRenderResource',
          this._callNodeFunction(prism, 'createTextureResourceId', Desc2d.DEFAULT, newProperties.filePath));
      }
    } else {
      if (newProperties.filePath !== undefined) {
        if (oldProperties.filePath !== newProperties.filePath) {
          const oldResourceId = this._callNodeFunction(element, 'getRenderResource');

          this._callNodeAction(element, 'setRenderResource',
            this._callNodeFunction(prism, 'createTextureResourceId', Desc2d.DEFAULT, newProperties.filePath));

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
