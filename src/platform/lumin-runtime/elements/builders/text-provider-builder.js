// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { UiNodeBuilder } from './ui-node-builder.js';
import { PrimitiveTypeProperty } from '../properties/primitive-type-property.js';
import { ChildrenProperty } from '../properties/children-property.js';
import { TextChildrenProperty } from '../properties/text-children-property.js';

export class TextProviderBuilder extends UiNodeBuilder {
  constructor () {
    super();

    this._propertyDescriptors['children'] = new ChildrenProperty('children', 'setChildrenAsText', false);
    this._propertyDescriptors['text'] = new PrimitiveTypeProperty('text', 'setText', true, 'string');
  }

  setChildrenAsText (element, oldProperties, newProperties) {
    // Property 'text' has priority over 'children' property
    if (newProperties.text !== undefined) {
      return;
    }

    const children = newProperties.children;
    if (TextChildrenProperty.isValid(children)) {
      this._callNodeAction(element, 'setText', this._getText(children));
    }
  }

  _getText (children) {
    let text;

    if (Array.isArray(children)) {
      text = children.join('');
    } else if (typeof children === 'number') {
      text = children.toString();
    } else {
      text = children;
    }

    return text;
  }
}
