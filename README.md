![Build](https://github.com/BerkeleyLibrary/galc-ui/actions/workflows/build.yml/badge.svg)

# galc-ui

A UI for the UC Berkeley Library [Graphic Arts Loan Collection](https://galc.lib.berkeley.edu/).

## For developers

`galc-ui` is a [Vue.js 3](https://vuejs.org/) library using [Pinia](https://pinia.vuejs.org/) for
state management and built with [Vite](https://vitejs.dev/).

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
