import { defineStore } from 'pinia'
import { computed, Ref, ref } from 'vue'
import { User } from "../types/User"
import { Result } from "../types/GalcApi"
import { useWindowLocationStore } from "./window-location"
import { LOGIN_PARAM } from "../helpers/params"

export const useSessionStore = defineStore('session', () => {
  // --------------------------------------------------
  // State

  const user: Ref<User | null> = ref(null)
  const loginSet: Ref<boolean> = ref(false)

  // --------------------------------------------------
  // Exported functions and properties

  async function init() {
    const { readParam } = useWindowLocationStore()

    // TODO: can we just watch window.location?
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
    return userObj ? userObj.galcAdmin : false
  })

  const email = computed(() => {
    const userObj = user.value
    return userObj ? userObj.email : undefined
  })

  function updateUser({ data }: Result<User>) {
    user.value = data
  }

  const exported = { init, doLogin, email, isAuthenticated, isAdmin, updateUser }

  // --------------------------------------------------
  // Store definition

  return exported
})
