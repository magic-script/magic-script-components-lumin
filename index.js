import configuration from './src/configuration.js';
import { generateTypeScript } from './src/util/gen-type-script.js';

export default {
    _init() {
        this._nativeFactory = new configuration.nativeFactory(configuration.nativeMapping);
    },

    bootstrap(app) {
        this._init();

        this._app = this._nativeFactory.createApp(app);
    },

    getContainer(nodeName) {
        return this._app.getContainer(nodeName);
    },

    generateTypeScript
}

export { ControlTouchPadInputEventData } from './src/platform/lumin-runtime/types/event-data/control-touch-pad-input-event-data.js';
export { ControlPose3DofInputEventData } from './src/platform/lumin-runtime/types/event-data/control-pose-3dof-Input-event-data.js';
export { ControlPose6DofInputEventData } from './src/platform/lumin-runtime/types/event-data/control-pose-6dof-input-event-data.js';
export { EyeTrackingEventData } from './src/platform/lumin-runtime/types/event-data/eye-tracking-event-data.js';
export { GestureInputEventData } from './src/platform/lumin-runtime/types/event-data/gesture-input-event-data.js';
export { InputEventData } from './src/platform/lumin-runtime/types/event-data/input-event-data.js';
export { KeyInputEventData } from './src/platform/lumin-runtime/types/event-data/key-input-event-data.js';
export { RayCastEventData } from './src/platform/lumin-runtime/types/event-data/ray-cast-event-data.js';
export { SelectionEventData } from './src/platform/lumin-runtime/types/event-data/selection-event-data.js';
export { UiEventData } from './src/platform/lumin-runtime/types/event-data/ui-event-data.js';
export { VideoEventData } from './src/platform/lumin-runtime/types/event-data/video-event-data.js';

export { DropDownListEventData } from './src/platform/lumin-runtime/types/event-data/drop-down-list-event-data.js';
export { PrismEventData } from './src/platform/lumin-runtime/types/event-data/prism-event-data.js';
export { ProgressBarEventData } from './src/platform/lumin-runtime/types/event-data/progress-bar-event-data.js';
export { ScrollBarEventData } from './src/platform/lumin-runtime/types/event-data/scroll-bar-event-data.js';
export { ScrollViewEventData } from './src/platform/lumin-runtime/types/event-data/scroll-view-event-data.js';
export { SliderEventData } from './src/platform/lumin-runtime/types/event-data/slider-event-data';
export { TextEditEventData } from './src/platform/lumin-runtime/types/event-data/text-edit-event-data.js';
export { ToggleEventData } from './src/platform/lumin-runtime/types/event-data/toggle-event-data.js';
