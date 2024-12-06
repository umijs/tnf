# @umijs/tnf

[![](https://badgen.net/npm/v/@umijs/tnf)](https://www.npmjs.com/package/@umijs/tnf)
[![](https://badgen.net/npm/dm/@umijs/tnf)](https://www.npmjs.com/package/@umijs/tnf)
[![](https://github.com/umijs/tnf/actions/workflows/ci.yml/badge.svg)](https://github.com/umijs/tnf/actions/workflows/ci.yml)
[![](https://badgen.net/npm/license/umi)](https://www.npmjs.com/package/@umijs/tnf)

Tnf, ~~the north face~~, the next framework. Tnf is focused on simple, performance and developer experience. Framework should be simple. CSR development should be simple. Type safety should be built-in.

> Please consider following this project's author, [sorrycc](https://github.com/sorrycc), and consider starring the project to show your ❤️ and support.

## Features

- Simple, performance and developer experience focused.
- Type safety built-in.
- TanStack Router built-in.
- Conventional global style with `src/global.{less,css}`.
- Less, CSS Modules support built-in.
- Tailwind CSS support built-in.
- [Framework unified plugin system](./docs/plugin.md) which is compatible with umi and other frameworks.
- Mock.
- Conventional client entry with `src/client.tsx`.
- [ ] Security built-in. Including doctor rules which is used in Ant Group.
- Support SSR.
- [ ] Support API routes and server functions.
- [ ] AI based generator and other features.
- [ ] Rust based for heavy computation tasks.
- [ ] Easy to integrate with popular libraries.

## Getting Started

Create a new project with the following command:

```bash
$ pnpm create tnf myapp --template=simple
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

- `tnf build`: Build the project.
- `tnf config list/get/set/remove [name] [value]`: Manage the config.
- `tnf dev`: Start the development server.
- `tnf generate/g <type> <name>`: Generate a new page (or component and other types in the future).
- `tnf preview`: Preview the product after building the project.
- `tnf sync --mode=<mode>`: Sync the project to the temporary directory.

## API

- `@umijs/tnf`: The entry of tnf, including `defineConfig`, ...
- `@umijs/tnf/router`: The router module, reexported from `@tanstack/react-router`.
- `@umijs/tnf/ssr`: The ssr module, including `Meta`, `Client` and `Server`.

## Config

Config is loaded from `.tnfrc.ts` by default.

### alias

- Type: `[string, string][]`
- Default: `[]`

Alias is used to replace the values in `import` statements. These values are passed to bundlers and TypeScript automatically.

```ts
export default {
  alias: [
    ['foo', './src/foo'],
  ],
}
```

NOTICE: You will need to run `tnf dev` to have the alias configuration in `tsconfig.json` automatically generated.

### bundler

- Type: `'webpack' | 'mako'`
- Default: `'mako'`

The bundler to use.

NOTICE: webpack bundler is not implemented yet.

### clickToComponent

- Type: `{ editor?: 'vscode' | 'vscode-insiders' | 'cursor' } | false`
- Default: `false`

Click the component to open in the editor.

### devServer

- Type: `{ port?: number; host?: string; https?: { hosts?: string[] }; ip?: string }`
- Default: `{ port: 8000, host: 'localhost' }`

The development server configuration.

### externals

- Type: `Record<string, string>`
- Default: `{}`

An object that maps package names to their corresponding paths.

### less

- Type: `{ modifyVars?: Record<string, string>; globalVars?: Record<string, string>; math?: 'always' | 'strict' | 'parens-division' | 'parens' | 'strict-legacy' | number; sourceMap?: any; plugins?: (string | [string, Record<string, any>])[];}`
- Default: `{}`

The configuration passed to lessLoader.

### mock

- Type: `{ delay?: string | number }`
- Default: `{ delay: 0 }`

In addition to supporting numbers, delay also supports string ranges, such as delay: '500-1000', which randomly selects a value between 500ms and 1000ms.And allowing the configuration to be overridden by the url parameter, such as /api/users?delay=3000.

### plugins

- Type: `Plugin[]`
- Default: `[]`

The plugins configuration. Checkout [plugin.md](./docs/plugin.md) for more details.

### publicPath

- Type: `string`
- Default: `/`

The publicPath configuration.

### reactScan

- Type: `{}`
- Default: `false`

Enable [react scan](https://react-scan.com/) to detects performance issues in your React code.

### router

- Type: `{ defaultPreload?: 'intent' | 'render' | 'viewport'; defaultPreloadDelay?: number; devtool?: { options?: { initialIsOpen?: boolean; position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' }; } | false; convention?: any }`
- Default: `{ defaultPreload: 'intent', defaultPreloadDelay: 100 }`

The router configuration. Checkout [@tanstack/router-generator](https://github.com/TanStack/router/blob/cc05ad8/packages/router-generator/src/config.ts#L22-L67) for convention config.

### ssr

- Type: `{ renderMode?: 'stream' | 'string' }`
- Default: `{ renderMode: 'stream' }`

The ssr configuration.

## FAQ

### How to specify a redirect route?

You can use `redirect` function in loader to specify a redirect route.

```tsx
import { redirect, createFileRoute } from '@umijs/tnf/router';
const Route = createFileRoute('/foo')({
  loader: async () => redirect({ to: '/bar' }),
});
```

### How to get the loader data from parent route?

First, define parent route with `beforeLoad`.

```tsx
const parentRoute = createFileRoute('/foo')({
  beforeLoad: () => ({ foo: 'foo' }),
});
```

If it's root route, you can use `createRootRouteWithContext` instead.

```tsx
const rootRoute = createRootRouteWithContext<{ root: string }>()({
  beforeLoad: () => ({ root: 'root' }),
});
```

Second, fetch the loader data in child route with `context`.

```tsx
const childRoute = createFileRoute('/foo/bar')({
  // context: { root: 'root', foo: 'foo' },
  loader: async ({ context }) => ({ ...context }),
});
```

## CREDITS

This project is inspired by:

- [@tanstack/router](https://github.com/TanStack/router) for the router and ssr.

## LICENSE

[MIT](LICENSE)
