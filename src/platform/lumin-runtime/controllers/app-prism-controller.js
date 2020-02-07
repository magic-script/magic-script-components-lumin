// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import log, { MessageSeverity } from '../../../util/logger.js';
import { PrismController } from 'lumin';
import { ReactMagicScript } from '../../../react-magic-script/react-magic-script.js';

import { ControlPose3DofInputEventData } from '../types/event-data/control-pose-3dof-Input-event-data.js';
import { ControlPose6DofInputEventData } from '../types/event-data/control-pose-6dof-input-event-data.js';
import { ControlTouchPadInputEventData } from '../types/event-data/control-touch-pad-input-event-data.js';
import { EyeTrackingEventData } from '../types/event-data/eye-tracking-event-data.js';
import { GestureInputEventData } from '../types/event-data/gesture-input-event-data.js';
import { InputEventData } from '../types/event-data/input-event-data.js';
import { KeyInputEventData } from '../types/event-data/key-input-event-data.js';
import { RayCastEventData } from '../types/event-data/ray-cast-event-data.js';
import { SelectionEventData } from '../types/event-data/selection-event-data.js';
import { UiEventData } from '../types/event-data/ui-event-data.js';
import { VideoEventData } from '../types/event-data/video-event-data.js';

export class AppPrismController extends PrismController {
  constructor (prismProps) {
    super();
    this._prismProps = prismProps;
    this._containers = new WeakMap();

    this._eventHandlers = {
      onEvent: [],
      onUpdate: []
    };

    this._eventTypes = [
      ControlPose3DofInputEventData,
      ControlPose6DofInputEventData,
      ControlTouchPadInputEventData,
      EyeTrackingEventData,
      GestureInputEventData,
      InputEventData,
      KeyInputEventData,
      RayCastEventData,
      SelectionEventData,
      UiEventData,
      VideoEventData
    ];

    this._eventTypes.forEach(eventDataConstructor => {
      this._eventHandlers[this._getEventTypeName(eventDataConstructor.name)] = [];
    });
  }

  getRootNodeName (componentName) {
    return componentName === undefined
      ? '__root_prism_controller_'
      : `__root_prism_controller_${componentName.trim().replace(' ', '_')}`;
  }

  findChild (nodeName) {
    const root = this.getRoot();
    return root.getName() === nodeName ? root : root.findChild(nodeName);
  }

  getContainer (nodeName) {
    const parent = nodeName === undefined
      ? this.getRoot()
      : this.findChild(nodeName);

    let container = this._containers[parent];

    if (container === undefined) {
      container = { parent: parent, controller: this };
      this._containers[parent] = container;
    }

    return container;
  }

  onAttachPrism (prism) {
    const rootNodeName = this.getRootNodeName(this._prismProps.name);
    this.getRoot().setName(rootNodeName);

    try {
      ReactMagicScript.render(this._prismProps.children, this.getContainer());
    } catch (error) {
      log(`${error.name} - ${error.message}\n${error.stack}`, MessageSeverity.exception);
      throw error;
    }
  }

  onDetachPrism (prism) {
    this.deleteSceneGraph();
  }

  addListener (nodeId, event, eventHandlerCallback) {
    const handlers = this._eventHandlers[event];
    if (handlers !== undefined) {
      handlers.push({ id: nodeId, handler: eventHandlerCallback });
    } else {
      throw TypeError(`Event ${event} is not supported by the controller`);
    }
  }

  removeListener (nodeId, event, eventHandlerCallback) {
    const handlers = this._eventHandlers[event];
    if (handlers !== undefined) {
      const index = handlers.findIndex(subscriber => subscriber.id === nodeId && subscriber.handler === eventHandlerCallback);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    } else {
      throw TypeError(`Event ${event} is not supported by the controller`);
    }
  }

  onEvent (event) {
    const eventData = this._getEventDataByEventType(event);

    let handlers = this._eventHandlers[this._getEventTypeName(eventData.constructor.name)];

    if (!Array.isArray(handlers)) {
      handlers = this._eventHandlers.onEvent;
    }

    let eventIsConsumed = false;

    for (let subscriber of handlers) {
      if (eventIsConsumed === true) {
        break;
      }

      if (typeof event.getAffectedNodeId === 'function') {
        if (subscriber.id === event.getAffectedNodeId()) {
          eventIsConsumed = subscriber.handler(eventData);
        }
      } else {
        eventIsConsumed = subscriber.handler(eventData);
      }
    }

    return eventIsConsumed;
  }

  onUpdate (delta) {
    this._eventHandlers.onUpdate
      .forEach(subscriber => subscriber.handler(delta));
  }

  _getEventDataByEventType (eventData) {
    const eventConstructor = this._eventTypes
      .find(eventType => eventType.isSupported(eventData));

    return eventConstructor === undefined
      ? eventData
      : new eventConstructor(eventData);
  }

  _getEventTypeName (eventDataTypeName) {
    // Remove suffix 'Data' from the event data type name
    return `on${eventDataTypeName.slice(0, -4)}`;
  }
}
