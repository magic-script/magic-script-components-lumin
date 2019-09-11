# MagicScript Components Lumin

[![CI](https://github.com/magic-script/magic-script-components-lumin/workflows/CI/badge.svg)](https://github.com/magic-script/magic-script-components-lumin/actions) [![npm version](https://badge.fury.io/js/magic-script-components-lumin.svg)](https://badge.fury.io/js/magic-script-components-lumin) [![License](https://img.shields.io/:license-Apache%202.0-blue.svg)](LICENSE)

MagicScript Component Framework for Lumin Runtime platform

This package is meant to be used along with [MagicScript Components](https://github.com/magic-script/magic-script-components) and both should be included as dependencies in the project's `package.json`.

## Installation

1. Install `magic-script-cli`:

```bash
npm install -g magic-script-cli
```

2. Create new MagicScript application:

```bash
magic-script init
```

- Follow the steps.
- Choose "Components" when application type is requested.

3. Install the required `npm` packages from the app folder:

```bash
npm install
```

4. Build and install your application:

```bash
magic-script build
```

5. Refer to MagicScript [Getting Started](https://www.magicscript.org/docs/getting-started) guide for more information.

## Update Existing Project

To update your existing MagicScript Components project run the following commands:

```bash
yarn add magic-script-components-lumin
yarn add magic-script-components@2.0.0
```

or with npm

```bash
npm install --save magic-script-components-lumin
npm install --save magic-script-components@2.0.0
```

This will update you existing MagicScript Components project to use the latest version of the library.

## Usage

See [Components Documentation](https://github.com/magic-script/magic-script-components/blob/master/docs/Components.md)

## License

This project is licensed under the Apache License, Version 2.0 - see the [LICENSE](LICENSE) file for details
