import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { ref } from "vue"
import { Params } from "../../src/types/Params"
import { useSearchStore } from "../../src/stores/search"
import { facetNames as allFacetNames } from '../data/facets'

// ------------------------------------------------------------
// Fixture

// ------------------------------
// Mock api store

const performSearch: Mock<[Params], Promise<void>> = vi.fn()
const apiStore = { performSearch }

vi.mock('@/stores/api', () => {
  return {
    useApiStore: () => apiStore,
  }
})

// ------------------------------
// Mock facet store

const facetNames = ref(allFacetNames)
const expandAll: Mock<[String], void> = vi.fn()
const collapseAll = vi.fn()
const facetStore = { facetNames, expandAll, collapseAll }

vi.mock('@/stores/facets', () => {
  return {
    useFacetStore: () => facetStore,
  }
})

// ------------------------------
// Mock session store

const isAdmin = ref(false)
const sessionStore = { isAdmin }

vi.mock('@/stores/session', () => {
  return {
    useSessionStore: () => sessionStore,
  }
})

// ------------------------------------------------------------
// Tests

describe('search', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('init()', () => {
    it('reads the initial state from the window location and triggers a search', async () => {
      const searchStore = useSearchStore()
      const { init, selectedTerms } = searchStore
      const { keywords, page } = storeToRefs(searchStore)

      expandAll.mockImplementationOnce((fnames) => {
        expect(fnames).toHaveLength(2)
        expect(fnames).toContain('Genre')
        expect(fnames).toContain('Medium')
      })

      performSearch.mockImplementationOnce((params) => {
        expect(params['filter[keywords]']).toEqual('blue medium')
        expect(params['filter[Genre]']).toEqual('Abstract,Still Life')
        expect(params['filter[Medium]']).toEqual('Etching,Collage')
        expect(params['page[number]']).toEqual(2)
        return Promise.resolve()
      })

      const query = '?keywords=blue+medium&Genre=Abstract%2CStill+Life&Medium=Etching%2CCollage&page=2'
      window.history.pushState('', '', query)

      await init()

      expect(expandAll).toHaveBeenCalledOnce()
      expect(performSearch).toHaveBeenCalledOnce()

      const kw = keywords.value
      expect(kw).toEqual('blue medium')

      expect(page.value).toEqual(2)

      const genreTerms = selectedTerms('Genre').value
      expect(genreTerms).toHaveLength(2)
      expect(genreTerms).toContain('Abstract')
      expect(genreTerms).toContain('Still Life')

      const mediumTerms = selectedTerms('Medium').value
      expect(mediumTerms).toHaveLength(2)
      expect(mediumTerms).toContain('Etching')
      expect(mediumTerms).toContain('Collage')
    })
  })

  describe('search state', () => {
    afterEach(() => {
      isAdmin.value = false
    })

    describe('keywords', () => {
      describe('get()', () => {
        it('defaults to empty', () => {
          const { keywords } = storeToRefs(useSearchStore())
          expect(keywords.value).toBeFalsy()
        })
      })

      describe('set()', () => {
        // TODO: test that we reset facets
        it('triggers a search', () => {
          const expectedKeywords = 'blue medium'

          performSearch.mockImplementationOnce((params) => {
            expect(params['filter[keywords]']).toEqual(expectedKeywords)
            return Promise.resolve()
          })

          const { keywords } = storeToRefs(useSearchStore())
          keywords.value = expectedKeywords

          expect(collapseAll).toHaveBeenCalledOnce()
          expect(performSearch).toHaveBeenCalledOnce()
        })
      })
    })

    describe('suppressed', () => {
      describe('get()', () => {
        it('defaults to only false', () => {
          const { suppressed } = storeToRefs(useSearchStore())
          expect(suppressed.value).toHaveLength(1)
          expect(suppressed.value).toContain(false)
        })
      })

      describe('set()', () => {
        it('does nothing if user is not admin', () => {
          const suppressedVal = [true, false]

          const { suppressed } = storeToRefs(useSearchStore())
          suppressed.value = suppressedVal

          expect(collapseAll).not.toHaveBeenCalled()
          expect(performSearch).not.toHaveBeenCalled()
        })

        // TODO: test that we don't clobber keywords and facets
        it('triggers a search if user is admin', () => {
          isAdmin.value = true

          const suppressedVal = [true, false]
          performSearch.mockImplementationOnce((params) => {
            expect(params['filter[suppressed]']).toEqual('true,false')
            return Promise.resolve()
          })

          const { suppressed } = storeToRefs(useSearchStore())
          suppressed.value = suppressedVal

          expect(performSearch).toHaveBeenCalledOnce()
        })
      })
    })

    describe('page', () => {
      describe('get()', () => {
        it('defaults to 1', () => {
          const { page } = storeToRefs(useSearchStore())
          expect(page.value).toEqual(1)
        })
      })

      describe('set()', () => {
        // TODO: test that we don't clobber keywords and facets
        it('triggers a search', () => {
          const pageVal = 13

          performSearch.mockImplementationOnce((params) => {
            expect(params['page[number]']).toEqual(pageVal)
            return Promise.resolve()
          })

          const { page } = storeToRefs(useSearchStore())
          page.value = pageVal
        })
      })
    })

    describe('selectedTerms()', () => {
      describe('get()', () => {
        it('defaults to empty', () => {
          const { selectedTerms } = useSearchStore()

          for (const facetName of allFacetNames) {
            const termSelection = selectedTerms(facetName)
            expect(termSelection.value).toHaveLength(0)
          }
        })
      })

      // TODO: test set()
    })
  })
})
