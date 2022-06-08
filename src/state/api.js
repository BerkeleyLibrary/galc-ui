import { createMachine } from 'xstate'

export const apiMachine = createMachine({
  id: 'Search',
  initial: 'init',
  strict: true,
  states: {
    init: {
      on: { FACET_LOAD_STARTED: 'loading_facets' }
    },
    loading_facets: {
      on: { FACETS_READY: 'initializing_search' }
    },
    initializing_search: {
      on: { SEARCH_STARTED: 'searching' }
    },
    searching: {
      on: { SEARCH_COMPLETE: 'idle' }
    },
    idle: {
      on: { SEARCH_STARTED: 'searching' }
    }
  }
})
