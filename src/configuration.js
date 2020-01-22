// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

import nativeComponentMapping from './platform/lumin-runtime/component-mapping.js';
import { PlatformFactory } from './platform/lumin-runtime/platform-factory.js';
import { MessageSeverity } from './util/logger.js';

export default {
  nativeMapping: nativeComponentMapping,
  nativeFactory: PlatformFactory,
  logMinMessageSeverity: MessageSeverity.error
};
