import configuration from "../configuration.js";
import { UiNodeEvents } from '../platform/lumin-runtime/types/ui-node-events.js';

// For now just include ALL possible event handlers for all components
// (which matches what the current implementation will allow you to register)
function genEventHandlerProps() {
  let str = '  interface EventHandlerProps {\n';

  let eventDataTypes = {};

  Object.keys(UiNodeEvents)
    .filter(key => key.length > 2 && key.startsWith('on'))
    .forEach(key => {
      const dataType = UiNodeEvents[key].dataType;
      eventDataTypes[dataType.name] = dataType;
      str += `    ${key}?: (eventData: ${dataType.name}) => void;\n`;
    });

  str += `  }

  // Event Data:
  // --------------------------------------------------------------------------------

`;

  for (const dataTypeName of Object.keys(eventDataTypes)) {
    const dummyEvent = {
      getUiNode() {
        return {};
      }
    };
    str += `  interface ${dataTypeName} {\n`;
    const eventData = new eventDataTypes[dataTypeName](dummyEvent);
    for (const key of eventData._propertyNames) {
      str += (`    ${key}?: any;\n`);
    }
    str += `  }\n\n`;
  }

  return str;
}

export function generateTypeScript () {
  let str = `declare module "magic-script-components" {

  // Components:
  // --------------------------------------------------------------------------------

  interface AppProps {
    type: 'landscape' | 'immersive';
    volumeSize: vec3;
  }

`;

  let deps = {};

  const elements = configuration.nativeMapping.elements;
  for (let elementName in elements) {
    const builder = elements[elementName]();
    // captialize the name to match exposed Component name
    elementName = elementName[0].toUpperCase() + elementName.slice(1)
    str += `  interface ${elementName}Props extends EventHandlerProps {\n`

    for (let propName in builder._propertyDescriptors) {
      const propertyDescriptor = builder._propertyDescriptors[propName];
      if (propertyDescriptor.Name !== propName) {
        throw `Mismatched prop name, ${elementName}.${propName} !== ${propertyDescriptor.Name}`;
      }
      const propTs = propertyDescriptor.generateTypeScript();
      deps = {...deps, ...propertyDescriptor.tsDependentTypes()};
      str += `    ${propTs}\n`;
    }

    if (typeof builder.extraTypeScript === 'function') {
      str += builder.extraTypeScript();
    }
    if (typeof builder.tsDependentTypes === 'function') {
      deps = {...deps, ...builder.tsDependentTypes()};
    }

    str += '  }\n\n';
    str += `  const ${elementName}: React.FC<${elementName}Props>;\n\n`
  }

  str += genEventHandlerProps();

  str += '  // Other Types:\n'
  str += '  // --------------------------------------------------------------------------------\n\n'
  for (let dep in deps) {
    str += `  type ${dep} = ${deps[dep]};\n\n`;
  }
  str += '}\n\n';

  str += 'declare function print(...args: any[]): void\n';

  return str;
}
