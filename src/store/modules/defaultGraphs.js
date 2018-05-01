import * as types from '../types'
// import axios from 'axios'
// This module holds the state of the main graph layout.
// The state contains an array of simulation objects
const state = {
  availChartTypes: ['2D Histograms'] // THIS SHOULD BE SENT BY SERVER PROBABLY... NEED TO THINK ABOUT IT.
}

// getters
const getters = {
  [types.AVAIL_CHART_TYPES]: (state) => {
    return state.availChartTypes
  }
}

// actions

// mutations

export default {
  state,
  getters// ,
  // actions,
  // mutations
}
