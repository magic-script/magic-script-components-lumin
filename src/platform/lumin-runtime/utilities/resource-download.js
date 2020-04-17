// The purpose of the resource downloader is to download image or model from remote location (url)

import { ui, INVALID_RESOURCE_ID } from 'lumin';

import executor from './executor.js';

import { logError } from '../../../util/logger.js';
import saveResource from '../../../util/download.js';

import { ColorProperty } from '../elements/properties/color-property.js';

const DOWNLOAD_COLOR_MASK = [0.1, 0.1, 0.1, 0.1];
const DEFAULT_COLOR_MASK = [1, 1, 1, 1];

function createSpinner (prism) {
    const spinner = executor.createNode(ui.UiLoadingSpinner, 'Create', prism, ui.LoadingSpinnerType.k2dSpriteAnimation);
    const [w, h] = executor.callNativeFunction(spinner, 'getSize');
    const [x, y, z] = executor.callNativeFunction(spinner, 'getLocalPosition');

    executor.callNativeAction(spinner, 'setLocalPosition', [x - (w / 2), y - (h / 2), z]);
    return spinner;
}

function addMaskAndSpinner (element, prism) {
    // Set color mask
    executor.callNativeAction(element, 'setColor', DOWNLOAD_COLOR_MASK);

    // Add downloading spinner
    const spinner = createSpinner(prism);
    executor.callNativeAction(element, 'addChild', spinner);

    return spinner;
}

function removeMaskAndSpinner (element, prism, spinner, properties) {
    // Remove color mask
    const color = (properties.color !== undefined && ColorProperty.validate(properties.color))
      ? ColorProperty.parse(properties.color)
      : DEFAULT_COLOR_MASK
    executor.callNativeAction(element, 'setColor', color);

    // Delete spinner
    executor.callNativeAction(element, 'removeChild', spinner);
    executor.callNativeAction(prism, 'deleteNode', spinner);
}

function doesElementExist (element, prism) {
    const nodeId = executor.callNativeFunction(element, 'getNodeId');
    return executor.callNativeFunction(prism, 'getNode', nodeId) !== null;
}

export default async function loadRemoteResource (url, properties, element, prism, setResourceFunctionName, createResourceFunction, postLoadAction) {
    const spinner = addMaskAndSpinner(element, prism);

    // Fetch the remote image
    let filePath;
    try {
      filePath = await saveResource(url);
    } catch (error) {
      logError(error.message);
      removeMaskAndSpinner(element, prism, spinner, properties);
      return;
    }

    const resourceId = createResourceFunction(filePath);

    if (resourceId === INVALID_RESOURCE_ID) {
      logError(`Failed to load resource from: ${url}`);
      removeMaskAndSpinner(element, prism, spinner, properties);
      return;
    }

    // Verify that the node is still part of the scene graph after asset download is complete
    if (doesElementExist(element, prism)) {
      executor.callNativeAction(element, setResourceFunctionName, resourceId);
      removeMaskAndSpinner(element, prism, spinner, properties);
      postLoadAction(filePath);
    }
}
