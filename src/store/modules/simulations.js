import * as types from '../types'
import axios from 'axios'

// initial state. This holds an array of simulation objects
const state = {
  simArray: []
}

// getters
const getters = {
  [types.GET_SIMULATIONS]: (state) => {
    return state.simArray
  }
  /* if (state.simArray.length > 0) {
    return state.simArray[0]
  } else {
    return {data: {cmaps: ['viridis'], prtls: {ions: {quantities: ['x'], axisLabel: ['x']}}}}
  }
} */
}

// actions
const actions = {
  [types.AJAX_SIMULATION]: ({ commit, state }, payload) => {
    // Add some AJAX here that would open the sim from the server & give us
    // some info about what sim... until then
    // load the simulation data
    axios.get(payload.serverURL + '/api/openSim/' + '?sim_type=' + payload.simType)
      .then(function (response) {
        var simObj = { info: {}, data: {} }
        Object.assign(simObj.info, payload)
        Object.assign(simObj.data, response.data)
        commit(types.PUSH_SIMULATION, simObj)
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}

// mutations
const mutations = {
  [types.PUSH_SIMULATION]: (state, payload) => {
    state.simArray.push({})
    Object.assign(state.simArray[0], payload)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
