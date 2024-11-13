# @umijs/tnf

Tnf, ~~the north face~~, the next framework. Tnf is focused on simple, performance and developer experience. Framework should be simple. CSR development should be simple. Type safety should be built-in.

## Features

- Simple, performance and developer experience focused.
- Type safety built-in.
- TanStack Router built-in.
- [ ] Framework unplugin which is compatible with umi and other frameworks.
- [ ] Security built-in. Including doctor rules which is used in Ant Group.
- [ ] Support SSR, API routes and server functions.
- [ ] AI based generator and other features.
- [ ] Rust based for heavy computation tasks.
- [ ] Easy to integrate with popular libraries.

## Getting Started

Create a new project with the following command:

```bash
$ npx @umijs/tnf create myapp --template=simple
$ cd myapp
$ pnpm i
```

Then you can generate a page with the following command.

```bash
$ npx tnf generate page foo
```

Then you can start the development server or build the project. After building, you can preview the product locally.

```bash
$ pnpm dev
$ pnpm build
$ pnpm preview
```

## Commands

- `tnf create <project-name> --template=<template-name>`: Create a new project with the given template.
- `tnf build`: Build the project.
- `tnf dev`: Start the development server.
- `tnf generate/g <type> <name>`: Generate a new page (or component and other types in the future).
- `tnf preview`: Preview the product after building the project.
- `tnf sync --mode=<mode>`: Sync the project to the temporary directory.

## API

- `@umijs/tnf/router`: The router module, reexported from `@tanstack/react-router`.

## Config

Config is loaded from `.tnfrc.ts` by default.

- `devServer: { port?: number; host?: string; https?: { hosts?: string[] }; ip?: string }`: The development server configuration.
- `externals: Record<string, string>`: An object that maps package names to their corresponding paths.
- `less: { modifyVars?: Record<string, string>; globalVars?: Record<string, string>; math?: 'always' | 'strict' | 'parens-division' | 'parens' | 'strict-legacy' | number; sourceMap?: any; plugins?: (string | [string, Record<string, any>])[];}`: The configuration passed to lessLoader.
- `router: { defaultPreload?: 'intent' | 'render' | 'viewport'; defaultPreloadDelay?: number; devtool?: { options?: { initialIsOpen?: boolean; position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' }; } | false }`: The router configuration.
- `tailwindcss: boolean`: Turn on/off tailwindcss. Need to be used in conjunction with `src/tailwind.css` and `tailwind.config.js`.

## FAQ

### How to specify a redirect route?

You can use `redirect` function in loader to specify a redirect route.

```tsx
import { redirect, createFileRoute } from '@umijs/tnf/router';
const Route = createFileRoute('/foo')({
  loader: async () => redirect({ to: '/bar' }),
});
```

## LICENSE

[MIT](LICENSE)
