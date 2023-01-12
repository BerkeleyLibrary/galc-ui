import { defineStore } from 'pinia'
import { computed, Ref, ref } from 'vue'
import { readParam } from '../helpers/window-location-helper'
import { User } from "../User"
import { Result } from "../types/GalcApi"

export const LOGIN_PARAM = 'login'

export const useSessionStore = defineStore('session', () => {
  // --------------------------------------------------
  // State

  const user: Ref<User|null> = ref(null)
  const loginSet: Ref<boolean> = ref(false)

  // --------------------------------------------------
  // Exported functions and properties

  async function init () {
    // TODO: don't clear this on login
    const login = readParam(LOGIN_PARAM)
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

  function updateUser ({ data }: Result<User>) {
    if (data) {
      user.value = data
    }
  }

  const exported = { init, doLogin, user, email, isAuthenticated, isAdmin, updateUser }

  // --------------------------------------------------
  // Store definition

  return exported
})
