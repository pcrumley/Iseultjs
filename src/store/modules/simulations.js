import * as types from '../types'
import axios from 'axios'
// initial state. This holds an array of simulation objects, that can be attached to a graph,
// so they have access to the simulation data
const state = {
  simArray: []
}

// getters
const getters = {
  [types.GET_SIMULATIONS]: (state) => {
    return state.simArray
  }
}

// actions
const actions = {
  [types.OPEN_SIMULATION]: ({ commit, state }, payload) => {
    // Add some AJAX here that would open the sim from the server & give us
    // some info about what sim... until then
    // load the simulation data
    axios.get(payload.serverURL + '/api/openSim/' + '?sim_type=' + payload.simType + '&outdir=' + payload.outdir)
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
    // a bit of a hack to avoid the fact that javascript arrays are weird.
    // first we push an empty object to the array, then we find the only empty
    // object in the array and copy our payload there.
    state.simArray.push({})
    Object.assign(state.simArray.find(el => Object.keys(el).length === 0), payload)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
