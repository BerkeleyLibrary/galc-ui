import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSessionStore = defineStore('session', () => {
  // --------------------------------------------------
  // State

  const user = ref(null)

  // --------------------------------------------------
  // Exported functions and properties

  const isAuthenticated = computed(() => !!user.value)

  const isAdmin = computed(() => {
    const userObj = user.value
    return userObj && userObj.galcAdmin
  })

  const email = computed(() => {
    const userObj = user.value
    return userObj && userObj.email
  })

  function updateUser ({ data }) {
    console.log('Initializing session with { %o }', data)
    user.value = data
  }

  const exported = { user, email, isAuthenticated, isAdmin, updateUser }

  // --------------------------------------------------
  // Store definition

  return exported
})
