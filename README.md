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
        - or `yarn vite`, depending on your shell/path setup
   
   3. in the browser, navigate to [http://localhost:4000/](http://localhost:4000/).

### Test

This project uses [Vitest](https://vitest.dev), Vite's integrated test framework.
Tests and code coverage are configured in [`vitest.config.ts`](vitest.config.ts).

- `yarn test` runs the tests
- `yarn coverage` runs the tests with coverage

Be aware that currently not all files are covered (uncomment `all: true` in 
`vitest.config.js` to see what files are not covered), but also that those
files that are covered have both line coverage and branch coverage.

Note that the line numbers reported as branch coverage failures by the 
underlying [IstanbulJS](https://github.com/istanbuljs) engine are not always
intuitive — the underlying problem is likely on the first line reported, but
the range of lines may not be correct. Typical bnranch coverage issues include:

- `if(obj)` checks that are never passed a `null` or `undefined` value
- equality checks with `!==` for objects (e.g. `URL`) that are never equal
  (in the case of `URL`, use `toString()`, instead)
- default values for function parameters that are never used (the parameter
  is always passed explicitly)

### Code style

This project uses [ESLint](https://eslint.org/) to check and enforce code style.
ESLint plugins and style rules are configured in [`.eslintrc.js`](.eslintrc.js).

- `yarn lint` runs the style checks
- `yarn lint --fix` fixes those style problems that can be fixed automatically

### Build, packaging, and deployment

The GALC UI is built via GitHub actions and published as an NPM module
([`@berkeleylibrary/galc-ui`](https://www.npmjs.com/package/@berkeleylibrary/galc-ui)).
The workflow in [`build.yml`](.github/workflows/build.yml) includes the following
jobs:

1. `build`: on each push, pull request, or release:
   - checks code style (`yarn lint`)
   - runs tests and checks code coverage (`yarn coverage`)
   - builds the NPM module (`yarn build`)
   - saves the resulting `dist` directory as a build artifact
2. `publish-snapshot`: on each push to the `main` branch:
   - downloads the `dist` directory artifact from the `build` job
   - using `yarn version`, sets the version number in `package.json` to
     a temporary version number using the short commit hash (`0.0.0-<SHA1>`)
   - publishes this version to NPM, with the tag `snapshot`
3. `publish-release`: on each release:
   - downloads the `dist` directory artifact from the `build` job
   - using `yarn version`, sets the version number in `package.json` to
     a semantic version based on the release Git tag
   - publishes this version to NPM, tagged `latest`

There is no "deployment" as such — the GALC page on the QA instance of the
Library website is coded to pull the `snapshot` version from NPM (via 
[UNPKG](https://unpkg.com), while that on the production instance is coded
to pull `latest`.

Note that it can take a little time for changes to propagate from NPM to
UNPKG, and it can sometimes take some doing to convince your browser not to
continue using a cached version of the module.
