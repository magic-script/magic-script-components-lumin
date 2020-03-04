// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved
import { Desc2d, INVALID_RESOURCE_ID } from 'lumin';

import { RenderBuilder } from './render-builder.js';

import { ClassProperty } from '../properties/class-property.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';
import { PropertyDescriptor } from '../properties/property-descriptor.js'

import { TextureType } from '../../types/texture-type.js';

import loadRemoteResource from '../../utilities/resource-download.js'
import executor from '../../utilities/executor.js';
import validator from '../../utilities/validator.js';

import { logError } from '../../../../util/logger.js';
import { isUrl } from '../../../../util/download.js';

export class ModelBuilder extends RenderBuilder {
    constructor() {
        super();

        this._propertyDescriptors['animationPauseState'] = new PrimitiveTypeProperty('animationPauseState', 'setAnimationPauseState', true, 'boolean');
        this._propertyDescriptors['animationPlaybackSpeed'] = new PrimitiveTypeProperty('animationPlaybackSpeed', 'setAnimationPlaybackSpeed', true, 'number');
        this._propertyDescriptors['animationTime'] = new PrimitiveTypeProperty('animationTime', 'setAnimationTime', true, 'number');
        this._propertyDescriptors['modelResourceId'] = new PrimitiveTypeProperty('modelResourceId', 'setModelResourceId', true, 'number');

        // animation
        const animationProperties = [
            new PrimitiveTypeProperty('resourceId', undefined, undefined, 'number'),
            new PrimitiveTypeProperty('name', undefined, undefined, 'string'),
            new PrimitiveTypeProperty('paused', undefined, undefined, 'boolean'),
            new PrimitiveTypeProperty('loops', undefined, undefined, 'number')
        ];

        this._propertyDescriptors['animation'] = new ClassProperty('animation', 'setAnimation', false, animationProperties);

        // texture
        const textureProperties = [
            new PrimitiveTypeProperty('textureId', undefined, undefined, 'number'),
            new PrimitiveTypeProperty('textureSlot', undefined, undefined, 'string'),
            new PrimitiveTypeProperty('materialName', undefined, undefined, 'string')
        ];

        this._propertyDescriptors['texture'] = new ClassProperty('texture', 'setTexture', false, textureProperties);
    }

    create(prism, properties) {
        this.throwIfInvalidPrism(prism);

        this.validate(undefined, undefined, properties);

        const { modelPath, materialPath, texturePaths } = properties;

        let textureIds;
        if (Array.isArray(texturePaths)) {
            textureIds = texturePaths.map(path =>
                this._callNodeFunction(prism, 'createTextureResourceId', Desc2d.DEFAULT, path));
        }

        if (materialPath !== undefined) {
            this._callNodeAction(prism, 'createMaterialResourceId', materialPath);
        }

        const importScale = this.getPropertyValue('importScale', 1.0, properties);
        let element;
        if (isUrl(modelPath)) {
            // Create placeholder model
            element = this._callNodeFunction(prism, 'createModelNode', INVALID_RESOURCE_ID);
            loadRemoteResource(modelPath, properties, element, prism, 'setModelResource',
              (localPath) => executor.callNativeFunction(prism, 'createModelResourceId', localPath, importScale, true));
        } else {
            element = this._callNodeFunction(prism, 'createModelNode',
                this._callNodeFunction(prism, 'createModelResourceId', modelPath, importScale));
        }

        this._setDefaultTexture(element, textureIds, properties)

        this.update(element, undefined, properties);
        return element;
    }

    validate(element, oldProperties, newProperties) {
        super.validate(element, oldProperties, newProperties);

        const { modelPath, materialPath, importScale } = newProperties;

        if (PropertyDescriptor.hasValue(modelPath)) {
            PropertyDescriptor.throwIfNotTypeOf(modelPath, 'string');
        }

        if (PropertyDescriptor.hasValue(materialPath)) {
            PropertyDescriptor.throwIfNotTypeOf(materialPath, 'string');
        }

        if (PropertyDescriptor.hasValue(importScale)) {
            PropertyDescriptor.throwIfNotTypeOf(importScale, 'number');
        }
    }

    _setDefaultTexture(element, textureIds, properties) {
        if (textureIds === undefined || textureIds.length === 0) {
            return;
        }

        if (  properties.defaultTextureIndex === undefined
           || typeof properties.defaultTextureIndex !== 'number') {
            return;
        }

        const defaultTextureIndex = properties.defaultTextureIndex;
        if ( defaultTextureIndex >= textureIds.length ) {
            logError(`defaultTextureId ${defaultTextureIndex} is out of available texture Ids range`);
            return;
        }

        const defaultTextureSlot = properties.defaultTextureSlot;
        if ( !validator.validateTextureType(defaultTextureSlot) ) {
            logError(`Provided defaultTextureSlot value ${defaultTextureSlot} is not supported`);
            return;
        }

        const defaultMaterialName = properties.defaultMaterialName;
        if ( defaultMaterialName === undefined) {
            logError('Value for defaultMaterialName attribute was not provided');
            return;
        }

        this._callNodeAction(element, 'setTexture', defaultMaterialName, TextureType[defaultTextureSlot], textureIds[defaultTextureIndex]);
    }

    setTexture(element, oldProperties, newProperties) {
        const texture = newProperties.texture;

        if (texture === undefined) {
            return;
        }

        const { materialName, textureSlot, textureId } = texture;

        if (materialName === undefined) {
            logError('Model.texture.materialName is required');
            return;
        }

        if (textureSlot === undefined) {
            logError('Model.texture.textureSlot is required');
            return;
        }

        if ( textureId === undefined) {
            logError('Model.texture.textureId is required');
            return;
        }

        this._callNodeAction(element, 'setTexture', materialName, TextureType[textureSlot], textureId)
    }

    setAnimation(element, oldProperties, newProperties) {
        if (newProperties.animation !== undefined) {
            let { resourceId, name, paused, loops } = newProperties.animation;

            if (resourceId === undefined) {
                resourceId = this._callNodeFunction(element, 'getModelResource');
            }

            if (paused === undefined) {
                paused = false;
            }

            if (loops === undefined) {
                loops = 0;
            }

            if (name === undefined) {
                throw new TypeError(`Animation Name has not been provided.`);
            }

            this._callNodeAction(element, 'playAnimation', resourceId, name, paused, loops);
        }
    }

    extraTypeScript() {
        return  '    modelPath?: string;\n' +
                '    materialPath?: string;\n' +
                '    importScale?: number;\n' +
                '    texturePaths?: number[];\n'
    }
}
