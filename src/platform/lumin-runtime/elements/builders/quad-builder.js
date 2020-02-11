// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { RenderBuilder } from './render-builder.js';

import { ArrayProperty } from '../properties/array-property.js';
import { ClassProperty } from '../properties/class-property.js';
import { EnumProperty } from '../properties/enum-property.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';
import { PropertyDescriptor } from '../properties/property-descriptor.js';

import { ViewMode } from '../../types/view-mode.js';

export class QuadBuilder extends RenderBuilder {
    constructor(){
        super();

        this._propertyDescriptors['texCoords'] = new ArrayProperty('texCoords', 'setTexCoords', false, 'vec4');
        this._propertyDescriptors['viewMode'] = new EnumProperty('viewMode', 'setViewMode', true, ViewMode, 'ViewMode');
        this._propertyDescriptors['size'] = new ArrayProperty('size', 'setSize', true, 'vec2');

        // renderResource
        const renderResourceProperties = [
            new EnumProperty('resourceType', undefined, undefined, ResourceType, 'ResourceType'),
            new PrimitiveTypeProperty('fileName', undefined, undefined, 'string'),
            new PrimitiveTypeProperty('absolutePath', undefined, undefined, 'boolean'),
            new PrimitiveTypeProperty('descriptor', undefined, undefined, 'number'),
            new PrimitiveTypeProperty('basePath', undefined, undefined, 'string'),
            new ArrayProperty('min', undefined, undefined, 'vec3'),
            new ArrayProperty('max', undefined, undefined, 'vec3')
        ];

        this._propertyDescriptors['renderResource'] = new ClassProperty('renderResource', 'setRenderResource', false, renderResourceProperties);

        this._addRenderResourceParamters();
    }

    _addRenderResourceParamters() {
        this._resourceParamter = {
            'Animation': {
                fileName: new PrimitiveTypeProperty('fileName', undefined, undefined, 'string'),
                absolutePath: new PrimitiveTypeProperty('absolutePath', undefined, undefined, 'boolean'),
                descriptor: new PrimitiveTypeProperty('descriptor', undefined, undefined, 'number'),
                basePath: new PrimitiveTypeProperty('basePath', undefined, undefined, 'string')
            },
            'AnimationBlendSetup': {
                fileName: new PrimitiveTypeProperty('fileName', undefined, undefined, 'string'),
                absolutePath: new PrimitiveTypeProperty('absolutePath', undefined, undefined, 'boolean'),
                descriptor: new PrimitiveTypeProperty('descriptor', undefined, undefined, 'number'),
                basePath: new PrimitiveTypeProperty('basePath', undefined, undefined, 'string')
            },
            'AnimationSet': {
                fileName: new PrimitiveTypeProperty('fileName', undefined, undefined, 'string'),
                absolutePath: new PrimitiveTypeProperty('absolutePath', undefined, undefined, 'boolean'),
                descriptor: new PrimitiveTypeProperty('descriptor', undefined, undefined, 'number'),
                basePath: new PrimitiveTypeProperty('basePath', undefined, undefined, 'string')
            },
            'Material': {
                fileName: new PrimitiveTypeProperty('fileName', undefined, undefined, 'string'),
                absolutePath: new PrimitiveTypeProperty('absolutePath', undefined, undefined, 'boolean'),
                localScopeOnly: new PrimitiveTypeProperty('localScopeOnly', undefined, undefined, 'boolean')
            },
            'Model': {
                fileName: new PrimitiveTypeProperty('fileName', undefined, undefined, 'string'),
                absolutePath: new PrimitiveTypeProperty('absolutePath', undefined, undefined, 'boolean'),
                descriptor: new PrimitiveTypeProperty('descriptor', undefined, undefined, 'number'),
                basePath: new PrimitiveTypeProperty('basePath', undefined, undefined, 'string'),
                importScale: new PrimitiveTypeProperty('importScale', undefined, undefined, 'number')
            },
            'Mtl': {
                fileName: new PrimitiveTypeProperty('fileName', undefined, undefined, 'string'),
                absolutePath: new PrimitiveTypeProperty('absolutePath', undefined, undefined, 'boolean')
            },
            'TexturePack': {
                absolutePath: new PrimitiveTypeProperty('absolutePath', undefined, undefined, 'boolean'),
                directory: new PrimitiveTypeProperty('directory', undefined, undefined, 'boolean'),
                params: new PrimitiveTypeProperty('params', undefined, undefined, 'boolean')
            },
            'Texture': {
                fileName: new PrimitiveTypeProperty('fileName', undefined, undefined, 'string'),
                absolutePath: new PrimitiveTypeProperty('absolutePath', undefined, undefined, 'boolean'),
                tex2dDesc: new PrimitiveTypeProperty('tex2dDesc', undefined, undefined, 'boolean'),
            }
        };
    }

    create(prism, properties) {
        this.throwIfInvalidPrism(prism);

        this.validate(undefined, undefined, properties);

        const renderResourceId = this._createRenderResource(properties.renderResource);

        const element = renderResourceId === undefined
            ? this._createNode(prism, 'createQuadNode')
            : this._createNode(prism, 'createQuadNode', renderResourceId);

        const unapplied = this.excludeProperties(properties, ['renderResourceId']);

        this.apply(element, undefined, unapplied);

        return element;
    }

    update(element, oldProperties, newProperties) {
        super.update(element, oldProperties, newProperties);

        this._validateSubTexture(newProperties);
        this._setSubTexture(element, newProperties);
    }

    validate(element, oldProperties, newProperties) {
        super.validate(element, oldProperties, newProperties);

        this._validateSubTexture(newProperties);
        this._validateRenderResource(newProperties);
    }

    _validateSubTexture(properties) {
        const subTexture = properties.subTexture;

        if (PropertyDescriptor.hasValue(subTexture)){
            if (  typeof subTexture !== 'string'
               && typeof subTexture !== 'number' ) {
                throw new TypeError(`subTexture parameter ${subTexture} should be string or number type`);
            }
        }
    }

    _validateRenderResource(properties) {


    }

    _createRenderResource(newProperties) {
    }

    _setSubTexture(element, properties) {
        const subTexture = properties.subTexture

        if (subTexture !== undefined) {
            this._callNodeAction(element, 'setSubTexture', subTexture);
        }
    }

    setTexCoords(element, oldProperties, newProperties) {
        const texCoords = newProperties.texCoords;
        texCoords.forEach( coordinate => PropertyDescriptor.throwIfNotArray(coordinate, 'vec2') );
        this._callNodeAction(element, 'setTexCoords', texCoords);
    }

    extraTypeScript() {
        return  '    subTexture?: string | number;\n';
    }
}