import { defineStore } from 'pinia'
import { computed, Ref, ref } from 'vue'
import { useApiStore } from './api'
import { Closure } from "../types/Closure"
import { ClosureResults } from "../types/ClosureResults"

export function newEmptyClosure(): Closure {
  return { startDate: '', note: '' }
}

export const useClosuresStore = defineStore('closures', () => {
  // --------------------------------------------------
  // State

  const closures: Ref<Array<Closure>> = ref([])
  const closurePatch: Ref<Closure | null> = ref(null)

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

  async function init() {
    return reloadClosures()
  }

  function newClosure() {
    closurePatch.value = newEmptyClosure()
  }

  function editClosure(closure: Closure) {
    closurePatch.value = newPatch(closure)
  }

  // TODO: confirmation
  function deleteClosure(closure: Closure) {
    const { deleteClosure } = useApiStore()
    return deleteClosure(closure)
      .then(reloadClosures)
  }

  function cancelEdit() {
    closurePatch.value = null
  }

  function applyEdit(cls: Closure) {
    const { saveClosure } = useApiStore()
    saveClosure(cls).then(reloadClosures).finally(cancelEdit)
  }

  const exported = {
    closed,
    reopenDate,
    closures,
    newClosure,
    closurePatch,
    editClosure,
    deleteClosure,
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

  function reloadClosures() {
    const { loadClosures } = useApiStore()
    return loadClosures().then(({ data }: ClosureResults) => {
      closures.value = data
    })
  }

  function newPatch(cls: Closure) {
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
