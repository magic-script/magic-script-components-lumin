// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { CircleConfirmationEventData } from './event-data/circle-confirmation-event-data.js';
import { ColorPickerEventData } from './event-data/color-picker-event-data.js';
import { DatePickerEventData } from './event-data/date-picker-event-data.js';
import { DropDownListEventData } from './event-data/drop-down-list-event-data.js';
import { ProgressBarEventData } from './event-data/progress-bar-event-data.js';
import { TextEditEventData } from './event-data/text-edit-event-data.js';
import { TimePickerEventData } from './event-data/time-picker-event-data.js';
import { ToggleEventData } from './event-data/toggle-event-data.js';
import { ScrollViewEventData } from './event-data/scroll-view-event-data.js';
import { SliderEventData } from './event-data/slider-event-data.js';
import { UiEventData } from './event-data/ui-event-data.js';

/**
 * @exports UiNodeEvents
 * @description Represents Magic-Script - Lumin Runtime event mapping for UiNode.
 * @param {string} key - the Magic-Script event name
 * @param {string} value - the Lumin Runtime event name
 */

// TODO: Move events to the component builders
export const UiNodeEvents = {
    // UiNode
    'onActivate': { subName: 'onActivateSub', dataType: UiEventData },
    'onClick': { subName: 'onActivateSub', dataType: UiEventData },
    'onPress': { subName: 'onPressedSub', dataType: UiEventData },
    'onLongPress': { subName: 'onLongPressSub', dataType: UiEventData },
    'onRelease': { subName: 'onReleasedSub', dataType: UiEventData },
    'onHoverEnter': { subName: 'onHoverEnterSub', dataType: UiEventData },
    'onHoverExit': { subName: 'onHoverExitSub', dataType: UiEventData },
    'onHoverMove': { subName: 'onHoverMoveSub', dataType: UiEventData },
    'onEnabled': { subName: 'onEnabledSub', dataType: UiEventData },
    'onDisabled': { subName: 'onDisabledSub', dataType: UiEventData },
    'onFocusGained': { subName: 'onFocusGainedSub', dataType: UiEventData },
    'onFocusLost': { subName: 'onFocusLostSub', dataType: UiEventData },
    'onFocusInput': { subName: 'onFocusInputSub', dataType: UiEventData },
    'onUpdate': { subName: 'onUpdateSub', dataType: UiEventData },
    'onDelete': { subName: 'onDeletedSub', dataType: UiEventData },
    // TextEdit events
    'onCharacterEnter': { subName: 'onCharacterEnteredSub', dataType: TextEditEventData },
    'onKeyboardEvent': { subName: 'onKeyboardEventSub', dataType: TextEditEventData },
    'onTextChanged': { subName: 'onTextChangedSub', dataType: TextEditEventData },
    // UiSlider
    'onSliderChanged': { subName: 'onSliderChangedSub', dataType: SliderEventData },
    // UiListView
    // UiScrollView
    'onScrollChanged': { subName: 'onScrollChangedSub', dataType: ScrollViewEventData },
    // UiProgressBar
    'onProgressBarChanged': { subName: 'onProgressBarChangedSub', dataType: ProgressBarEventData },
    // UiDropDownList
    'onListVisibilityChanged': { subName: 'onListVisibilityChangedSub', dataType: DropDownListEventData },
    'onSelectionChanged': { subName: 'onSelectionChangedSub', dataType: DropDownListEventData },
    // UiToggle
    'onToggleChanged': { subName: 'onToggleChangedSub', dataType: ToggleEventData },
    // UiPanel
    'onCursorEdge': { subName: 'onCursorEdgeSub', dataType: UiEventData },
    'onCursorOffEdge': { subName: 'onCursorOffEdgeSub', dataType: UiEventData },
    'onPanelEnter': { subName: 'onPanelEnterSub', dataType: UiEventData },
    'onPanelExit': { subName: 'onPanelExitSub', dataType: UiEventData },
    // UiDialog
    'onDialogCanceled': { subName: 'onCancelSub', dataType: UiEventData },
    'onDialogConfirmed': { subName: 'onConfirmSub', dataType: UiEventData },
    'onDialogTimeExpired': { subName: 'onTimeExpiredSub', dataType: UiEventData },
    // UiColorPicker
    'onColorCanceled': { subName: 'onCancelSub', dataType: ColorPickerEventData },
    'onColorChanged': { subName: 'onColorChangedSub', dataType: ColorPickerEventData },
    'onColorConfirmed': { subName: 'onConfirmSub', dataType: ColorPickerEventData },
    // UiTimePicker
    'onTimeChanged': { subName: 'onTimeChangedSub', dataType: TimePickerEventData },
    'onTimeConfirmed': { subName: 'onTimeConfirmedSub', dataType: TimePickerEventData },
    // UiDatePicker
    'onDateChanged': { subName: 'onDateChangedSub', dataType: DatePickerEventData },
    'onDateConfirmed': { subName: 'onDateConfirmedSub', dataType: DatePickerEventData },
    // UiCircleConfirmation
    'onConfirmationCanceled': { subName: 'onConfirmationCanceledSub', dataType: CircleConfirmationEventData },
    'onConfirmationCompleted': { subName: 'onConfirmationCompleteSub', dataType: CircleConfirmationEventData },
    'onConfirmationUpdated': { subName: 'onConfirmationUpdateSub', dataType: CircleConfirmationEventData }
}
