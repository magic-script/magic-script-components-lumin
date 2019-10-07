// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui } from 'lumin';

import { UiNodeBuilder } from './ui-node-builder.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';
import { ArrayProperty } from '../properties/array-property.js';
import { ClassProperty } from '../properties/class-property.js';
import { PropertyDescriptor } from '../properties/property-descriptor.js';

export class DropdownListBuilder extends UiNodeBuilder {
  constructor () {
    super();

    // ButtonModel
    // List

    // listFont - expects Id
    // const listFontProperties = [
    //     new PrimitiveTypeProperty('fontFile', undefined, undefined, 'string'),
    //     new PrimitiveTypeProperty('absolutePath', undefined, undefined, 'boolean'),
    //     new PrimitiveTypeProperty('tileSize', undefined, undefined, 'number'),
    //     new PrimitiveTypeProperty('minAlpha', undefined, undefined, 'number'),
    //     new EnumProperty('advanceDir', undefined, undefined, Orientation, 'Orientation'),
    //     new EnumProperty('flowDir', undefined, undefined, Orientation, 'Orientation'),
    //     new EnumProperty('quality', undefined, undefined, Orientation, 'Orientation')
    // ];
    // this._propertyDescriptors['listFont'] = new ClassProperty('listFont', 'setListFont', false, listFontProperties);

    // TextProviderBuilder
    this._propertyDescriptors['text'] = new PrimitiveTypeProperty('text', 'setText', true, 'string');

    // TextContainerBuilder
    this._propertyDescriptors['textColor'] = new ArrayProperty('textColor', 'setTextColor', true, 'vec4');
    this._propertyDescriptors['textSize'] = new PrimitiveTypeProperty('textSize', 'setTextSize', true, 'number');

    this._propertyDescriptors['iconSize'] = new PrimitiveTypeProperty('iconSize', 'setIconSize', true, 'number');
    this._propertyDescriptors['iconColor'] = new ArrayProperty('iconColor', 'setIconColor', true, 'vec4');
    this._propertyDescriptors['listMaxHeight'] = new PrimitiveTypeProperty('listMaxHeight', 'setListMaxHeight', true, 'number');
    this._propertyDescriptors['listTextSize'] = new PrimitiveTypeProperty('listTextSize', 'setListTextSize', true, 'number');
    this._propertyDescriptors['maxCharacterLimit'] = new PrimitiveTypeProperty('maxCharacterLimit', 'setMaxCharacterLimit', true, 'number');
    this._propertyDescriptors['multiSelect'] = new PrimitiveTypeProperty('multiSelect', 'setMultiSelect', true, 'boolean');
    this._propertyDescriptors['showList'] = new PrimitiveTypeProperty('showList', 'showList', true, 'boolean');

    // Selected
    const selectedProperties = [
      new PrimitiveTypeProperty('id', undefined, undefined, 'number'),
      new PrimitiveTypeProperty('selected', undefined, undefined, 'boolean')
    ];

    this._propertyDescriptors['selected'] = new ClassProperty('selected', 'setSelected', false, selectedProperties);
  }

  create (prism, properties) {
    this.throwIfInvalidPrism(prism);

    this.validate(undefined, undefined, properties);

    const element = ui.UiDropDownList.Create(prism, properties.text);

    this.update(element, undefined, properties);

    return element;
  }

  setSelected (element, oldProperties, newProperties) {
    const { id, selected } = newProperties;

    if (id !== undefined && selected !== undefined) {
      element.setSelected(id, selected);
    }
  }

  validate(element, oldProperties, newProperties) {
    super.validate(element, oldProperties, newProperties);

    PropertyDescriptor.throwIfNotTypeOf(newProperties.text, 'string');
  }
}
