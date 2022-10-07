import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useApiStore } from './api'

export const useClosuresStore = defineStore('closures', () => {
  // --------------------------------------------------
  // State

  const currentClosures = ref([])
  const pastClosures = ref([])
  const editingClosure = ref(null)

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
    return loadCurrentClosures().then(loadPastClosures)
  }

  function newClosure () {
    editClosure({ start_date: null, end_date: null, note: '' })
  }

  function editClosure (closure) {
    // TODO: prevent simultaneous edits?
    editingClosure.value = closure
  }

  function cancelEdit () {
    editingClosure.value = null
  }

  function saveChanges () {
    const cls = editingClosure.value
    if (cls) {
      const { saveClosure } = useApiStore()
      saveClosure(cls)
    }
  }

  const exported = {
    closed,
    reopenDate,
    currentClosures,
    pastClosures,
    activeClosure,
    newClosure,
    editClosure,
    cancelEdit,
    saveChanges,
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

  function getClosuresRef (current) {
    return current ? currentClosures : pastClosures
  }

  function loadClosures (current) {
    const closures = getClosuresRef(current)
    const { loadClosures } = useApiStore()

    const params = { 'filter[current': current }
    return loadClosures(params).then(({ data }) => { closures.value = data })
  }

  // --------------------------------------------------
  // Store definition

  return exported
})
