// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import { DeviceGestureFlags as gestureFlags } from 'lumin';

/**
 * @exports DeviceGestureFlags
 * @description Represents Magic-Script - Lumin Runtime DeviceGestureFlags mapping.
 */

export const DeviceGestureFlags = {
  'tap': gestureFlags.kDeviceTap,
  'hard-tap': gestureFlags.kDeviceHardTap,
  'secondary-hard-tap': gestureFlags.kDeviceSecondaryHardTap,
  'force-press': gestureFlags.kDeviceForcePress,
  'hold-press': gestureFlags.kDeviceHoldPress,
  'edge-tap': gestureFlags.kDeviceEdgeTap,
  'edge-hard-tap': gestureFlags.kDeviceEdgeHardTap,
  'edge-force-tap': gestureFlags.kDeviceEdgeForcePress,
  'edge-hold-press': gestureFlags.kDeviceEdgeHoldPress,
  'radial-scroll': gestureFlags.kDeviceRadialScroll,
  'swipe': gestureFlags.kDeviceSwipe,
  'scroll': gestureFlags.kDeviceScroll,
  'pinch': gestureFlags.kDevicePinch,
  'tap2': gestureFlags.kDeviceTap2,
  'double-tap': gestureFlags.kDeviceDoubleTap,
  'force-tap-down': gestureFlags.kDeviceForceTapDown,
  'force-tap-up': gestureFlags.kDeviceForceTapUp,
  'force-dwell': gestureFlags.kDeviceForceDwell,
  'second-force-down': gestureFlags.kDeviceSecondForceDown,
  'edge-press': gestureFlags.kDeviceEdgePress,
  'long-hold': gestureFlags.kDeviceLongHold,
  'radial-scroll-2': gestureFlags.kDeviceRadialScroll2
}
  