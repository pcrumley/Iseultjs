import * as types from '../types'

const state = {
  // A map that contains all of the server information
  nextServerID: 0, // a way to keep the servers uniquely identifiable.
  serverMap: new Map([])
}

// getters
const getters = {
  [types.GET_SERVER_MAP]: (state) => {
    return state.serverMap
  },
  [types.GET_NEXT_SERVER_ID]: (state) => {
    return state.nextServerID
  }
}

// actions
const actions = {
  [types.ADD_SERVER]: ({ commit, state }, payload) => {
    // Payload must include server name, url

    commit(types.PUSH_SERVER, payload)
  },
  [types.DEL_SERVER]: ({ commit, state }, payload) => {
    // Payload must include server name, url
    commit(types.POP_SERVER, {id: payload.serverID})
  }

}

// mutations
const mutations = {
  [types.PUSH_SERVER]: (state, payload) => {
    // push the payload into the map
    console.log(payload)
    state.serverMap.set(state.nextServerID, payload)
    state.nextServerID += 1
  },
  [types.POP_SERVER]: (state, payload) => {
    state.serverMap.delete(payload.id)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
