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
  // Exported functions and properties

  const currentClosures = computed(() => closures.value.filter(c => c.current))

  const pastClosures = computed(() => closures.value.filter(c => c.past))

  const futureClosures = computed(() => closures.value.filter(c => c.future))

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
    console.log('closurePatch.value = %o', closurePatch.value)
  }

  function editClosure (closure) {
    // TODO: prevent simultaneous edits?
    closurePatch.value = newPatch(closure)
    console.log('closurePatch.value = %o', closurePatch.value)
  }

  function editActiveClosure (closure) {
    const active = activeClosure.value
    if (active) {
      editClosure(active)
    }
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
    currentClosures,
    pastClosures,
    futureClosures,
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
