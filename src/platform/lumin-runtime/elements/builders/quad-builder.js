// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

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

export class QuadBuilder extends RenderBuilder {
    constructor(){
        super();

        this._propertyDescriptors['texCoords'] = new ArrayProperty('texCoords', 'setTexCoords', false, 'vec4');
        this._propertyDescriptors['viewMode'] = new EnumProperty('viewMode', 'setViewMode', true, ViewMode, 'ViewMode');
        this._propertyDescriptors['size'] = new ArrayProperty('size', 'setSize', true, 'vec2');

        this._defineRenderResourceParamters();
    }

    _defineRenderResourceParamters() {
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
        ]

        const textureTex2dDescProperties = [
            new PrimitiveTypeProperty('allowMipmaps', undefined, undefined, 'boolean'),
            new PrimitiveTypeProperty('numMipmaps', undefined, undefined, 'number'),
            new PrimitiveTypeProperty('upscaleToRGB', undefined, undefined, 'boolean'),
            new ClassProperty('params', undefined, undefined, desc2dParamsProperties)
        ];

        const animationProperties = [
            { name: 'fileName',     property: new PrimitiveTypeProperty('fileName', undefined, undefined, 'string'),      optional: false },
            { name: 'absolutePath', property: new PrimitiveTypeProperty('absolutePath', undefined, undefined, 'boolean'), optional: true  },
            { name: 'descriptor',   property: new PrimitiveTypeProperty('descriptor', undefined, undefined, 'number'),    optional: true  },
            { name: 'basePath',     property: new PrimitiveTypeProperty('basePath', undefined, undefined, 'string'),      optional: true  }
        ];

        this._renderResourceParamters = {
            'Animation': animationProperties,
            'AnimationBlendSetup': animationProperties,
            'AnimationSet': animationProperties,
            'Material': [
                { name: 'fileName',       property: new PrimitiveTypeProperty('fileName', undefined, undefined, 'string'),        optional: false },
                { name: 'absolutePath',   property: new PrimitiveTypeProperty('absolutePath', undefined, undefined, 'boolean'),   optional: true  },
                { name: 'localScopeOnly', property: new PrimitiveTypeProperty('localScopeOnly', undefined, undefined, 'boolean'), optional: true  }
            ],
            'Model': [
                ...animationProperties,
                { name: 'importScale',  property: new PrimitiveTypeProperty('importScale', undefined, undefined, 'number'),   optional: false  }
            ],
            'Mtl': [
                { name: 'fileName',     property: new PrimitiveTypeProperty('fileName', undefined, undefined, 'string'),      optional: false },
                { name: 'absolutePath', property: new PrimitiveTypeProperty('absolutePath', undefined, undefined, 'boolean'), optional: true  }
            ],
            'TexturePack': [
                { name: 'absolutePath', property: new PrimitiveTypeProperty('absolutePath', undefined, undefined, 'boolean'),     optional: true  },
                { name: 'directory',    property: new PrimitiveTypeProperty('directory', undefined, undefined, 'boolean'),        optional: false },
                { name: 'params',       property: new ClassProperty('params', undefined, undefined, texturePackParamsProperties), optional: false }
            ],
            'Texture': [
                { name: 'fileName',     property: new PrimitiveTypeProperty('fileName', undefined, undefined, 'string'),            optional: false },
                { name: 'absolutePath', property: new PrimitiveTypeProperty('absolutePath', undefined, undefined, 'boolean'),       optional: true  },
                { name: 'descriptor',   property: new PrimitiveTypeProperty('descriptor', undefined, undefined, 'number'),          optional: true  },
                { name: 'tex2dDesc',    property: new ClassProperty('tex2dDesc', undefined, undefined, textureTex2dDescProperties), optional: false }
            ]
        };

        this._renderResourceCreators = {
            'Animation': () => {},
            'AnimationBlendSetup': () => {},
            'AnimationSet': () => {},
            'Material': () => {},
            'Model': () => {},
            'Mtl': () => {},
            'TexturePack': () => {},
            'Texture': () => {}
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

    _validateResourceParameters(configuration, value) {
        if (value === undefined && !configuration.optional) {
            throw new Error(`Quad parameter renderResource[${configuration.name}] is required`);
        }

        configuration.property.validate(value);
    }

    _validateRenderResource(properties) {
        if (properties.renderResource === undefined) {
            throw new Error('Quad parameter renderResource is undefined');
        }

        const resourceTypeProperty = new EnumProperty('resourceType', undefined, undefined, ResourceType, 'ResourceType');
        resourceTypeProperty.validate(properties.renderResource.resourceType);

        this._renderResourceParamters[properties.renderResource.resourceType]
            .forEach(parameter => this._validateResourceParameters(parameter, properties.renderResource[parameter.name]));
    }

    _createRenderResource(value) {
        return this._renderResourceCreators[value.resourceType](value);
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