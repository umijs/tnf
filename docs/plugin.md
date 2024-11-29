# Plugin

## Properties

### name

- Type: `string`

Plugin name.

### enforce

- Type: `'pre' | 'post'`

Plugin execution order.

## General Hooks

### buildStart

- Type: `(ctx: { command: string }) => void | Promise<void>`

Called when build start.

### buildEnd

- Type: `(ctx: { command: string, err?: Error }) => void | Promise<void>`

Called when build end.

### config

- Type: `(config: UserConfig, env: { command: string }) => UserConfig | Promise<UserConfig> | null`

Return an object that will be deeply merged into the existing config, or directly modify the config object.

### configResolved

- Type: `(config: ResolvedConfig) => void | Promise<void>`

Called when config resolved.

### configureServer

- Type: `(server: { middlewares: express.Application }) => void | Promise<void>`

Can register pre or post middleware, or save server instance for other hooks.

```ts
// Register pre middleware
configureServer(server) {
  server.middlewares.use((req, res, next) => {
  });
}

// Register post middleware
configureServer(server) {
  return () => {
    server.middlewares.use((req, res, next) => {
    });
  };
}
```

### configureBundler

> Not implemented

- Type: `() => unplugin.Plugin[] | Promise<unplugin.Plugin[]>`

Modify bundler config, return an array of [unplugin](https://unplugin.unjs.io/) plugins.

### registerCommand

> Not implemented

- Type: `() => Command | Promise<Command>`

Register command.

### transformHtml

> Not implemented

- Type: `(html: string, ctx: { path: string, filename: string }) => string | Promise<string>`

Modify html content.

### transformEntry

> Not implemented

- Type: `(code: string, ctx: { path: string, filename: string }) => string | Promise<string>`

Modify entry content.

## Plugin Context

Most hooks will pass in a ctx object, which contains some useful information.

### ctx.command

- Type: `string`

Return current command.

### ctx.config

- Type: `ResolvedConfig`

Return current config.

### ctx.cwd

- Type: `string`

Return current project directory.

### ctx.debug

- Type: `(message: string) => void`

Print debug information.

### ctx.error

- Type: `(message: string) => void`

Print error information.

### ctx.info

- Type: `(message: string) => void`

Print information.

### ctx.userConfig

- Type: `UserConfig`

Return current user config.

### ctx.warn

- Type: `(message: string) => void`

Print warning information.

### ctx.watcher

> Not implemented

- Type: `Watcher`

Built-in file watcher.
