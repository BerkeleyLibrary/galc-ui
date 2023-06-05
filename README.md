![Build](https://github.com/BerkeleyLibrary/galc-ui/actions/workflows/build.yml/badge.svg)

# galc-ui

A UI for the UC Berkeley Library [Graphic Arts Loan Collection](https://galc.lib.berkeley.edu/).

## For developers

`galc-ui` is a [Vue.js 3](https://vuejs.org/) library using [Pinia](https://pinia.vuejs.org/) for
state management, coded in [TypeScript](https://www.typescriptlang.org/) and built with
[Vite](https://vitejs.dev/).

### Development environment

In production, the `galc-ui` app is a JavaScript library, built from the [`src`](src) directory,
that runs embedded in an HTML page. To simulate this environment, Vite provides a development server
that uses the dummy [`index.html`](index.html) page in the project root directory.

### Getting started

1. Ensure you have the following prerequisites:

   - [Node.js](https://nodejs.org/en/)
   - [Yarn](https://yarnpkg.com/)

   On macOS with [Homebrew](https://brew.sh/), the simplest way to do this is:

   - `brew install node`
   - `brew install corepack`
   - `corepack enable`

2. Ensure that the [galc-api](https://github.com/BerkeleyLibrary/galc-api) back end is
   available and running on port 3000.

3. In the project root directory:
 
   1. install the dependencies:

      - `yarn install`

   2. start the Vite development server
   
      - `vite`
   
   3. in the browser, navigate to [http://localhost:4000/](http://localhost:4000/).

### Test

This project uses [Vitest](https://vitest.dev), Vite's integrated test framework.
Tests and code coverage are configured in [`vitest.config.ts`](vitest.config.ts).

- `yarn test` runs the tests
- `yarn coverage` runs the tests with coverage

Note that currently not all files are covered (uncomment `all: true` in 
`vitest.config.js` to see what files are not covered), but also that those
files that are covered have both line coverage and branch coverage.

### Code style

This project uses [ESLint](https://eslint.org/) to check and enforce code style.
ESLint plugins and style rules are configured in [`.eslintrc.js`](.eslintrc.js).

- `yarn lint` runs the style checks
- `yarn lint --fix` fixes those style problems that can be fixed automatically
