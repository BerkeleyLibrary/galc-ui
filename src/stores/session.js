import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { deleteParam } from '../helpers/window-location-helper'

export const LOGIN_PARAM = 'login'

export const useSessionStore = defineStore('session', () => {
  // --------------------------------------------------
  // State

  const user = ref(null)
  const loginSet = ref(false)

  // --------------------------------------------------
  // Exported functions and properties

  async function init () {
    const login = deleteParam(LOGIN_PARAM)
    loginSet.value = !!login
  }

  const doLogin = computed(() => {
    if (isAuthenticated.value) {
      return false
    }
    return loginSet.value
  })

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
    // console.log('Initializing session with { %o }', data)
    user.value = data
  }

  const exported = { init, doLogin, user, email, isAuthenticated, isAdmin, updateUser }

  // --------------------------------------------------
  // Store definition

  return exported
})
