import { createMachine } from 'xstate'

export const resultsMachine = createMachine({
  id: 'Results',
  initial: 'init',
  strict: true,
  states: {
    init: {
      on: { SEARCH_PERFORMED: 'showing_results' }
    },
    showing_results: {
      on: { SEARCH_CLEARED: 'init' }
    }
  }
})
