import * as types from '../types'
// import axios from 'axios'
// This module holds the state of the main graph layout.
// The state contains an array of simulation objects
const state = {
  availChartTypes: [
    '2D Prtl Histogram',
    '1D Prtl Histogram',
    '2D Prtl Moments',
    '1D Prtl Moments'
  ] // THIS SHOULD BE SENT BY SERVER PROBABLY... NEED TO THINK ABOUT IT.
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
