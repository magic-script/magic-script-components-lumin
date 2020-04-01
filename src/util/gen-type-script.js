import configuration from "../configuration.js";
import { UiNodeEvents } from '../platform/lumin-runtime/types/ui-node-events.js';

export function generateTypeScript () {
  let str = `/// <reference path='./XrClientBridge.d.ts' />

declare module "magic-script-components" {

  // Components:
  // --------------------------------------------------------------------------------

  interface AppProps {
    type: 'landscape' | 'immersive';
    volumeSize: vec3;
  }

`;

  let deps = {};

  const elements = configuration.nativeMapping.elements;

  const classToProps = createClassToPropsLookup(elements);

  const propsToParent = createParentLookup(elements, classToProps);

  let propTypes = {};

  for (let elementName in elements) {
    const builder = elements[elementName]();
    // capitalize the name to match exposed Component name
    elementName = elementName[0].toUpperCase() + elementName.slice(1)
    const name = elementName + 'Props';

    const parent = propsToParent[name];
    const list = [];

    for (let propName in builder._propertyDescriptors) {
      const propertyDescriptor = builder._propertyDescriptors[propName];
      if (propertyDescriptor.Name !== propName) {
        throw `Mismatched prop name, ${elementName}.${propName} !== ${propertyDescriptor.Name}`;
      }
      const propTs = propertyDescriptor.generateTypeScript();
      deps = {...deps, ...propertyDescriptor.tsDependentTypes()};
      if (propTs !== undefined) {
        list.push(propTs);
      }
    }

    propTypes[name] = {
      name,
      parent,
      list,
      extraTypeScript: typeof builder.extraTypeScript === 'function'
        ? builder.extraTypeScript() : ''
    };

    if (typeof builder.tsDependentTypes === 'function') {
      deps = {...deps, ...builder.tsDependentTypes()};
    }
  }

  for (const propName in propTypes) {
    const props = propTypes[propName];
    removeInheritedProps(props, propTypes);
    str += generatePropsTypeScript(props);
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

  const dataTypeNames = Object.keys(eventDataTypes);
  const knownDataTypes = new Set(dataTypeNames);
  for (const dataTypeName of dataTypeNames) {
    const dataType = eventDataTypes[dataTypeName];
    str += generateEventType(dataType, knownDataTypes);
  }

  return str;
}

function generateEventType (dataType, knownDataTypes) {
  const dummyEvent = {
    getUiNode() {
      return {};
    }
  };

  const eventData = new dataType(dummyEvent);

  const parent = getParentClass(eventData);
  const extendsClause = parent ? ` extends ${parent.name}` : '';

  let str = '';
  if (parent && !knownDataTypes.has(parent.name)) {
    knownDataTypes.add(parent.name);
    str += generateEventType(parent, knownDataTypes);
  }

  str += `  interface ${dataType.name}${extendsClause} {\n`;
  for (const key of eventData._propertyNames) {
    str += `    ${key}?: any;\n`;
  }
  str += '  }\n\n';
  return str;
}

function removeInheritedProps (props, propTypes) {
  let parentName = props.parent;
  while (parentName && typeof propTypes[parentName] !== 'undefined') {
    const parent = propTypes[parentName];
    props.list = props.list.filter( propTs => !parent.list.includes(propTs) );
    parentName = parent.parent;
  }
}

function generatePropsTypeScript (props) {
  let comp = props.name;
  comp = comp.substring(0, comp.length - "Props".length);
  let str = `  interface ${props.name} extends ${props.parent ? props.parent + ', ' : ''}EventHandlerProps {\n`
  props.list.forEach(propTs => {
    if (!propTs.startsWith('children?:')) {
      str += `    ${propTs}\n`;
    }
  });
  str += props.extraTypeScript;
  str += '  }\n\n';
  str += `  const ${comp}: React.FC<${props.name}>;\n\n`
  return str;
}

function createClassToPropsLookup (elements) {
  let classToProps = {};

  for (let elementName in elements) {
    const builder = elements[elementName]();
    // capitalize the name to match exposed Component name
    elementName = elementName[0].toUpperCase() + elementName.slice(1);
    const propsName = elementName + 'Props';
    classToProps[builder.constructor.name] = propsName;
  }

  // Manual intervention to allow all UiNode subclass props to extend ViewProps
  classToProps['UiNodeBuilder'] = 'ViewProps'

  return classToProps;
}

function createParentLookup (elements, classToProps) {
  let propsToParent = {};
    for (let elementName in elements) {
    const builder = elements[elementName]();
    // capitalize the name to match exposed Component name
    elementName = elementName[0].toUpperCase() + elementName.slice(1);
    const propsName = elementName + 'Props';
    classToProps[builder.constructor.name] = propsName;

    let parentBuilderClass = getParentClass(builder);
    while (parentBuilderClass) {
      if (typeof classToProps[parentBuilderClass.name] !== 'undefined') {
        const parentPropsName = classToProps[parentBuilderClass.name];
        if (parentPropsName !== propsName) {
          propsToParent[propsName] = parentPropsName;
          break;
        }
      }
      const parentBuilder = new parentBuilderClass();
      parentBuilderClass = getParentClass(parentBuilder);
    }
  }
  // Following Props have itemAlignement which conflicts with ContentProps -- remove parent as workaround
  propsToParent['ListViewProps'] = undefined;
  propsToParent['GridLayoutProps'] = undefined;
  propsToParent['LinearLayoutProps'] = undefined;

  return propsToParent;
}

function getParentClass (obj) {
  const parent = obj.__proto__.__proto__;
  return parent && parent.__proto__ ? parent.constructor : undefined;
}
