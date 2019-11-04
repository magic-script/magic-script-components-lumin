import configuration from "../configuration.js";

export function generateTypeScript () {
  let str = 'declare module "magic-script-components" {\n\n';

  str += '  // Components:\n'
  str += '  // --------------------------------------------------------------------------------\n\n'
  let deps = {};

  const elements = configuration.nativeMapping.elements;
  for (let elementName in elements) {
    const builder = elements[elementName]();
    // captialize the name to match exposed Component name
    elementName = elementName[0].toUpperCase() + elementName.slice(1)
    str += `  interface ${elementName}Props {\n`

    for (let propName in builder._propertyDescriptors) {
      const propertyDescriptor = builder._propertyDescriptors[propName];
      if (propertyDescriptor.Name !== propName) {
        throw `Mismatched prop name, ${elementName}.${propName} !== ${propertyDescriptor.Name}`;
      }
      const propTs = propertyDescriptor.generateTypeScript();
      deps = {...deps, ...propertyDescriptor.tsDependentTypes()};
      str += `    ${propTs}\n`;
    }

    str += '  }\n\n';
    str += `  const ${elementName}: React.FC<${elementName}Props>;\n\n`
  }

  str += '  // Other Types:\n'
  str += '  // --------------------------------------------------------------------------------\n\n'
  for (let dep in deps) {
    str += `  type ${dep} = ${deps[dep]};\n\n`;
  }
  str += '}\n';

  return str;
}
