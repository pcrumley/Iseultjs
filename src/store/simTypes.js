// This is the default state of 2d particle histogram
export const TWO_D_PRTL_HIST = {
  // chartID: 0 Chart ID should be dynamically assigned at runtime
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
    cbarWidth: 20,
  }
}
