import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useApiStore } from './api'

export function newEmptyClosure () {
  return { id: null, startDate: null, endDate: null, note: '' }
}

export const useClosuresStore = defineStore('closures', () => {
  // --------------------------------------------------
  // State

  const currentClosures = ref([])
  const pastClosures = ref([])
  const closurePatch = ref(null)

  // --------------------------------------------------
  // Exported functions and properties

  const closed = computed(() => {
    return !!activeClosure.value
  })

  const reopenDate = computed(() => {
    const cls = activeClosure.value
    return cls && cls.endDate
  })

  const activeClosure = computed(() => {
    const cc = currentClosures.value
    if (Array.isArray(cc) && cc.length > 0) {
      return cc[0]
    }
    return null
  })

  async function init () {
    return reloadClosures()
  }

  function createClosure () {
    // TODO: prevent simultaneous edits?
    closurePatch.value = newEmptyClosure()
  }

  function editClosure (closure) {
    // TODO: prevent simultaneous edits?
    closurePatch.value = newPatch(closure)
  }

  function editActiveClosure (closure) {
    const active = activeClosure.value
    if (active) {
      editClosure(active)
    }
  }

  function cancelEdit () {
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
    currentClosures,
    pastClosures,
    activeClosure,
    createClosure,
    closurePatch,
    editClosure,
    editActiveClosure,
    cancelEdit,
    applyEdit,
    init
  }

  // --------------------------------------------------
  // Internal functions and properties

  function loadCurrentClosures () {
    return loadClosures(true)
  }

  function loadPastClosures () {
    return loadClosures(false)
  }

  function reloadClosures () {
    return loadCurrentClosures().then(loadPastClosures)
  }

  function getClosuresRef (current) {
    return current ? currentClosures : pastClosures
  }

  function loadClosures (current) {
    const closures = getClosuresRef(current)
    const { loadClosures } = useApiStore()

    const params = { 'filter[current': current }
    return loadClosures(params).then(({ data }) => {
      closures.value = data
      console.log('loadClosures(%o): %o', current, data)
    })
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
