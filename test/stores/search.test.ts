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
const facetStore = { facetNames, expandAll }

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
    it('reads the initial state from the window location', async () => {
      const query = '?keywords=blue+medium&Genre=Abstract%2CStill+Life&Medium=Etching%2CCollage&page=2'
      window.history.pushState('', '', query)

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

      const { init, selectedTerms } = useSearchStore()
      await init()

      const { keywords, page } = storeToRefs(useSearchStore())

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
})
