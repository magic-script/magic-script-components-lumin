// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { ImmersiveApp, ModelNode, TransformNode, ui } from 'lumin';

import { setPath } from 'magic-script-polyfills/src/writable-path.js';

import { NativeFactory } from '../../core/native-factory.js';
import { MxsLandscapeApp } from './mxs-landscape-app.js';
import { MxsPrismController } from './controllers/mxs-prism-controller.js';

import { UiNodeEvents } from './types/ui-node-events.js';
import { ControllerEvents } from './types/controller-events.js';

import executor from './utilities/executor.js';

export class PlatformFactory extends NativeFactory {
  constructor (componentMapping) {
    super(componentMapping);

    // { type, builder }
    this.elementBuilders = {};
    this.controllerBuilders = {};

    // Storing the app in order to get access to nodes prism
    this._app;
  }

  isController (element) {
    return element instanceof MxsPrismController;
  }

  setComponentEvents (element, properties, controller) {
    const eventHandlers = Object.keys(properties)
      .filter(key => key.length > 2 && key.startsWith('on'))
      .map(key => ({ name: key, handler: properties[key] }));

    for (const pair of eventHandlers) {
      let eventDescriptor = UiNodeEvents[pair.name];

      if (eventDescriptor !== undefined) {
        if (typeof pair.handler === 'function') {
          try {
            element[eventDescriptor.subName]((eventData) => pair.handler(new eventDescriptor.dataType(eventData)));
          } catch (error) {
            throw new Error(`Tyring to subscribe handler ${pair.name} to ${eventDescriptor.subName} failed, error: ${error.message}`);
          }
        } else {
          throw new TypeError(`The event handler for ${pair.name} is not a function`);
        }
      } else {
        eventDescriptor = ControllerEvents[pair.name];
        if (eventDescriptor !== undefined) {
          if (typeof pair.handler === 'function') {
            controller.addListener(element.getNodeId(), eventDescriptor.eventName, pair.handler);
          } else {
            throw new TypeError(`The event handler for ${pair.name} is not a function`);
          }
        } else {
          throw new TypeError(`Event ${pair.name} is not recognized event`);
        }
      }
    }
  }

  createElement (name, container, ...args) {
    if (typeof name !== 'string') {
      throw new Error('PlatformFactory.createElement expects "name" to be string');
    }

    if (name === 'scene') {
      return this._createScene(name, container, ...args);
    }

    if (name === 'prism') {
      return this._createPrism(name, container, ...args);
    }

    let element;
    if (this._mapping.elements[name] !== undefined) {
      element = this._createElement(name, container, ...args);
      Object.defineProperty(element, 'childController', {
        enumerable: true,
        writable: true,
        configurable: false,
        value: undefined
      });
    } else if (this._mapping.controllers[name] !== undefined) {
      element = this._createController(name, container, ...args);
    } else {
      throw new Error(`Unknown tag: ${name}`);
    }

    Object.defineProperty(element, 'addChild$Universal', {
      enumerable: true,
      writable: false,
      configurable: false,
      value: (child) => {
        if (this.isController(element)) {
          if (this.isController(child)) {
            executor.callNativeAction(element, 'addChildController', child);
          } else {
            executor.callNativeAction(element, 'addChild', child);
            if (child.childController !== undefined) {
              executor.callNativeAction(element, 'addChildController', child.childController);
            }
          }
        } else {
          if (this.isController(child)) {
            element.childController = child;
            const handler = () => {
              executor.callNativeAction(element, 'addChild', executor.callNativeFunction(child, 'getRoot'));
              executor.callNativeAction(child, 'removeListener', 'onAttachPrism', handler);
            };

            executor.callNativeAction(child, 'addListener', 'onAttachPrism', handler);
          } else {
            element.childController = child.childController;
            this._addChildNodeToParentNode(element, child);
          }
        }
      }
    });

    return element;
  }

  _createElement (name, container, ...args) {
    if (this.elementBuilders[name] === undefined) {
      this.elementBuilders[name] = this._mapping.elements[name]();
    }

    // Set local path for caching fetch-ed files
    setPath(this._app.getWritablePath());

    const prism = container.controller.getPrism();
    const element = this.elementBuilders[name].create(prism, ...args);

    // TODO: Move setComponentEvents to the builders !!!
    this.setComponentEvents(element, args[0], container.controller); // args = [props]

    return element;
  }

  _createController (name, container, ...args) {
    if (this.controllerBuilders[name] === undefined) {
      this.controllerBuilders[name] = this._mapping.controllers[name]();
    }

    return this.controllerBuilders[name].create(...args);
  }

  _createPrism(name, container, ...args) {
    if (this.elementBuilders[name] === undefined) {
      this.elementBuilders[name] = this._mapping.elements[name]();
    }

    return this.elementBuilders[name].create(this._app, ...args);
  }

  _createScene(name, container, ...args) {
    if (this.elementBuilders[name] === undefined) {
      this.elementBuilders[name] = this._mapping.elements[name]();
    }

    return this.elementBuilders[name].create();
  }

  updateElement (name, ...args) {
    if (typeof name !== 'string') {
      throw new Error('PlatformFactory.updateElement expects "name" to be string');
    }

    const prism = typeof args[0].getPrismId === 'function'
      ? this._app.getPrism(args[0].getPrismId())
      : undefined;

    if (this._mapping.elements[name] !== undefined) {
      this.elementBuilders[name].update(...args, prism);
    } else if (this._mapping.controllers[name] !== undefined) {
      this.controllerBuilders[name].update(...args, prism);
    } else {
      throw new Error(`Unknown tag: ${name}`);
    }
  }

  // TODO: Should be replaced by Proxy.addChild(parent, child)
  // after replacing builders with proxies
  _addChildNodeToParentNode (parent, child) {
    if (parent instanceof ui.UiScrollView) {
      if (child instanceof ui.UiScrollBar) {
        executor.callNativeAction(parent, 'setScrollBar', child.Orientation, child);
      }

      if (child instanceof TransformNode) {
        if (child.offset !== undefined) {
          executor.callNativeAction(parent, 'setScrollContent', child, child.offset);
        } else {
          executor.callNativeAction(parent, 'setScrollContent', child);
        }
      }
    } else if (parent instanceof ui.UiListView) {
      if (child instanceof ui.UiScrollBar) {
        executor.callNativeAction(parent, 'setScrollBar', child);
      }
      if (child instanceof ui.UiListViewItem) {
        const { Padding, ItemAlignment } = child;
        if (Padding !== undefined) {
          if (ItemAlignment !== undefined) {
            executor.callNativeAction(parent, 'addItem', child, Padding, ItemAlignment);
          } else {
            executor.callNativeAction(parent, 'addItem', child, Padding);
          }
        } else {
          executor.callNativeAction(parent, 'addItem', child);
        }
      }
    } else if (parent instanceof ui.UiLinearLayout || parent instanceof ui.UiGridLayout) {
      const { padding, itemAlignment } = child;
      if (padding !== undefined) {
        if (itemAlignment !== undefined) {
          executor.callNativeAction(parent, 'addItem', child, padding, itemAlignment);
        } else {
          executor.callNativeAction(parent, 'addItem', child, padding);
          parent.mxsSetItemAlignment(parent.getItemCount() - 1);
        }
      } else {
        executor.callNativeAction(parent, 'addItem', child);

        // Should set the alignment and padding after adding items completes !
        const index = executor.callNativeFunction(parent, 'getItemCount') - 1;
        parent.mxsSetItemAlignment(index);
        parent.mxsSetItemPadding(index);
      }
    } else if (parent instanceof ui.UiSlider) {
      if (child instanceof TransformNode) {
        if (child.offset !== undefined) {
          executor.callNativeAction(parent, 'setSliderModel', child, child.offset);
        } else {
          executor.callNativeAction(parent, 'setSliderModel', child);
        }
      }
    } else if (parent instanceof ui.UiRectLayout) {
      if (child instanceof TransformNode) {
        executor.callNativeAction(parent, 'setContent', child);
      }
    } else if (parent instanceof ui.UiDropDownList) {
      if (child instanceof TransformNode) {
        if (child.offset !== undefined) {
          executor.callNativeAction(parent, 'setButtonModel', child, child.offset);
        } else {
          executor.callNativeAction(parent, 'setButtonModel', child);
        }
      }
      if (child instanceof ui.DropDownListItem) {
        const list = [...parent.getList()];
        list.push(child);
        executor.callNativeAction(parent, 'setList', list);
        if (parent.showListItems) {
          executor.callNativeAction(parent, 'showList', parent.showListItems);
        }
      }
      // ListFont: Font2dResource(fontDesc, fontFile, a_absolutePath)
      // fontDesc = Font2dDesc(advanceDir, flowDir, tileSize, quality, minAlpha)
    } else if (parent instanceof ui.UiDialog) {
      if (child instanceof TransformNode) {
        executor.callNativeAction(parent, 'setDialogContent', child);
        executor.callNativeAction(parent, 'init');
      }
    } else if (parent instanceof ui.UiToggle) {
      if (child instanceof TransformNode) {
        if (child.offset !== undefined) {
          executor.callNativeAction(parent, 'setToggleModel', child, child.offset);
        } else {
          executor.callNativeAction(parent, 'setToggleModel', child);
        }
      }
    } else if (parent instanceof ui.UiPanel) {
      if (child instanceof ui.UiPanel) {
        if (child.side !== undefined) {
          executor.callNativeAction(parent, 'setEdgeTransition', child.side, child);
        }
      } else {
        executor.callNativeAction(parent, 'addChild', child);
      }
    } else if (parent instanceof ui.UiPortalIcon) {
      if (child instanceof ModelNode) {
        executor.callNativeAction(parent, 'setIconModel', child, child.offset);
      } else if (child instanceof TransformNode) {
        executor.callNativeAction(parent, 'setBackgroundModel', child, child.offset);
      }
    } else if (parent instanceof ui.UiButton) {
      if (child instanceof TransformNode) {
        if (child.offset !== undefined) {
          executor.callNativeAction(parent, 'setButtonModel', child, child.offset);
        } else {
          executor.callNativeAction(parent, 'setButtonModel', child);
        }
      }
    } else if (parent instanceof ui.UiPageView) {
      if (child instanceof TransformNode) {
        const { padding, itemAlignment } = child;
        if (padding !== undefined) {
          if (itemAlignment !== undefined) {
            executor.callNativeAction(parent, 'addPage', child, padding, itemAlignment);
          } else {
            executor.callNativeAction(parent, 'addPage', child, padding);
          }
        } else {
          executor.callNativeAction(parent, 'addPage', child);
        }
      }
    } else {
      executor.callNativeAction(parent, 'addChild', child);
    }
  }

  addChildElement (parent, child) {
    if (typeof child === 'string') {
      executor.callNativeAction(parent, 'setText', child);
    } else if (typeof child === 'number') {
      executor.callNativeAction(parent, 'setText', child.toString());
    } else {
      parent.addChild$Universal(child);
    }
  }

  _removeChildNodeFromParentNode (parent, child) {
    if (parent instanceof ui.UiScrollView) {
      // ScrollBar: child is <UiScrollBar, orientation>
      if (child instanceof ui.UiScrollBar) {
        executor.callNativeAction(parent, 'setScrollBar', child.Orientation, null);
      }
      // ScrollContent: child is <TransformNode, vec3>
    } else if (parent instanceof ui.UiListView) {
      // ScrollBar: child is UiSCrollBar
      // ListViewItem: use addItem instead of addChild
      if (child instanceof ui.UiListViewItem) {
        const itemCount = executor.callNativeFunction(parent, `getItemCount`);

        for (let index = 0; index < itemCount; index++) {
          const item = executor.callNativeFunction(parent, 'getItem', index);
          const itemId = executor.callNativeFunction(item, 'getNodeId');
          const childId = executor.callNativeFunction(child, 'getNodeId');
          if ( itemId === childId ) {
            const orphan = executor.callNativeFunction(parent, 'removeItem', index);
            const prism = this._app.getPrism(orphan.getPrismId());
            executor.callNativeAction(prism, 'deleteNode', orphan);
          }
        }
      }
    } else if (parent instanceof ui.UiSlider) {
      if (child instanceof TransformNode) {
        // LRT is not checking for nullptr yet !
        // executor.callNativeAction(parent, 'setSliderModel', null);
      }
    } else if (parent instanceof ui.UiRectLayout) {
      if (child instanceof TransformNode) {
        // LRT is not checking for nullptr yet !
        // executor.callNativeAction(parent, 'setContent', child);
      }
    } else if (parent instanceof ui.UiLinearLayout || parent instanceof ui.UiGridLayout) {
      if (child instanceof TransformNode) {
        executor.callNativeFunction(parent, 'removeItem', child);
        const prism = this._app.getPrism(child.getPrismId());
        executor.callNativeAction(prism, 'deleteNode', child);
      }
    } else if (parent instanceof ui.UiDropDownList) {
      // ButtonModel: child is <Node, vec3>
      // List: child is array of DropDownListItem(s)
      // ListFont: Font2dResource(fontDesc, fontFile, a_absolutePath)
      // fontDesc = Font2dDesc(advanceDir, flowDir, tileSize, quality, minAlpha)
    } else if (parent instanceof ui.UiDialog) {
      if (child instanceof TransformNode) {
        // LRT is not checking for nullptr yet !
        // executor.callNativeAction(parent, 'setDialogContent', null);
        // executor.callNativeAction(parent, 'init');
      }
    } else if (parent instanceof ui.UiToggle) {
      if (child instanceof TransformNode) {
        // LRT is not checking for nullptr yet !
        // executor.callNativeAction(parent, 'setToggleModel', null);
      }
    } else if (parent instanceof ui.UiPanel) {
      if (child instanceof ui.UiPanel) {
        if (child.side !== undefined) {
          // LRT is not checking for nullptr yet !
          // executor.callNativeAction(parent, 'setEdgeTransition', child.side, null);
        }
      } else {
        executor.callNativeAction(parent, 'removeChild', child);
      }
    } else if (parent instanceof ui.UiPortalIcon) {
      if (child instanceof ModelNode) {
        // LRT is not checking for nullptr yet !
        // executor.callNativeAction(parent, 'setIconModel', null, child.offset);
      } else if (child instanceof TransformNode) {
        // LRT is not checking for nullptr yet !
        // executor.callNativeAction(parent, 'setBackgroundModel', null, child.offset);
      }
    } else if (parent instanceof ui.UiPageView) {
      if (child instanceof TransformNode) {
        executor.callNativeAction(parent, 'removePage', child);
      }
    } else {
      executor.callNativeAction(parent, 'removeChild', child);
      const prism = this._app.getPrism(child.getPrismId());
      executor.callNativeAction(prism, 'deleteNode', child);
    }
  }

  removeChildElement (parent, child) {
    if (typeof child === 'string' || typeof child === 'number') {
      parent.setText('');
    } else {
      if (this.isController(child)) {
        if (!this.isController(parent)) {
          throw new Error('Removing controller from non-controller parent');
        }
        executor.callNativeAction(parent, 'removeChildController', child);
      } else if (this.isController(parent)) {
        executor.callNativeAction(parent.getRoot(), 'removeChild', child);
        executor.callNativeAction(parent.getPrism(), 'deleteNode', child);
      } else {
        this._removeChildNodeFromParentNode(parent, child);
      }
    }
  }

  appendChildToContainer (container, child) {
    if (this.isController(child)) {
      executor.callNativeAction(container.controller, 'addChildController', child);
      executor.callNativeAction(container.parent, 'addChild', child.getRoot());
    } else {
      executor.callNativeAction(container.controller.getRoot(), 'addChild', child);
    }
  }

  removeChildFromContainer (container, child) {
    if (this.isController(child)) {
      executor.callNativeAction(container.controller, 'removeChildController', child);
    } else {
      executor.callNativeAction(container.controller.getRoot(), 'removeChild', child);
      const prism = this._app.getPrism(child.getPrismId());
      executor.callNativeAction(prism, 'deleteNode', child);
    }
  }

  createApp (appComponent) {
    if (typeof appComponent !== 'object') {
      throw new TypeError('Invalid argument: PlatformFactory.createContainer expects "component" to be an object');
    }

    const appType = appComponent.props.type;

    let app;

    if (appType === 'landscape') {
      app = new MxsLandscapeApp(appComponent, 0.5);
    } else if (appType === 'immersive') {
      app = new ImmersiveApp(0.5);
      app.type = 'immersiveApp';
    } else {
      throw new TypeError(`Invalid argument: Unknown app type: ${appType}`);
    }

    // Saving the app so the factory can get access to the nodes prism
    this._app = app;
    return app;
  }
}
