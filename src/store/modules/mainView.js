import * as types from '../types'
import * as simTypes from '../simTypes'
// import axios from 'axios'
// This module holds the state of the main graph layout.
// The state contains an array of simulation objects
const state = {
  graphArray: []
}

// getters
const getters = {
  [types.GET_GRAPH_STATE_ARR]: (state) => {
    return state.simArray
  }
}

// actions
const actions = {
  [types.OPEN_NEW_GRAPH]: ({ commit, state }, payload) => {
    // We don't have to do any async operations here, just
    // pass on the payload
    commit(types.PUSH_NEW_GRAPH, payload)
  }
}

// mutations
const mutations = {
  [types.PUSH_NEW_GRAPH]: (state, payload) => {
    // a bit of a hack to avoid the fact that javascript arrays are weird.
    // first we push an empty object to the array, then we find the only empty
    // object in the array and copy our payload there.
    state.simArray.push({ chartID: payload.chartID })
    var newChart = state.simArray.find(el => el.chartID === payload.chartID)
    if (payload.chartType === 'twoDPrtlHist') {
      Object.assign(newChart, simTypes.TWO_D_PRTL_HIST)
      // Set the chartID
      if (payload.simID != null) {
        newChart.sims = [ payload.simID ]
      }
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
