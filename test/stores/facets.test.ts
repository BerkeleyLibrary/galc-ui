import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useFacetStore } from "../../src/stores/facets"

import { facets as allFacets } from "../data/facets"

describe('facets', () => {

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function storeFacets() {
    const { facets } = storeToRefs(useFacetStore())
    return facets.value
  }

  function storeFacetNames() {
    const { facetNames } = storeToRefs(useFacetStore())
    return facetNames.value
  }

  describe('without data', () => {
    describe('facets', () => {
      it('is initially empty', () => {
        const facets = storeFacets()
        expect(facets).toHaveLength(0)
      })
    })
  })

  describe('with data', () => {
    beforeEach(() => {
      const { facets } = storeToRefs(useFacetStore())
      facets.value = allFacets
    })

    describe('facets', () => {
      it('contains the facets', () => {
        const facets = storeFacets()
        expect(facets).toHaveLength(allFacets.length)

        for (const facet of allFacets) {
          expect(facets).toContain(facet)
        }
      })
    })

    describe('facetNames', () => {
      it('returns the facet names', () => {
        const facetNames = storeFacetNames()
        expect(facetNames).toHaveLength(allFacets.length)

        for (const facet of allFacets) {
          expect(facetNames).toContain(facet.name)
        }
      })
    })
  })
})
