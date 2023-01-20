import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { User } from "../../src/types/User"
import { useSessionStore } from "../../src/stores/session"
import { LOGIN_PARAM } from "../../src/helpers/params"

// ------------------------------------------------------------
// Fixture

// ------------------------------
// Mock window location store

const readParam = vi.fn()
const windowLocationStore = { readParam }
vi.mock('@/stores/window-location', () => {
  return {
    useWindowLocationStore: () => windowLocationStore
  }
})

// ------------------------------------------------------------
// Tests

describe('session', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('doLogin', () => {
    it('defaults to false', () => {
      const { doLogin } = storeToRefs(useSessionStore())
      expect(doLogin.value).toEqual(false)
    })

    it('returns true if LOGIN_PARAM is set', async () => {
      const sessionStore = useSessionStore()
      const { init } = sessionStore

      readParam.mockImplementationOnce((param) => {
        expect(param).toEqual(LOGIN_PARAM)
        return 'true'
      })

      await init()
      expect(readParam).toHaveBeenCalledOnce()

      const { doLogin } = storeToRefs(sessionStore)
      expect(doLogin.value).toEqual(true)
    })

    it('returns false if already logged in', async () => {
      const sessionStore = useSessionStore()
      const { updateUser, init } = sessionStore

      const user: User = { email: 'student@example.edu', galcAdmin: false }
      updateUser({ data: user })

      readParam.mockImplementationOnce((param) => {
        expect(param).toEqual(LOGIN_PARAM)
        return 'true'
      })

      await init()
      expect(readParam).toHaveBeenCalledOnce()

      const { doLogin } = storeToRefs(sessionStore)
      expect(doLogin.value).toEqual(false)
    })
  })

  describe('isAuthenticted', () => {
    it('defaults to false', () => {
      const { isAuthenticated } = storeToRefs(useSessionStore())
      expect(isAuthenticated.value).toEqual(false)
    })

    it('returns true if user is set', () => {
      const sessionStore = useSessionStore()
      const { updateUser } = sessionStore
      const { isAuthenticated } = storeToRefs(sessionStore)

      const user: User = { email: 'student@example.edu', galcAdmin: false }
      updateUser({ data: user })

      expect(isAuthenticated.value).toEqual(true)
    })
  })

  describe('isAdmin', () => {
    it('defaults to false', () => {
      const { isAdmin } = storeToRefs(useSessionStore())
      expect(isAdmin.value).toEqual(false)
    })

    it('returns true if admin user is set', () => {
      const sessionStore = useSessionStore()
      const { updateUser } = sessionStore
      const { isAdmin } = storeToRefs(sessionStore)

      const user: User = { email: 'admin@example.edu', galcAdmin: true }
      updateUser({ data: user })

      expect(isAdmin.value).toEqual(true)
    })

    it('returns false if non-admin user is set', () => {
      const sessionStore = useSessionStore()
      const { updateUser } = sessionStore
      const { isAdmin } = storeToRefs(sessionStore)

      const user: User = { email: 'student@example.edu', galcAdmin: false }
      updateUser({ data: user })

      expect(isAdmin.value).toEqual(false)
    })
  })

  describe('email', () => {
    it('defaults to empty', () => {
      const { email } = storeToRefs(useSessionStore())
      expect(!!email.value).toEqual(false)
    })
    it("returns the user's email", () => {
      const sessionStore = useSessionStore()
      const { updateUser } = sessionStore

      const expectedEmail = 'student@example.edu'
      const user: User = { email: expectedEmail, galcAdmin: false }
      updateUser({ data: user })

      const { email } = storeToRefs(sessionStore)
      expect(email.value).toEqual(expectedEmail)
    })
  })
})
