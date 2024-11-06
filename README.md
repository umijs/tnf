# @umijs/tnf

Tnf, ~~the north face~~, the next framework. Tnf is focused on simple, performance and developer experience. Framework should be simple. CSR development should be simple. Type safety should be built-in.

## Getting Started

Create a new project with the following command:

```bash
$ npx @umijs/tnf create myapp --template=simple
$ cd myapp
$ npm install
$ npm run build
$ npx serve dist -s
```

## Commands

> WIP. More commands will be added in the future.

- `tnf create <project-name> --template=<template-name>`: Create a new project with the given template.
- `tnf build`: Build the project.
- `tnf dev`: Start the development server.
- `tnf preview`: Preview the product after building the project.

## API

- `@umijs/tnf/router`: The router module, reexported from `@tanstack/react-router`.

## Config

Config is loaded from `.tnfrc.ts` by default.

- `externals: Record<string, string>`: An object that maps package names to their corresponding paths.
- `devServer: { port?: number; host?: string; https?: { hosts?: string[] }; ip?: string }`: The development server configuration.
- `less: { modifyVars?: Record<string, string>; globalVars?: Record<string, string>; math?: 'always' | 'strict' | 'parens-division' | 'parens' | 'strict-legacy' | number; sourceMap?: any; plugins?: (string | [string, Record<string, any>])[];}`: The configuration passed to lessLoader.

## LICENSE

[MIT](LICENSE)
