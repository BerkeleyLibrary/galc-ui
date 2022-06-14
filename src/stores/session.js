import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSessionStore = defineStore('session', () => {
  // --------------------------------------------------
  // State

  const user = ref(null)

  // --------------------------------------------------
  // Exported functions and properties

  const authenticated = computed(() => !!user.value)

  const admin = computed(() => {
    const userObj = user.value
    return userObj && userObj.galcAdmin
  })

  const exported = { user, authenticated, admin }

  // --------------------------------------------------
  // Store definition

  return exported
})
