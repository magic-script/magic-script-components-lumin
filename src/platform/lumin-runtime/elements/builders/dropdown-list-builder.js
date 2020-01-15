// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui } from 'lumin';

import { UiNodeBuilder } from './ui-node-builder.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';
import { ArrayProperty } from '../properties/array-property.js';
import { ClassProperty } from '../properties/class-property.js';
import { ColorProperty } from '../properties/color-property.js';
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
    this._propertyDescriptors['textColor'] = new ColorProperty('textColor', 'setTextColor', true);
    this._propertyDescriptors['textSize'] = new PrimitiveTypeProperty('textSize', 'setTextSize', true, 'number');

    this._propertyDescriptors['iconSize'] = new ArrayProperty('iconSize', 'setIconSize', true, 'vec2');
    this._propertyDescriptors['iconColor'] = new ColorProperty('iconColor', 'setIconColor', true);
    this._propertyDescriptors['listMaxHeight'] = new PrimitiveTypeProperty('listMaxHeight', 'setListMaxHeight', true, 'number');
    this._propertyDescriptors['listTextSize'] = new PrimitiveTypeProperty('listTextSize', 'setListTextSize', true, 'number');
    this._propertyDescriptors['maxCharacterLimit'] = new PrimitiveTypeProperty('maxCharacterLimit', 'setMaxCharacterLimit', true, 'number');
    this._propertyDescriptors['multiSelect'] = new PrimitiveTypeProperty('multiSelect', 'setMultiSelectMode', true, 'boolean');
    this._propertyDescriptors['showList'] = new PrimitiveTypeProperty('showList', 'setShowList', false, 'boolean');

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

    // UiDropDownList.showList(boolean) needs to be executed after setting up the list.
    Object.defineProperty(element, 'showListItems', {
      enumerable: true,
      writable: true,
      configurable: false,
      value: false
    });

    this.update(element, undefined, properties);

    return element;
  }

  setSelected (element, oldProperties, newProperties) {
    const { id, selected } = newProperties;

    if (id !== undefined && selected !== undefined) {
      element.setSelected(id, selected);
    }
  }

  setShowList (element, oldProperties, newProperties) {
    element.showListItems = newProperties.showList;
    element.showList(element.showListItems);
  }

  validate(element, oldProperties, newProperties) {
    super.validate(element, oldProperties, newProperties);

    PropertyDescriptor.throwIfNotTypeOf(newProperties.text, 'string');
  }
}
