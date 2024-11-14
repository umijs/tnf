# Contributing

## Setup

```bash
# Clone the repository
$ git clone git@github.com:umijs/tnf.git
$ cd tnf
# Install dependencies
$ pnpm install
# Install Playwright browsers
$ pnpm playwright install chromium
```

## Development

```bash
# Start the development server
$ pnpm dev
```

## Build

```bash
# Build the project
$ pnpm build
```

## Preview

```bash
# Preview the product after building the project
$ pnpm preview
```

## Test

```bash
# Run all tests in watch mode
$ pnpm test
# Run all tests
$ pnpm test --run
# Run e2e tests
$ pnpm test:e2e
```

## Changelog

When you need to submit code, please synchronize the submission of the modification log.

```bash
$ pnpm changeset

🦋  What kind of change is this for @umijs/tnf? (current version is 0.0.0-alpha.5) … 
❯ patch
  minor
  major

🦋  Please enter a summary for this change (this will be in the changelogs).
🦋    (submit empty line to open external editor)
🦋  Summary › docs: changelog 

🦋  === Summary of changesets ===
🦋  patch:  @umijs/tnf
🦋  
🦋  Is this your desired changeset? (Y/n) · true
🦋  Changeset added! - you can now commit it
```

Based on the modified package name, select the type to be published, usually choosing `patch`.Then enter `changelog`.

After the code is merged into the main branch, it will be sent to GitHub CI to automatically change the version number of the corresponding package.

## Release

Release tnf package:

```bash
$ pnpm release
```

Release create-tnf package:

```bash
$ pnpm release:create-tnf
```

## Code Style

We use [Prettier](https://prettier.io/) to format the code, please run `pnpm format` to format the code. And we also have some other rules:

- Do not use specifiers for `fs` and `path` modules.
- Do use `pathe` instead of `path` module.

```ts
// bad
import { writeFile } from 'fs';
import { join } from 'path';

// good
import fs from 'fs';
import path from 'pathe';
```

- Do use `test()` instead of `describe` + `it()` for test cases.

```ts
// bad
describe('test', () => {
  it('test', () => {});
});

// good
test('test', () => {});
```
