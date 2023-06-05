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
const expandAll: Mock<[string], void> = vi.fn()
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
    useSearchStore().$dispose()
    vi.restoreAllMocks()
    isAdmin.value = false
  })

  describe('init()', () => {
    beforeEach(() => {
      expandAll.mockImplementationOnce((fnames) => {
        expect(fnames).toHaveLength(2)
        expect(fnames).toContain('Genre')
        expect(fnames).toContain('Medium')
      })
    })

    it('reads the initial state from the window location and triggers a search', async () => {
      const { selectedTerms } = useSearchStore()
      const { keywords, page } = storeToRefs(useSearchStore())

      performSearch.mockImplementationOnce((params) => {
        expect(params['filter[keywords]']).toEqual('blue medium')
        expect(params['filter[Genre]']).toEqual('Abstract,Still Life')
        expect(params['filter[Medium]']).toEqual('Etching,Collage')
        expect(params['page[number]']).toEqual(2)
        return Promise.resolve()
      })

      const query = '?keywords=blue+medium&Genre=Abstract%2CStill+Life&Medium=Etching%2CCollage&page=2'
      window.history.pushState('', '', query)

      await useSearchStore().init()

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

    it('ignores garbage page numbers', async () => {
      performSearch.mockImplementationOnce((params) => {
        expect(params['filter[keywords]']).toEqual('blue medium')
        expect(params['filter[Genre]']).toEqual('Abstract,Still Life')
        expect(params['filter[Medium]']).toEqual('Etching,Collage')
        expect(params['page[number]']).toBeUndefined()
        return Promise.resolve()
      })

      const badPageParam = 'chocolate'
      const query = `?keywords=blue+medium&Genre=Abstract%2CStill+Life&Medium=Etching%2CCollage&page=${badPageParam}`
      window.history.pushState('', '', query)

      await useSearchStore().init()

      expect(expandAll).toHaveBeenCalledOnce()
      expect(performSearch).toHaveBeenCalledOnce()
    })

    it('ignores "suppressed"', async () => {
      performSearch.mockImplementationOnce((params) => {
        expect(params['filter[keywords]']).toEqual('blue medium')
        expect(params['filter[Genre]']).toEqual('Abstract,Still Life')
        expect(params['filter[Medium]']).toEqual('Etching,Collage')
        expect(params['page[number]']).toEqual(2)
        expect(params['filter[suppressed]']).toBeUndefined()
        return Promise.resolve()
      })

      const query = `?keywords=blue+medium&Genre=Abstract%2CStill+Life&Medium=Etching%2CCollage&page=2&suppressed=true%2Cfalse`
      window.history.pushState('', '', query)

      await useSearchStore().init()

      expect(expandAll).toHaveBeenCalledOnce()
      expect(performSearch).toHaveBeenCalledOnce()
    })

    describe('as admin', () => {
      beforeEach(() => {
        isAdmin.value = true
      })

      it('reads the initial state from the window location and triggers a search', async () => {
        const searchStore = useSearchStore()

        performSearch.mockImplementationOnce((params) => {
          expect(params['filter[keywords]']).toEqual('blue medium')
          expect(params['filter[Genre]']).toEqual('Abstract,Still Life')
          expect(params['filter[Medium]']).toEqual('Etching,Collage')
          expect(params['page[number]']).toEqual(2)
          expect(params['filter[suppressed]']).toBeUndefined()
          return Promise.resolve()
        })

        const query = `?keywords=blue+medium&Genre=Abstract%2CStill+Life&Medium=Etching%2CCollage&page=2`
        window.history.pushState('', '', query)

        await searchStore.init()

        expect(expandAll).toHaveBeenCalledOnce()
        expect(performSearch).toHaveBeenCalledOnce()
      })

      it('reads "suppressed"', async () => {
        const searchStore = useSearchStore()

        performSearch.mockImplementationOnce((params) => {
          expect(params['filter[keywords]']).toEqual('blue medium')
          expect(params['filter[Genre]']).toEqual('Abstract,Still Life')
          expect(params['filter[Medium]']).toEqual('Etching,Collage')
          expect(params['page[number]']).toEqual(2)
          expect(params['filter[suppressed]']).toEqual('true,false')
          return Promise.resolve()
        })

        const query = '?keywords=blue+medium&Genre=Abstract%2CStill+Life&Medium=Etching%2CCollage&page=2&suppressed=true%2Cfalse'
        window.history.pushState('', '', query)

        await searchStore.init()

        expect(expandAll).toHaveBeenCalledOnce()
        expect(performSearch).toHaveBeenCalledOnce()
      })

      it('ignores a garbage "suppressed" value', async () => {
        const searchStore = useSearchStore()

        performSearch.mockImplementationOnce((params) => {
          expect(params['filter[keywords]']).toEqual('blue medium')
          expect(params['filter[Genre]']).toEqual('Abstract,Still Life')
          expect(params['filter[Medium]']).toEqual('Etching,Collage')
          expect(params['page[number]']).toEqual(2)
          expect(params['filter[suppressed]']).toBeUndefined()
          return Promise.resolve()
        })

        const badSuppressedValue = 'chocolate'
        const query = `?keywords=blue+medium&Genre=Abstract%2CStill+Life&Medium=Etching%2CCollage&page=2&suppressed=${badSuppressedValue}`
        window.history.pushState('', '', query)

        await searchStore.init()

        expect(expandAll).toHaveBeenCalledOnce()
        expect(performSearch).toHaveBeenCalledOnce()
      })
    })
  })

  describe('search state', () => {
    describe('keywords', () => {
      describe('get()', () => {
        it('defaults to empty', () => {
          const { keywords } = storeToRefs(useSearchStore())
          expect(keywords.value).toBeFalsy()
        })
      })

      describe('set()', () => {
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

        it('resets facets and page number', () => {
          const searchStore = useSearchStore()
          const { keywords, page } = storeToRefs(searchStore)
          page.value = 2

          const { selectedTerms } = searchStore
          selectedTerms('Genre').value = ['Abstract', 'Still Life']
          selectedTerms('Medium').value = ['Etching', 'Collage']

          performSearch.mockReset()
          performSearch.mockImplementationOnce((params) => {
            expect(params['page[number]']).toBeUndefined()
            expect(params['filter[Genre]']).toBeUndefined()
            expect(params['filter[Medium]']).toBeUndefined()

            expect(params['filter[keywords]']).toEqual('blue medium')
            return Promise.resolve()
          })

          keywords.value = 'blue medium'
          expect(performSearch).toHaveBeenCalledOnce()
        })

        it('does not reset "suppressed"', () => {
          isAdmin.value = true

          const suppressedVal = [true, false]

          const searchStore = useSearchStore()
          const { suppressed } = storeToRefs(searchStore)
          suppressed.value = suppressedVal

          const { keywords, page } = storeToRefs(searchStore)
          page.value = 2

          const { selectedTerms } = searchStore
          selectedTerms('Genre').value = ['Abstract', 'Still Life']
          selectedTerms('Medium').value = ['Etching', 'Collage']

          performSearch.mockReset()
          performSearch.mockImplementationOnce((params) => {
            expect(params['page[number]']).toBeUndefined()
            expect(params['filter[Genre]']).toBeUndefined()
            expect(params['filter[Medium]']).toBeUndefined()

            expect(params['filter[keywords]']).toEqual('blue medium')
            expect(params['filter[suppressed]']).toEqual('true,false')
            return Promise.resolve()
          })

          keywords.value = 'blue medium'
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

        it('triggers a search if user is admin', () => {
          isAdmin.value = true

          performSearch.mockImplementationOnce((params) => {
            expect(params['filter[suppressed]']).toEqual('true,false')
            return Promise.resolve()
          })

          const { suppressed } = storeToRefs(useSearchStore())
          suppressed.value = [true, false]

          expect(performSearch).toHaveBeenCalledOnce()
        })

        it('resets the page number, but does not alter keywords or facet values', () => {
          isAdmin.value = true

          const searchStore = useSearchStore()
          const { keywords, page, suppressed } = storeToRefs(searchStore)
          keywords.value = 'blue medium'
          page.value = 2

          const { selectedTerms } = searchStore
          selectedTerms('Medium').value = ['Etching', 'Collage']
          selectedTerms('Genre').value = ['Abstract', 'Still Life']

          performSearch.mockReset()
          performSearch.mockImplementationOnce((params) => {
            expect(params['page[number]']).toBeUndefined()
            expect(params['filter[suppressed]']).toEqual('true,false')

            expect(params['filter[keywords]']).toEqual('blue medium')
            expect(params['filter[Genre]']).toEqual('Abstract,Still Life')
            expect(params['filter[Medium]']).toEqual('Etching,Collage')
            return Promise.resolve()
          })

          suppressed.value = [true, false]
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
        it('triggers a search', () => {
          const pageVal = 13

          performSearch.mockImplementationOnce((params) => {
            expect(params['page[number]']).toEqual(pageVal)
            return Promise.resolve()
          })

          const { page } = storeToRefs(useSearchStore())
          page.value = pageVal

          expect(performSearch).toHaveBeenCalledOnce()
        })

        it('keeps keywords and facet values', () => {
          const searchStore = useSearchStore()
          const { keywords, page } = storeToRefs(searchStore)
          keywords.value = 'blue medium'

          const { selectedTerms } = searchStore
          selectedTerms('Medium').value = ['Etching', 'Collage']
          selectedTerms('Genre').value = ['Abstract', 'Still Life']

          const pageVal = 13

          performSearch.mockReset()
          performSearch.mockImplementationOnce((params) => {
            expect(params['filter[keywords]']).toEqual('blue medium')
            expect(params['filter[Genre]']).toEqual('Abstract,Still Life')
            expect(params['filter[Medium]']).toEqual('Etching,Collage')
            expect(params['page[number]']).toEqual(pageVal)
            return Promise.resolve()
          })

          page.value = pageVal
          expect(performSearch).toHaveBeenCalledOnce()
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

        it('consistently returns the same value', () => {
          const { selectedTerms } = useSearchStore()

          for (const facetName of allFacetNames) {
            const termSelection = selectedTerms(facetName)
            expect(termSelection.value).toHaveLength(0)

            expect(selectedTerms((facetName))).toEqual(termSelection)
          }
        })
      })

      describe('set()', () => {
        it('triggers a search', () => {
          const searchStore = useSearchStore()

          const facetName = 'Genre'
          const termVals = ['Abstract', 'Still Life']

          performSearch.mockReset()
          performSearch.mockImplementationOnce((params) => {
            expect(params[`filter[${facetName}]`]).toEqual(termVals.join(','))
            return Promise.resolve()
          })

          const { selectedTerms } = searchStore
          const termSelection = selectedTerms(facetName)

          termSelection.value = termVals

          expect(performSearch).toHaveBeenCalledOnce()
        })

        it('resets the page number, but does not alter keywords or other facet values', () => {
          const searchStore = useSearchStore()
          const { keywords, page } = storeToRefs(searchStore)
          keywords.value = 'blue medium'
          page.value = 2

          const { selectedTerms } = searchStore
          selectedTerms('Medium').value = ['Etching', 'Collage']

          performSearch.mockReset()
          performSearch.mockImplementationOnce((params) => {
            expect(params['page[number]']).toBeUndefined()

            expect(params['filter[keywords]']).toEqual('blue medium')
            expect(params['filter[Genre]']).toEqual('Abstract,Still Life')
            expect(params['filter[Medium]']).toEqual('Etching,Collage')
            return Promise.resolve()
          })

          selectedTerms('Genre').value = ['Abstract', 'Still Life']

          expect(performSearch).toHaveBeenCalledOnce()
        })
      })
    })

    describe('canResetSearch()', () => {
      it('defaults to false', () => {
        const { canResetSearch } = useSearchStore()
        expect(canResetSearch()).toEqual(false)
      })

      it('returns true if keywords are set', () => {
        const searchStore = useSearchStore()
        const { canResetSearch } = searchStore

        const { keywords } = storeToRefs(searchStore)
        keywords.value = 'blue medium'

        expect(canResetSearch()).toEqual(true)
      })

      it('returns true if facet terms are selected', () => {
        const { selectedTerms, canResetSearch } = useSearchStore()

        const termSelection = selectedTerms('Genre')
        termSelection.value = ['Abstract', 'Still Life']

        expect(canResetSearch()).toEqual(true)
      })
    })

    describe('resetSearch()', () => {
      it('triggers a search', () => {
        const searchStore = useSearchStore()
        const { selectedTerms, resetSearch } = searchStore

        const { page } = storeToRefs(searchStore)
        page.value = 2

        const termSelection = selectedTerms('Genre')
        termSelection.value = ['Abstract', 'Still Life']

        performSearch.mockReset()
        performSearch.mockImplementationOnce((params) => {
          const keys = Object.keys(params)
          expect(keys).toHaveLength(0)
          return Promise.resolve()
        })

        resetSearch()
        expect(performSearch).toHaveBeenCalledOnce()
      })
    })
  })

  describe('popState listener', () => {
    it('triggers a search',  async () => {
      const searchStore = useSearchStore()
      const { selectedTerms } = searchStore
      const { keywords, page } = storeToRefs(searchStore)

      const query = '?keywords=blue+medium&Genre=Abstract%2CStill+Life&Medium=Etching%2CCollage&page=2'
      window.history.pushState('', '', query)

      performSearch.mockImplementationOnce((_params) => Promise.resolve())

      await searchStore.init()

      performSearch.mockReset()

      performSearch.mockImplementation((params) => {
        expect(params['filter[keywords]']).toBeUndefined()
        expect(params['filter[Genre]']).toBeUndefined()
        expect(params['filter[Medium]']).toBeUndefined()
        expect(params['page[number]']).toBeUndefined()
        return Promise.resolve()
      })

      expect(performSearch).not.toHaveBeenCalled()
      window.history.pushState('', '', '/')
      // workaround for https://github.com/jsdom/jsdom/issues/1565

      expect(performSearch).not.toHaveBeenCalled()
      window.dispatchEvent(new PopStateEvent('popstate'))

      expect(performSearch).toHaveBeenCalledOnce()

      expect(page.value).toEqual(1)
      expect(keywords.value).toBeUndefined()
      for (const facetName of ['Genre', 'Medium']) {
        expect(selectedTerms(facetName).value).toHaveLength(0)
      }
    })
  })
})
