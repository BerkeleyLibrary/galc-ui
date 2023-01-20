import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePreviewStore } from "../../src/stores/preview"
import { Item } from "../../src/types/Item"

describe('preview', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('currentPreview', () => {
    it('is initially unset', () => {
      const { currentPreview } = storeToRefs(usePreviewStore())
      const preview = currentPreview.value
      expect(preview).toBeFalsy()
    })
  })

  describe('startPreview', () => {
    it('starts a preview', () => {
      const previewStore = usePreviewStore()

      const item: Item = { title: 'Test', suppressed: false, terms: [] }
      const { startPreview } = previewStore
      startPreview(item)

      const { currentPreview } = storeToRefs(usePreviewStore())
      const preview = currentPreview.value
      expect(preview).toEqual(item)
    })
  })

  describe('endPreview', () => {
    it('ends a preview', () => {
      const previewStore = usePreviewStore()
      const { endPreview } = previewStore
      const { currentPreview } = storeToRefs(usePreviewStore())

      const item: Item = { title: 'Test', suppressed: false, terms: [] }
      currentPreview.value = item

      endPreview()
      const preview = currentPreview.value
      expect(preview).toBeFalsy()
    })
  })
})
