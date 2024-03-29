import * as types from '../types'

// initial state
// shape:[ {id, quantity}]
const state = {
  sidebarOpen: false,
  navbarState: ''
}

// getters

const getters = {
  sidebarOpen: state => state.sidebarOpen,
  [types.GET_NAVBAR_STATE]: (state) => state.navbarState
}

// actions
const actions = {
  toggleSidebar ({ commit, state }) {
    commit(types.TOGGLE_SIDEBAR)
  },
  [types.SET_NAVBAR_STATE] ({ commit, state, dispatch }, payload) {
    if (state.navbarState === 'lasso') {
      dispatch(types.DEL_LASSOES)
    }
    commit('mutateNavbar', payload)
  }
}

// mutations
const mutations = {
  [types.TOGGLE_SIDEBAR] (state) {
    state.sidebarOpen = !state.sidebarOpen
  },
  mutateNavbar (state, payload) {
    if (state.navbarState === payload) {
      // Delete old lassos
      state.navbarState = ''
    } else {
      state.navbarState = payload
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
