import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useApiStore } from './api'

export function newEmptyClosure () {
  return { id: null, startDate: null, endDate: null, note: '' }
}

export const useClosuresStore = defineStore('closures', () => {
  // --------------------------------------------------
  // State

  const closures = ref([])
  const closurePatch = ref(null)

  // --------------------------------------------------
  // Exported computed properties

  const currentClosures = computed(() => closures.value.filter(c => c.current))

  const closed = computed(() => {
    const cc = currentClosures.value
    return Array.isArray(cc) && cc.length > 0
  })

  const reopenDate = computed(() => {
    const cls = activeClosure.value
    return cls && cls.endDate
  })

  // --------------------------------------------------
  // Exported functions

  async function init () {
    return reloadClosures()
  }

  function createClosure () {
    // TODO: prevent simultaneous edits?
    closurePatch.value = newEmptyClosure()
    console.log('closurePatch.value = %o', closurePatch.value)
  }

  function editClosure (closure) {
    // TODO: prevent simultaneous edits?
    closurePatch.value = newPatch(closure)
    console.log('closurePatch.value = %o', closurePatch.value)
  }

  function cancelEdit () {
    console.log('setting closurePatch.value to null')
    closurePatch.value = null
  }

  function applyEdit (cls) {
    if (cls) {
      const { saveClosure } = useApiStore()
      saveClosure(cls).then(reloadClosures).finally(cancelEdit)
    }
  }

  const exported = {
    closed,
    reopenDate,
    closures,
    createClosure,
    closurePatch,
    editClosure,
    cancelEdit,
    applyEdit,
    init
  }

  // --------------------------------------------------
  // Internal computed properties

  const activeClosure = computed(() => {
    const cc = currentClosures.value
    const hasCurrent = Array.isArray(cc) && cc.length > 0
    return hasCurrent ? cc[0] : null
  })

  // --------------------------------------------------
  // Internal functions

  function reloadClosures () {
    const { loadClosures } = useApiStore()
    return loadClosures().then(({ data }) => { closures.value = data })
  }

  function newPatch (cls) {
    return {
      id: cls.id,
      note: cls.note,
      startDate: cls.startDate,
      endDate: cls.endDate
    }
  }

  // --------------------------------------------------
  // Store definition

  return exported
})
