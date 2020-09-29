import { createStore } from '../util/component.js'
import { getRouter } from '../../../src/router.js'

let store = null

export function getStore () {
  if (!store) {
    store = createStore('routed-app-login', {
      initialState: {
        userLoggedIn: false,
        user: null
      },
      actions: {
        setUserLoggedIn (context, payload) {
          context.commit('setUserLoggedIn', !!payload)
          context.commit('setUser', payload)
          getRouter().push('/test/e2e/routed-app-login')
        }
      },
      mutations: {
        setUserLoggedIn (state, payload) {
          state.userLoggedIn = payload
          return state
        },
        setUser (state, payload) {
          state.user = payload
          return state
        }
      }
    })
  }
  return store
}
