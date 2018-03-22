import * as types from '../types'

const state = {
  // A map that contains all of the server information
  nextServerID: 0, // a way to keep the servers uniquely identifiable.
  serverMap: new Map([]),
  serverArr: []
}

// getters
const getters = {
  [types.GET_SERVER_MAP]: (state) => {
    return state.serverMap
  },
  [types.GET_NEXT_SERVER_ID]: (state) => {
    return state.nextServerID
  },
  [types.GET_SERVER_ARR]: (state) => {
    return state.serverArr
  }
}

// actions
const actions = {
  [types.ADD_SERVER]: ({ commit, state }, payload) => {
    // Payload must include server name, url

    commit(types.PUSH_SERVER, payload)
  },
  [types.DEL_SERVER]: ({ commit, state }, payload) => {
    // Payload must include server id
    commit(types.POP_SERVER, payload)
  }

}

// mutations
const mutations = {
  [types.PUSH_SERVER]: (state, payload) => {
    // push the payload into the map
    state.serverMap.set(state.nextServerID, payload)
    state.serverArr.push(state.nextServerID)
    state.nextServerID += 1
  },
  [types.POP_SERVER]: (state, payload) => {
    state.serverMap.delete(payload.id)
    state.serverArr.splice(state.serverArr.findIndex((el) => { return el === payload.id }), 1)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
