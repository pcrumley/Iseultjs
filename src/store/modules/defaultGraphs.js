import * as types from '../types'
// import axios from 'axios'
// This module holds the state of the main graph layout.
// The state contains an array of simulation objects
const state = {
  twoD_PRTL_HIST: {
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
  }
}

// getters
const getters = {
  [types.DEFAULT_TWOD_PRTL_HIST]: (state) => {
    return state.twoD_PRTL_HIST
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
