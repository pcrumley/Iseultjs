import * as types from '../types'
// import axios from 'axios'
// This module holds the state of the main graph layout.
// The state contains an array of simulation objects
const state = {
  graphsUpdated: [],
  nextChartID: 1,
  chartArr: [],
  layout: [],
  twoD_PRTL_HIST: {
    chartType: '2D Prtl Histogram',
    ylabel: '\\gamma_i\\beta_{i,x}',
    xlabel: 'x\\ [c/\\omega_{pe}]',
    curView: ['', '', '', ''],
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
      clip: true,
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
  twoD_PRTL_MOMENT: {
    chartType: '2D Prtl Moments',
    ylabel: '\\gamma_i\\beta_{i,x}',
    xlabel: 'x\\ [c/\\omega_{pe}]',
    curView: ['', '', '', ''],
    dataOptions: {
      prtl_type: 'ions',
      yval: 'y',
      xval: 'x',
      mval: 'px',
      weights: '',
      boolstr: '',
      ybins: 200,
      xbins: 200,
      yvalmin: '',
      yvalmax: '',
      xvalmin: '',
      xvalmax: '',
      cmap: 'viridis',
      cnorm: 'linear',
      pow_zero: 0,
      pow_gamma: 1.0,
      vmin: '',
      vmax: '',
      clip: true,
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
  oneD_PRTL_HIST: {
    chartType: '1D Prtl Histogram',
    ylabel: '\\gamma_i\\beta_{i,x}',
    xlabel: 'x\\ [c/\\omega_{pe}]',
    dataOptions: {
      lineMap: new Map([[0,
        { name: 'Line 1',
          color: '#4e79a7',
          prtl_type: 'ions',
          xval: 'x',
          weights: '',
          boolstr: '',
          xbins: 50,
          xvalmin: '',
          xvalmax: ''
        }
      ]]),
      normhist: true,
      xscale: 'linear'
    },
    curView: ['', '', '', ''],
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
  oneD_PRTL_MOMENT: {
    chartType: '1D Prtl Moments',
    ylabel: '\\gamma_i\\beta_{i,x}',
    xlabel: 'x\\ [c/\\omega_{pe}]',
    dataOptions: {
      lineMap: new Map([[0,
        { name: 'Line 1',
          color: '#4e79a7',
          prtl_type: 'electrons',
          yval: 'px',
          xval: 'x',
          weights: '',
          boolstr: '',
          xbins: 50,
          xvalmin: '',
          xvalmax: ''
        }
      ]]),
      normhist: true,
      xscale: 'linear'
    },
    curView: ['', '', '', ''],
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
  [types.GET_UPDATED_CHARTS]: (state) => {
    return state.graphsUpdated
  },
  [types.GET_CHART_LAYOUT]: (state) => {
    return state.layout
  }
}

// actions
const actions = {
  [types.SET_CUR_VIEW]: ({ commit, state }, payload) => {
    commit(types.MUTATE_CUR_VIEW, payload)
  },
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
    if (payload.sim != null) {
      commit(types.MARK_SIM_UPDATE, {ids: [payload.sim]})
    }
  },
  [types.CHANGE_CHART_TYPE]: ({ commit, state }, payload) => {
    commit(types.MUTATE_CHART_TYPE, payload)
  },
  [types.TOGGLE_UPDATE]: ({ commit, state }, payload) => {
    // since we mess with the state outside of vuex norms, we
    // have to use this kludgy hack as a way to make the plots
    // reactive.
    commit(types.MARK_UPDATE, payload)
  },
  [types.GO_HOME]: ({ commit, state }) => {
    var i
    for (i = 0; i < state.chartArr.length; i++) {
      commit(types.MUTATE_CHART_OPT, {chartID: state.chartArr[i], keepView: ''})
    }
    commit(types.MARK_UPDATE, {})
  }
}

// mutations
const mutations = {
  [types.UPDATE_LAYOUT]: (state, payload) => {
    state.layout = payload
  },
  [types.MUTATE_CHART_TYPE]: (state, payload) => {
    if (payload.chartType === '2D Prtl Histogram') {
      state.graphViewStateMap.set(payload.chartID, JSON.parse(JSON.stringify(state.twoD_PRTL_HIST)))
      state.graphViewStateMap.get(payload.chartID).sims = [ payload.simID ]
    } else if (payload.chartType === '2D Prtl Moments') {
      state.graphViewStateMap.set(payload.chartID, JSON.parse(JSON.stringify(state.twoD_PRTL_MOMENT)))
      state.graphViewStateMap.get(payload.chartID).sims = [ payload.simID ]
    } else if (payload.chartType === '1D Prtl Histogram') {
      state.graphViewStateMap.set(payload.chartID, JSON.parse(JSON.stringify(state.oneD_PRTL_HIST)))
      state.graphViewStateMap.get(payload.chartID).sims = [ payload.simID ]
      // Map isn't deep copied correctly. Hack to fix
      state.graphViewStateMap.get(payload.chartID).dataOptions.lineMap = new Map()
      state.oneD_PRTL_HIST.dataOptions.lineMap.forEach((val, key) => {
        state.graphViewStateMap.get(payload.chartID).dataOptions.lineMap.set(key, JSON.parse(JSON.stringify(val)))
      })
      state.graphViewStateMap.get(payload.chartID).dataOptions.lineMap.get(0).sim = payload.simID
    } else if (payload.chartType === '1D Prtl Moments') {
      state.graphViewStateMap.set(payload.chartID, JSON.parse(JSON.stringify(state.oneD_PRTL_MOMENT)))
      state.graphViewStateMap.get(payload.chartID).sims = [ payload.simID ]
      // Map isn't deep copied correctly. Hack to fix
      state.graphViewStateMap.get(payload.chartID).dataOptions.lineMap = new Map()
      state.oneD_PRTL_MOMENT.dataOptions.lineMap.forEach((val, key) => {
        state.graphViewStateMap.get(payload.chartID).dataOptions.lineMap.set(key, JSON.parse(JSON.stringify(val)))
      })
      state.graphViewStateMap.get(payload.chartID).dataOptions.lineMap.get(0).sim = payload.simID
    }
  },
  [types.MUTATE_CHART_OPT]: (state, payload) => {
    const tmpChartObj = state.graphViewStateMap.get(payload.chartID)
    if (payload.key != null) {
      if (payload.key === 'lineMap') {
        tmpChartObj.dataOptions.lineMap.clear()
        payload.val.forEach((val, key) => {
          tmpChartObj.dataOptions.lineMap.set(key, JSON.parse(JSON.stringify(val)))
        })
      } else {
        tmpChartObj.dataOptions[payload.key] = payload.val
      }
    }
    if (payload.sim != null) {
      tmpChartObj.sims = [payload.sim]
    }
    // Handle keeping of the view:
    const tmpStr = payload.keepView
    if (tmpStr.search('x0') === -1) {
      tmpChartObj.curView[0] = tmpChartObj.dataOptions['xmin']
    }
    if (tmpStr.search('x1') === -1) {
      tmpChartObj.curView[1] = tmpChartObj.dataOptions['xmax']
    }
    if (tmpStr.search('y0') === -1) {
      tmpChartObj.curView[2] = tmpChartObj.dataOptions['ymin']
    }
    if (tmpStr.search('y1') === -1) {
      tmpChartObj.curView[3] = tmpChartObj.dataOptions['ymax']
    }
    if (payload.hasOwnProperty('xlabel')) {
      tmpChartObj.xlabel = payload.xlabel
    }
    if (payload.hasOwnProperty('ylabel')) {
      tmpChartObj.ylabel = payload.ylabel
    }
  },
  [types.MUTATE_RENDER_OPTS]: (state, payload) => {
    state.graphViewStateMap.get(payload.chartID).renderOptions.tot_width = payload.wVal
    state.graphViewStateMap.get(payload.chartID).renderOptions.tot_height = payload.hVal
  },
  [types.MUTATE_CUR_VIEW]: (state, payload) => {
    const tmpViewArr = state.graphViewStateMap.get(payload.id).curView
    tmpViewArr[0] = payload.view[0]
    tmpViewArr[1] = payload.view[1]
    tmpViewArr[2] = payload.view[2]
    tmpViewArr[3] = payload.view[3]
    state.graphsUpdated = [payload.id]
  },
  [types.PUSH_GRAPH]: (state, payload) => {
    // a bit of a hack to avoid the fact that javascript arrays are weird.
    // first we push an empty object to the array, then we find the only empty
    // object in the array and copy our payload there.

    if (payload.chartID != null) {
      // There were issues with the setters and getters being copied.
      // Set the chartID
      if (payload.chartType === '2D Prtl Histogram') {
        state.graphViewStateMap.set(payload.chartID, JSON.parse(JSON.stringify(state.twoD_PRTL_HIST)))
        state.graphViewStateMap.get(payload.chartID).sims = [ payload.simID ]
      } else if (payload.chartType === '1D Prtl Histogram') {
        state.graphViewStateMap.set(payload.chartID, JSON.parse(JSON.stringify(state.oneD_PRTL_HIST)))
        // Map isn't deep copied correctly. Hack to fix
        state.graphViewStateMap.get(payload.chartID).dataOptions.lineMap = new Map()
        state.oneD_PRTL_HIST.dataOptions.lineMap.forEach((val, key) => {
          state.graphViewStateMap.get(payload.chartID).dataOptions.lineMap.set(key, JSON.parse(JSON.stringify(val)))
        })
        state.graphViewStateMap.get(payload.chartID).sims = [ payload.simID ]
        state.graphViewStateMap.get(payload.chartID).dataOptions.lineMap.get(0).sim = payload.simID
      } else if (payload.chartType === '2D Prtl Moments') {
        state.graphViewStateMap.set(payload.chartID, JSON.parse(JSON.stringify(state.twoD_PRTL_MOMENT)))
        state.graphViewStateMap.get(payload.chartID).sims = [ payload.simID ]
      } else if (payload.chartType === '1D Prtl Moments') {
        state.graphViewStateMap.set(payload.chartID, JSON.parse(JSON.stringify(state.oneD_PRTL_MOMENT)))
        // Map isn't deep copied correctly. Hack to fix
        state.graphViewStateMap.get(payload.chartID).dataOptions.lineMap = new Map()
        state.oneD_PRTL_HIST.dataOptions.lineMap.forEach((val, key) => {
          state.graphViewStateMap.get(payload.chartID).dataOptions.lineMap.set(key, JSON.parse(JSON.stringify(val)))
        })
        state.graphViewStateMap.get(payload.chartID).sims = [ payload.simID ]
        state.graphViewStateMap.get(payload.chartID).dataOptions.lineMap.get(0).sim = payload.simID
      }
    } else {
      state.chartArr.push(state.nextChartID)
      state.layout.push({'x': 0, 'y': 0, 'w': 4, 'h': 5, 'i': state.nextChartID.toString()})
      state.nextChartID += 1
    }
  },
  [types.POP_GRAPH]: (state, payload) => {
    state.graphViewStateMap.delete(payload.id)
    state.chartArr.splice(state.chartArr.findIndex((el) => { return el === payload.id }), 1)
    state.layout = state.layout.filter(el => el.i !== payload.id.toString())
  },
  [types.MARK_UPDATE]: (state, payload) => {
    if (payload.ids != null) {
      state.graphsUpdated = payload.ids.filter(el => true)
    } else {
      state.graphsUpdated = state.chartArr.filter(el => true)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
