// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ui } from 'lumin';

import { PropertyDescriptor } from '../properties/property-descriptor.js';

export class DropdownListItemBuilder {
  create (prism, properties) {
    this.validate(undefined, undefined, properties);

    const content = this._getValue(properties.children);

    let id = properties.id;
    if (id === undefined) {
        id = 0;
    }

    let label = properties.label;
    if (label === undefined && content !== undefined && content.isText) {
        label = content.value;
    }

    const element = content === undefined || content.isText
      ? new ui.DropDownListItem(label, id)
      : new ui.DropDownListItem(label, content.value, id);

    this.update(element, undefined, properties);

    return element;
  }

  validate (element, oldProperties, newProperties) {
    const { id, label, children, selected } = newProperties;

    if (PropertyDescriptor.hasValue(id)) {
      PropertyDescriptor.throwIfNotTypeOf(id, 'number');
    }

    if (PropertyDescriptor.hasValue(label)) {
      PropertyDescriptor.throwIfNotTypeOf(label, 'string');
    }

    if (PropertyDescriptor.hasValue(children)) {
      this._validateChildren(children);
    }

    if (PropertyDescriptor.hasValue(selected)) {
      PropertyDescriptor.throwIfNotTypeOf(selected, 'boolean');
    }
  }

  apply (element, oldProperties, newProperties) {
    const selected = newProperties.selected;
    if (PropertyDescriptor.hasValue(selected)) {
        element.setSelected(selected);
    }
  }

  update (element, oldProperties, newProperties) {
    // this.throwIfNotInstanceOf(element, ui.UiDropDownListItem);
    this.validate(element, oldProperties, newProperties);
    this.apply(element, oldProperties, newProperties);
  }

  _getValue (children) {
    if (children === undefined) {
        return undefined;
    }

    if (Array.isArray(children)) {
      return children.every(child => typeof child === 'string' || typeof child === 'number')
        ? { isText: true, value: children.join(' ') }
        : { isText: false, value: children };
    } else {
      return typeof children === 'number'
        ? { isText: true, value: children.toString() }
        : { isText: true, value: children };
    }
  }

  _validateChildren (children) {
    if (children === undefined) {
        return;
    }

    const message = 'Invalid DropDownListItem content, it should be string, number or DropDownListItem';
    const predicate = (item) => typeof item === 'string' || typeof item === 'number';

    if (Array.isArray(children)) {
    //   if (children.some(child => !(child instanceof ui.DropDownListItem || predicate(child)))) {
    if (children.some(child => !(child.type.name === 'DropdownListItem' || predicate(child)))) {
        throw new TypeError(message);
      }
    } else {
      if (predicate(children)) {
        throw new TypeError(message);
      }
    }
  }

  extraTypeScript() {
    return  '    label?: string;\n' +
            '    id?: number;\n';
  }
}
