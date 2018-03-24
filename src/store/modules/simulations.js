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
  // simMap: new Map() // we keep an ID here to keep the keys unique
  // EVENTUALLY WE WILL LOAD THIS STATE FROM A SERVER, BUT WE KEEP IT THIS WAY
  // FOR TESTING PURPOSES
  simArr: [0],
  simMap: new Map([[0, { i: 2,
    info: {name: 'TestData',
      serverID: 0,
      serverName: 'My Computer',
      simType: 'tristan-mp',
      outdir: './test_output'
    },
    data: {
      cmaps: [
        'Spectral',
        'rainbow',
        'RdYlGn',
        'coolwarm',
        'temperature',
        'gnuplot',
        'PuOr',
        'Blue-Black-Red',
        'viridis',
        'Blue-Black-Yellow',
        'RdBu',
        'hot',
        'PiYG',
        'magma',
        'PRGn',
        'BuYlRd',
        'gnuplot2',
        'inferno',
        'plasma',
        'Blue/Green/Yellow/Red',
        'winter'
      ],
      fileArray: [1, 2, 3],
      prtls: {
        electrons: {
          axisLabels: [
            'x\\ [c/\\omega_{pe}]',
            'y\\ [c/\\omega_{pe}]',
            'z\\ [c/\\omega_{pe}]',
            '\\gamma_e\\beta_{x,e}',
            '\\gamma_e\\beta_{y,e}',
            '\\gamma_e\\beta_{z,e}',
            '\\gamma_e',
            '\\mathrm{proc_e}',
            '\\mathrm{ind_e}'
          ],
          quantities: [
            'x',
            'y',
            'z',
            'px',
            'py',
            'pz',
            'gamma',
            'proc',
            'index'
          ],
          histLabel: 'f_e(p)'
        },
        ions: {
          axisLabels: [
            'x\\ [c/\\omega_{pe}]',
            'y\\ [c/\\omega_{pe}]',
            'z\\ [c/\\omega_{pe}]',
            '\\gamma_i\\beta_{i,x}',
            '\\gamma_i\\beta_{i,y}',
            '\\gamma_i\\beta_{i,z}',
            '\\gamma_i',
            '\\mathrm{proc_i}',
            '\\mathrm{ind_i}'
          ],
          quantities: [
            'x',
            'y',
            'z',
            'px',
            'py',
            'pz',
            'gamma',
            'proc',
            'index'
          ],
          histLabel: 'f_e(p)'
        }
      }
    }
  }]])
}

// getters
const getters = {
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
    axios.get(payload.serverURL + '/api/openSim/' + '?sim_type=' + payload.simType + '&outdir=' + '\'' + payload.outdir + '\'')
      .then(function (response) {
        var simObj = { info: {}, data: {} }
        Object.assign(simObj.info, payload)
        Object.assign(simObj.data, response.data)
        commit(types.PUSH_SIMULATION, simObj)
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  [types.DEL_SIMULATION]: ({ commit, state }, payload) => {
    // Payload must include server id
    commit(types.POP_SIMULATION, payload)
  }
}

// mutations
const mutations = {
  [types.PUSH_SIMULATION]: (state, payload) => {
    // push the payload into the map
    state.simMap.set(state.nextSimID, Object.assign({}, payload))
    state.simArr.push(state.nextSimID)
    state.nextSimID += 1
  },
  [types.POP_SIMULATION]: (state, payload) => {
    state.simMap.delete(payload.id)
    state.simArr.splice(state.simArr.findIndex((el) => { return el === payload.id }), 1)
  }

}

export default {
  state,
  getters,
  actions,
  mutations
}
