// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { multipack, utils, Desc2d } from 'lumin';

import { RenderBuilder } from './render-builder.js';

import { ArrayProperty } from '../properties/array-property.js';
import { ClassProperty } from '../properties/class-property.js';
import { EnumProperty } from '../properties/enum-property.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';
import { PropertyDescriptor } from '../properties/property-descriptor.js';

import { Filter } from '../../types/filter-type.js';
import { ViewMode } from '../../types/view-mode.js';
import { Wrap } from '../../types/wrap-type.js';
import { ResourceType } from '../../types/resource-type.js';

import executor from '../../utilities/executor.js'

export class QuadBuilder extends RenderBuilder {
  constructor () {
    super();

    this._propertyDescriptors['texCoords'] = new ArrayProperty('texCoords', 'setTexCoords', false, 'vec4');
    this._propertyDescriptors['viewMode'] = new EnumProperty('viewMode', 'setViewMode', true, ViewMode, 'ViewMode');
    this._propertyDescriptors['size'] = new ArrayProperty('size', 'setSize', true, 'vec2');

    this._defineRenderResourceParamters();
    this._defineRenderResourceConstructors();
  }

  _defineRenderResourceParamters () {
    const texturePackParamsProperties = [
      new PrimitiveTypeProperty('allowMipmaps', undefined, undefined, 'boolean'),
      new EnumProperty('magFilter', undefined, undefined, Filter, 'Filter'),
      new EnumProperty('minFilter', undefined, undefined, Filter, 'Filter'),
      new EnumProperty('mipMapFilter', undefined, undefined, Filter, 'Filter'),
      new PrimitiveTypeProperty('numMipmaps', undefined, undefined, 'number')
    ];

    const desc2dParamsProperties = [
      new PrimitiveTypeProperty('lodBias', undefined, undefined, 'number'),
      new EnumProperty('magFilter', undefined, undefined, Filter, 'Filter'),
      new PrimitiveTypeProperty('maxAnisotropy', undefined, undefined, 'number'),
      new PrimitiveTypeProperty('maxMipLevel', undefined, undefined, 'number'),
      new EnumProperty('minFilter', undefined, undefined, Filter, 'Filter'),
      new EnumProperty('mipMapFilter', undefined, undefined, Filter, 'Filter'),
      new EnumProperty('uCoordWrap', undefined, undefined, Wrap, 'Wrap'),
      new EnumProperty('vCoordWrap', undefined, undefined, Wrap, 'Wrap')
    ];

    const textureTex2dDescProperties = [
      new PrimitiveTypeProperty('allowMipmaps', undefined, undefined, 'boolean'),
      new PrimitiveTypeProperty('numMipmaps', undefined, undefined, 'number'),
      new PrimitiveTypeProperty('upscaleToRGB', undefined, undefined, 'boolean'),
      new ClassProperty('params', undefined, undefined, desc2dParamsProperties)
    ];

    const animationProperties = [
      { name: 'fileName', property: new PrimitiveTypeProperty('fileName', undefined, undefined, 'string'), optional: false },
      { name: 'absolutePath', property: new PrimitiveTypeProperty('absolutePath', undefined, undefined, 'boolean'), optional: true },
      { name: 'descriptor', property: new PrimitiveTypeProperty('descriptor', undefined, undefined, 'number'), optional: true },
      { name: 'basePath', property: new PrimitiveTypeProperty('basePath', undefined, undefined, 'string'), optional: true }
    ];

    this._renderResourceParamters = {
      'Animation': animationProperties,
      'AnimationBlendSetup': animationProperties,
      'AnimationSet': animationProperties,
      'Material': [
        { name: 'fileName', property: new PrimitiveTypeProperty('fileName', undefined, undefined, 'string'), optional: false },
        { name: 'absolutePath', property: new PrimitiveTypeProperty('absolutePath', undefined, undefined, 'boolean'), optional: true },
        { name: 'localScopeOnly', property: new PrimitiveTypeProperty('localScopeOnly', undefined, undefined, 'boolean'), optional: true }
      ],
      'Model': [
        ...animationProperties,
        { name: 'importScale', property: new PrimitiveTypeProperty('importScale', undefined, undefined, 'number'), optional: false }
      ],
      'Mtl': [
        { name: 'fileName', property: new PrimitiveTypeProperty('fileName', undefined, undefined, 'string'), optional: false },
        { name: 'absolutePath', property: new PrimitiveTypeProperty('absolutePath', undefined, undefined, 'boolean'), optional: true }
      ],
      'TexturePack': [
        { name: 'absolutePath', property: new PrimitiveTypeProperty('absolutePath', undefined, undefined, 'boolean'), optional: true },
        { name: 'directory', property: new PrimitiveTypeProperty('directory', undefined, undefined, 'boolean'), optional: false },
        { name: 'params', property: new ClassProperty('params', undefined, undefined, texturePackParamsProperties), optional: true }
      ],
      'Texture': [
        { name: 'fileName', property: new PrimitiveTypeProperty('fileName', undefined, undefined, 'string'), optional: false },
        { name: 'absolutePath', property: new PrimitiveTypeProperty('absolutePath', undefined, undefined, 'boolean'), optional: true },
        { name: 'descriptor', property: new PrimitiveTypeProperty('descriptor', undefined, undefined, 'number'), optional: true },
        { name: 'tex2dDesc', property: new ClassProperty('tex2dDesc', undefined, undefined, textureTex2dDescProperties), optional: true }
      ]
    };
  }

  _defineRenderResourceConstructors () {
    this._renderResourceConstructors = {
      'animation': this._createAnimation.bind(this),
      'animation-blend-setup': this._createAnimationBlendSetup.bind(this),
      'animation-set': this._createAnimationSet.bind(this),
      'material': this._createMaterial.bind(this),
      'model': this._createModel.bind(this),
      'mtl': this._createMtl.bind(this),
      'texture-pack': this._createTexturePack.bind(this),
      'texture': this._createTexture.bind(this)
    };
  }

  create (prism, properties) {
    this.throwIfInvalidPrism(prism);

    this.validate(undefined, undefined, properties);

    const renderResourceId = this._createRenderResource(prism, properties.renderResource);

    const element = this._createNode(prism, 'createQuadNode', renderResourceId);

    const unapplied = this.excludeProperties(properties, ['renderResource']);

    this.apply(element, undefined, unapplied);

    return element;
  }

  update (element, oldProperties, newProperties) {
    super.update(element, oldProperties, newProperties);

    this._validateSubTexture(newProperties);
    this._setSubTexture(element, newProperties);
  }

  validate (element, oldProperties, newProperties) {
    super.validate(element, oldProperties, newProperties);

    this._validateSubTexture(newProperties);
    this._validateRenderResource(newProperties);
  }

  _validateSubTexture (properties) {
    const subTexture = properties.subTexture;

    if (PropertyDescriptor.hasValue(subTexture)) {
      if (typeof subTexture !== 'string' &&
               typeof subTexture !== 'number') {
        throw new TypeError(`subTexture parameter ${subTexture} should be string or number type`);
      }
    }
  }

  _validateResourceParameters (configuration, value) {
    if (value === undefined && !configuration.optional) {
      throw new Error(`Quad parameter renderResource[${configuration.name}] is required`);
    }

    configuration.property.validate(value);
  }

  _validateRenderResource (properties) {
    if (properties.renderResource === undefined) {
      throw new Error('Quad parameter renderResource is undefined');
    }

    const resourceTypeProperty = new EnumProperty('resourceType', undefined, undefined, ResourceType, 'ResourceType');
    resourceTypeProperty.validate(properties.renderResource.resourceType);

    this._renderResourceParamters[properties.renderResource.resourceType]
      .forEach(parameter => this._validateResourceParameters(parameter, properties.renderResource[parameter.name]));
  }

  _createAnimation (prism, properties) {
    const absolutePath = this.getPropertyValue('absolutePath', false, properties);
    const descriptor = this.getPropertyValue('descriptor', -1, properties);
    const basePath = this.getPropertyValue('basePath', null, properties);
    return executor.callNativeFunction(prism, 'createAnimationResourceId', properties.fileName, absolutePath, descriptor, basePath);
  }

  _createAnimationBlendSetup (prism, properties) {
    const absolutePath = this.getPropertyValue('absolutePath', false, properties);
    const descriptor = this.getPropertyValue('descriptor', -1, properties);
    const basePath = this.getPropertyValue('basePath', null, properties);
    return executor.callNativeFunction(prism, 'createAnimationBlendSetupResourceId', properties.fileName, absolutePath, descriptor, basePath);
  }
  _createAnimationSet (prism, properties) {
    const absolutePath = this.getPropertyValue('absolutePath', false, properties);
    const descriptor = this.getPropertyValue('descriptor', -1, properties);
    const basePath = this.getPropertyValue('basePath', null, properties);
    return executor.callNativeFunction(prism, 'createAnimationSetResourceId', properties.fileName, absolutePath, descriptor, basePath);
  }
  _createMaterial (prism, properties) {
    const absolutePath = this.getPropertyValue('absolutePath', false, properties);
    const localScopeOnly = this.getPropertyValue('localScopeOnly', false, properties);
    return executor.callNativeFunction(prism, 'createMaterialResourceId', properties.fileName, localScopeOnly, absolutePath);
  }
  _createModel (prism, properties) {
    const absolutePath = this.getPropertyValue('absolutePath', false, properties);
    const descriptor = this.getPropertyValue('descriptor', -1, properties);
    const basePath = this.getPropertyValue('basePath', null, properties);
    const importScale = this.getPropertyValue('importScale', 1, properties);
    return executor.callNativeFunction(prism, 'createModelResourceId', properties.fileName, importScale, absolutePath, descriptor, basePath);
  }
  _createMtl (prism, properties) {
    const absolutePath = this.getPropertyValue('absolutePath', false, properties);
    return executor.callNativeFunction(prism, 'createObjMtlResourceId', properties.fileName, absolutePath);
  }
  _createTexturePack (prism, properties) {
    const absolutePath = this.getPropertyValue('absolutePath', false, properties);

    let params;
    if (properties.params === undefined) {
      params = new multipack.Params.DEFAULT();
    } else {
      params = new multipack.Params();
      params.allowMipmaps = properties.params.allowMipmaps;
      params.magFilter = Filter[properties.params.magFilter];
      params.minFilter = Filter[properties.params.minFilter];
      params.mipMapFilter = Filter[properties.params.mipMapFilter];
      params.numMipmaps = this.getPropertyValue('numMipmaps', 0, properties.params);
    }

    return executor.callNativeFunction(prism, 'createTexturePackResourceId', properties.directory, params, absolutePath);
  }
  _createTexture (prism, properties) {
    const absolutePath = this.getPropertyValue('absolutePath', false, properties);
    const descriptor = this.getPropertyValue('descriptor', -1, properties);

    let tex2dDesc;
    if (properties.tex2dDesc === undefined) {
      tex2dDesc = Desc2d.DEFAULT;
    } else {
      tex2dDesc.allowMipmaps = properties.tex2dDesc.allowMipmaps;
      tex2dDesc.numMipmaps = properties.tex2dDesc.numMipmaps;
      tex2dDesc.upscaleToRGB = properties.tex2dDesc.upscaleToRGB;

      let params2d;
      if (properties.tex2dDesc.params === undefined) {
        params2d = utils.Params2d.DEFAULT;
      } else {
        params2d = new utils.Params2d();
        params2d.lodBias = properties.tex2dDesc.params.lodBias;
        params2d.magFilter = Filter[properties.tex2dDesc.params.magFilter];
        params2d.maxAnisotropy = properties.tex2dDesc.params.maxAnisotropy;
        params2d.maxMipLevel = properties.tex2dDesc.params.maxMipLevel;
        params2d.minFilter = Filter[properties.tex2dDesc.params.minFilter];
        params2d.mipMapFilter = Filter[properties.tex2dDesc.params.mipMapFilter];
        params2d.uCoordWrap = Wrap[properties.tex2dDesc.params.uCoordWrap];
        params2d.vCoordWrap = Wrap[properties.tex2dDesc.params.vCoordWrap];
      }

      tex2dDesc.params = params2d;
    }

    return executor.callNativeFunction(prism, 'createTextureResourceId', tex2dDesc, properties.fileName, absolutePath, descriptor);
  }

  _createRenderResource (prism, value) {
    return this._renderResourceConstructors[value.resourceType](prism, value, this);
  }

  _setSubTexture (element, properties) {
    const subTexture = properties.subTexture;

    if (subTexture !== undefined) {
      this._callNodeAction(element, 'setSubTexture', subTexture);
    }
  }

  setTexCoords (element, oldProperties, newProperties) {
    const texCoords = newProperties.texCoords;
    texCoords.forEach(coordinate => PropertyDescriptor.throwIfNotArray(coordinate, 'vec2'));
    this._callNodeAction(element, 'setTexCoords', texCoords);
  }

  extraTypeScript () {
    return '    subTexture?: string | number;\n';
  }
}
