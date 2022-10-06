import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { deleteParam } from '../helpers/window-location-helper'

export const LOGIN_PARAM = 'login'

export const useSessionStore = defineStore('session', () => {
  // --------------------------------------------------
  // State

  const doLogin = ref(false)
  const user = ref(null)

  // --------------------------------------------------
  // Exported functions and properties

  async function init () {
    // console.log('session.init()')
    const login = deleteParam(LOGIN_PARAM)
    doLogin.value = !!login
  }

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
