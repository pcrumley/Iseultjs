import * as types from '../types'
import axios from 'axios'

// initial state. This holds an array of simulation objects, that can be attached to a graph,
// so they have access to the simulation data

// Each simObject has the following setup:
// { i: 10 // the timestep we want to output it looks at simObj.data.fileArray[i]
//   info: { STUFF ABOUT HOW TO ACCESS THE SIMULATION }
//   data: { THINGS WE HAVE TO TALK TO THE SERVER FOR }}

// Inside of the info you should find:
// { simID: 0, The ID of where the sim lives in the SimMap
//   name: 'TestData', The name of the sim
//   serverID: 0, The ID of the server
//   serverURL: 'http://localhost:5000', The URL of the server
//   simType: 'tristan-mp', The simulation type
//   outdir: './test_output' The directory of the output files on the server}

// Inside of the data prop you should find:
// { cmaps: an array of the available cmaps
//   fileArray: an array of the available output numbers
//   prtls: an object with {prtl_type: axisLabel: [ARRAY OF AXIS LABELS], quantities: [ARRAY OF QUANTITIES]}
//   serverURL: 'http://localhost:5000', The URL of the server
//   simType: 'tristan-mp', The simulation type
//   outdir: './test_output' The directory of the output files on the server}

const state = {
  nextSimID: 1,
  // We use simUpdated to tell us when properties of a sim are changed, basically
  // an event bus. Right now we set simUpdated equal to the sim ID of the sim
  // that changed, using the sign as a toggle.
  simsUpdated: [0],
  // simMap: new Map() // we keep an ID here to keep the keys unique
  // EVENTUALLY WE WILL LOAD THIS STATE FROM A SERVER, BUT WE KEEP IT THIS WAY
  // FOR TESTING PURPOSES
  simArr: [],
  simMap: new Map([])
}

// getters
const getters = {
  [types.GET_SIM_UPDATED]: (state) => {
    return state.simsUpdated
  },
  [types.GET_SIM_MAP]: (state) => {
    return state.simMap
  },
  [types.GET_SIM_ARR]: (state) => {
    return state.simArr
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
        var simObj = { info: {}, data: {}, i: 0 }
        Object.assign(simObj.info, payload)
        Object.assign(simObj.data, response.data)
        simObj.i = simObj.data.fileArray.length - 1
        commit(types.PUSH_SIMULATION, simObj)
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  [types.DEL_SIMULATION]: ({ commit, state }, payload) => {
    // Payload must include server id
    commit(types.POP_SIMULATION, payload)
  },
  [types.CHANGE_SIM_TSTEP]: ({ commit, state }, payload) => {
    // Payload must include simID
    commit(types.MUTATE_TSTEP, payload)
    commit(types.MARK_SIM_UPDATE, {ids: [payload.id]})
  }
}

// mutations
const mutations = {
  [types.PUSH_SIMULATION]: (state, payload) => {
    // push the payload into the map
    state.simMap.set(state.nextSimID, Object.assign({}, payload))
    state.simArr.push(state.nextSimID)
    // state.simUpdated = payload.id
    state.simUpdated = state.nextSimID
    state.nextSimID += 1
  },
  [types.POP_SIMULATION]: (state, payload) => {
    state.simMap.delete(payload.id)
    state.simArr.splice(state.simArr.findIndex((el) => { return el === payload.id }), 1)
    /* if (Math.abs(state.simUpdated) === payload.id) {
      state.simUpdated *= -1
    } else {
      state.simUpdated = payload.id
    }
    */
  },
  [types.MUTATE_TSTEP]: (state, payload) => {
    state.simMap.get(payload.id).i = payload.ind
  },
  [types.MARK_SIM_UPDATE]: (state, payload) => {
    if (payload.ids != null) {
      state.simsUpdated = payload.ids.filter(el => true)
    } else {
      state.simsUpdated = state.simArr.filter(el => true)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
