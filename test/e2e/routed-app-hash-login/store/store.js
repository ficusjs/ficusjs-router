import { createStore } from '../../util/component.js'
import { router } from '../router/router.js'

export const store = createStore('routed-app-hash-login', {
  initialState: {
    userLoggedIn: false,
    user: null
  },
  actions: {
    setUserLoggedIn (context, payload) {
      context.commit('setUserLoggedIn', !!payload)
      context.commit('setUser', payload)
      router.push('/', { user: 'test' })
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
