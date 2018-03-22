import * as types from '../types'
// import axios from 'axios'
// This module is the cache of all the data of the graphs.
// The state contains an array of simulation objects
const state = {
  graphViewStateMap: new Map([[0, {
    sims: [0],
    chartType: 'twoDPrtlHist',
    dataOptions: {
      prtl_type: 'ions',
      yval: 'px',
      xval: 'x',
      weights: '',
      boolstr: '',
      ybins: 200,
      xbins: 200,
      yvalmin: '',
      yvalmax: '',
      xvalmin: '',
      xvalmax: '',
      normhist: true,
      cmap: 'viridis',
      cnorm: 'log',
      pow_zero: 0,
      pow_gamma: 1.0,
      vmin: '',
      vmax: '',
      clip: false,
      xmin: '',
      xmax: '',
      ymin: '',
      ymax: '',
      aspect: 'auto',
      mask_zeros: true,
      interpolation: 'bicubic'},
    renderOptions: {
      tot_width: 800,
      tot_height: 400,
      margin: {
        top: 20,
        right: 60,
        bottom: 70,
        left: 70,
        hspace: 50
      },
      cbarWidth: 20
    }
  }]])
}

// getters
const getters = {
  [types.GET_GRAPH_STATE_MAP]: (state) => {
    return state.graphViewStateMap
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
    state.graphViewStateMap.set(payload.chartID, {})
    if (payload.chartType === 'twoDPrtlHist') {
      Object.assign(state.graphViewStateMap.get(payload.chartID), state.twoD_PRTL_HIST)
      // Set the chartID
      if (payload.simID != null) {
        state.graphViewStateMap.get(payload.chartID).sims = [ payload.simID ]
      } else {
        state.graphViewStateMap.get(payload.chartID).sims = []
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