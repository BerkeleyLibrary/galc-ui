import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useFacetStore } from "../../src/stores/facets"

import { facets as allFacets } from "../data/facets"
import { Facet } from "../../src/types/Facet"

describe('facets', () => {

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('without data', () => {
    describe('facets', () => {
      it('is initially empty', () => {
        const { facets: storeFacets } = storeToRefs(useFacetStore())
        const facets = storeFacets.value
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
        const { facets: storeFacets } = storeToRefs(useFacetStore())
        const facets = storeFacets.value
        expect(facets).toHaveLength(allFacets.length)

        for (const facet of allFacets) {
          expect(facets).toContain(facet)
        }
      })

      it('is reactive', () => {
        const { facets: storeFacets } = storeToRefs(useFacetStore())

        const facet: Facet = allFacets[0]
        expect(storeFacets.value).toContain(facet)

        storeFacets.value = allFacets.slice(1)
        expect(storeFacets.value).not.toContain(facet)
      })
    })

    describe('facetNames', () => {
      it('returns the facet names', () => {
        const { facetNames: storeFacetNames } = storeToRefs(useFacetStore())
        const facetNames = storeFacetNames.value
        expect(facetNames).toHaveLength(allFacets.length)

        for (const facet of allFacets) {
          expect(facetNames).toContain(facet.name)
        }
      })

      it('is reactive', () => {
        const { facets: storeFacets, facetNames: storeFacetNames } = storeToRefs(useFacetStore())

        const facet: Facet = allFacets[0]
        expect(storeFacetNames.value).toContain(facet.name)

        storeFacets.value = allFacets.slice(1)
        expect(storeFacetNames.value).not.toContain(facet.name)
      })
    })

    describe('expanded', () => {
      it('defaults to false', () => {
        const { expanded } = useFacetStore()

        for (const facet of allFacets) {
          const facetExpanded = expanded(facet.name)
          expect(facetExpanded.value).toEqual(false)
        }

        for (const facet of allFacets) {
          const facetExpanded = expanded(facet.name)
          facetExpanded.value = true
        }

        for (const facet of allFacets) {
          const facetExpanded = expanded(facet.name)
          expect(facetExpanded.value).toEqual(true)
        }
      })
    })

    describe('expandAll', () => {
      it('expands all facets', () => {
        const { expanded, expandAll } = useFacetStore()
        expandAll()

        for (const facet of allFacets) {
          const facetExpanded = expanded(facet.name)
          expect(facetExpanded.value).toEqual(true)
        }
      })

      it('can expand selectively', () => {
        const oddFacets = allFacets.filter((_v, i) => i % 2 != 0)

        const oddFacetNames = oddFacets.map((f) => f.name)
        const { expanded, expandAll } = useFacetStore()
        expandAll(oddFacetNames)

        for (let i = 0; i < oddFacets.length; i++) {
          const facet = allFacets[i]
          const expected = (i % 2 != 0)
          const facetExpanded = expanded(facet.name)
          expect(facetExpanded.value).toEqual(expected)
        }
      })
    })

    describe('collapseAll', () => {
      it('collapses all facets', () => {
        const { expanded, expandAll, collapseAll } = useFacetStore()
        expandAll()

        // just to be sure
        for (const facet of allFacets) {
          const facetExpanded = expanded(facet.name)
          expect(facetExpanded.value).toEqual(true)
        }

        collapseAll()
        for (const facet of allFacets) {
          const facetExpanded = expanded(facet.name)
          expect(facetExpanded.value).toEqual(false)
        }
      })
    })

    describe('facetForName', () => {
      it('returns the facet', () => {
        const { facetForName } = useFacetStore()

        for (const facet of allFacets) {
          const namedFacet = facetForName(facet.name)
          expect(namedFacet).toEqual(facet)
        }
      })

      it('returns undefined for a nonexistent facet', () => {
        const { facetForName } = useFacetStore()

        const facet = allFacets[0]
        const invalidName = `not${facet.name}`

        const namedFacet = facetForName(invalidName)
        expect(namedFacet).toBeUndefined()
      })
    })
  })
})
