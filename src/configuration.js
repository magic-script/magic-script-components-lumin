// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import nativeComponentMapping from './platform/lumin-runtime/component-mapping.js';
import { PlatformFactory } from './platform/lumin-runtime/platform-factory.js';
import { MessageSeverity } from './util/logger.js';
import SpatialLogger from './platform/lumin-runtime/utilities/spatial-logger.js';

export default {
  logMinMessageSeverity: MessageSeverity.error,
  nativeMapping: nativeComponentMapping,
  nativeFactory: PlatformFactory,
  spatialLogger: SpatialLogger
};
