// Copyright (c) 2019 Magic Leap, Inc. All Rights Reserved

function composeFunctionSignature (name, ...parameters) {
    return parameters !== undefined
      ? `${name}(${parameters.map(parameter => JSON.stringify(parameter)).join(', ')})`
      : '';
}

function throwNativeCallError (error, signature) {
    throw new Error(`[Native.${signature}]:\n${error.name} - ${error.message}\n${error.stack}`);
}

const executor = {
    // Executes 'Create' or `CreateXXX' static function which returns node object
    createNode: (classReference, constructorName, prism, ...parameters) => {
        try {
          return Array.isArray(parameters) && (parameters.length > 0)
            ? classReference[constructorName](prism, ...parameters)
            : classReference[constructorName](prism);
        } catch (error) {
          throwNativeCallError(error, composeFunctionSignature(constructorName, ...parameters));
        }
    },

    // Expects node function which does NOT return result
    callNativeAction: (node, functionName, ...parameters) => {
        try {
            if (Array.isArray(parameters) && (parameters.length > 0)) {
                node[functionName](...parameters);
            } else {
                node[functionName]();
            }
        } catch (error) {
          throwNativeCallError(error, composeFunctionSignature(functionName, ...parameters));
        }
    },

    // Expects node function which returns result
    callNativeFunction: (node, functionName, ...parameters) => {
        try {
          return Array.isArray(parameters) && (parameters.length > 0)
            ? node[functionName](...parameters)
            : node[functionName]();
        } catch (error) {
          throwNativeCallError(error, composeFunctionSignature(functionName, ...parameters));
        }
    },

    // Executes `new` <constructorName>() which returns native object
    callNativeConstructor: (constructorFunction, ...parameters) => {
        try {
            return Array.isArray(parameters) && (parameters.length > 0)
              ? new constructorFunction(...parameters)
              : new constructorFunction();
        } catch (error) {
            throwNativeCallError(error, composeFunctionSignature(constructorFunction.name, ...parameters));
        }
    }
}

export default executor;