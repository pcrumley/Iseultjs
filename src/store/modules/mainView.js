import * as types from '../types'
// import axios from 'axios'
// This module holds the state of the main graph layout.
// The state contains an array of simulation objects
const state = {
  graphUpdated: 0,
  nextChartID: 1,
  chartArr: [],
  twoD_PRTL_HIST: {
    chartType: '2D Histograms',
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
  },
  graphViewStateMap: new Map([])
}

// getters
const getters = {
  [types.GET_GRAPH_STATE_MAP]: (state) => {
    return state.graphViewStateMap
  },
  [types.GET_CHART_ARR]: (state) => {
    return state.chartArr
  },
  [types.GET_NEXT_CHART_ID]: (state) => {
    return state.nextChartID
  },
  [types.GET_CHART_UPDATED]: (state) => {
    return state.graphUpdated
  }
}

// actions
const actions = {
  [types.OPEN_GRAPH]: ({ commit, state }, payload) => {
    // We don't have to do any async operations here, just
    // pass on the payload
    const tmpObj = {
      chartType: payload.chartType,
      chartID: state.nextChartID,
      simID: payload.simID
    }
    commit(types.PUSH_GRAPH, tmpObj)
  },
  [types.ADD_GRAPH]: ({ commit, state }, payload) => {
    // We don't have to do any async operations here, just
    // pass on the payload
    commit(types.PUSH_GRAPH, payload)
  },
  [types.DEL_GRAPH]: ({ commit, state }, payload) => {
    // Payload must include server id
    commit(types.POP_GRAPH, payload)
  },
  [types.UPDATE_CHART]: ({ commit, state }, payload) => {
    commit(types.MUTATE_CHART_OPT, payload)
  },
  [types.TOGGLE_UPDATE]: ({ commit, state }, payload) => {
    // since we mess with the state outside of vuex norms, we
    // have to use this kludgy hack as a way to make the plots
    // reactive.
    commit(types.MARK_UPDATE, payload)
  }
}

// mutations
const mutations = {
  [types.MUTATE_CHART_OPT]: (state, payload) => {
    state.graphViewStateMap.get(payload.chartID).dataOptions[payload.key] = payload.val
  },
  [types.PUSH_GRAPH]: (state, payload) => {
    // a bit of a hack to avoid the fact that javascript arrays are weird.
    // first we push an empty object to the array, then we find the only empty
    // object in the array and copy our payload there.

    if (payload.chartID != null) {
      // There were issues with the setters and getters being copied.
      state.graphViewStateMap.set(payload.chartID, JSON.parse(JSON.stringify(state.twoD_PRTL_HIST)))
      // Set the chartID
      state.graphViewStateMap.get(payload.chartID).sims = [ payload.simID ]
    } else {
      state.chartArr.push(state.nextChartID)
      state.nextChartID += 1
    }
  },
  [types.POP_GRAPH]: (state, payload) => {
    state.graphViewStateMap.delete(payload.id)
    state.chartArr.splice(state.chartArr.findIndex((el) => { return el === payload.id }), 1)
  },
  [types.MARK_UPDATE]: (state, payload) => {
    if (Math.abs(state.graphUpdated) === payload.id) {
      state.graphUpdated *= -1
    } else {
      state.graphUpdated = payload.id
    }
  }

}

export default {
  state,
  getters,
  actions,
  mutations
}
