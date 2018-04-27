<template>
  <div>
  <form>
    <div class="form-row ">
    <div class="form-group col-md-4">
      <label for="chooseColorMap"> Simulation: </label>
      <select class="form-control  " id="chooseSubplotType" v-model="simID">
        <option v-for="(item, key) in simArr" :key="item" :value="item">
          {{ simNames[key] }}
        </option>
      </select>
    </div>
    <div class="form-group col-md-4">
      <label for="chooseColorMap">Colormap</label>
      <select class="form-control" id="chooseCmap"
              v-model="histOptions.cmap">
        <option v-for="item in cmapOpts" :key="item">
          {{ item }}
        </option>
      </select>
    </div>
    <div class="form-group col-md-4">
      <label for="chooseInterpolation">Interpolation</label>
      <select class="form-control" id="chooseInterpolation"
              v-model="histOptions.interpolation">
        <option> bicubic </option>
        <option> nearest </option>
      </select>
    </div>
  </div>
  <div class="form-group form-row">
      <label for="choosePrtl" class="col-form-label col-sm-3"> Particle: </label>
      <select class="form-control col-sm-3" id="particle"
        v-model="histOptions.prtl_type">
        <option v-for="item in prtlTypes" :key="item"> {{ item }} </option>
      </select>
    </div>
    <div class="form-group form-row">
      <label for="chooseX" class="col-form-label col-sm-1" > x: </label>
      <select class="form-control  col-sm-2" id="xval"
        v-model="histOptions.xval">
        <option v-for="item in prtlQuants" :key="item"> {{ item }} </option>
      </select>
      <label for="chooseY" class="col-form-label col-sm-1 offset-sm-1"> y:</label>
      <select class="form-control col-sm-2" id="yval"
        v-model="histOptions.yval">
        <option v-for="item in prtlQuants" :key="item"> {{ item }} </option>
      </select>
      <label for="chooseWeights" class="col-form-label col-sm-2  offset-sm-1"> weights</label>
      <select class="form-control col-sm-2" id="weights"
        v-model="histOptions.weights">
        <option> </option>
        <option v-for="item in prtlQuants" :key="item"> {{ item }} </option>
      </select>
    </div>
  <div class="form-row ">
    <div class="form-group col-md-3">
      <label for="vMin"> vmin </label>
      <input class="form-control" id="vMin"
        v-model.number="histOptions.vmin">
    </div>
    <div class="form-group col-md-3">
      <label for="vMax"> vmax </label>
      <input class="form-control"
        id="vMax" v-model.number="histOptions.vmax">
    </div>
    <div class="form-group col-md-3">
      <label for="xbins"> xbins </label>
      <input type="number" step="1" class="form-control" id="xBins"
        v-model.number="histOptions.xbins">
    </div>
    <div class="form-group col-md-3">
      <label for="ybins"> ybins </label>
      <input type="number" step="1" class="form-control"
        id="ybins" v-model.number="histOptions.ybins">
    </div>
  </div>
  <div class="form-row ">
    <div class="form-group col-md-5">
      <label for="xbins"> Color Norm </label>
      <select class="form-control" id="cnorm"
        v-model="histOptions.cnorm">
        <option> log </option>
        <option> linear </option>
        <option> pow </option>
      </select>
      <small id="powHelp" class="form-text text-muted" v-if="histOptions.cnorm === 'pow'">sign(z-z0)*abs(z-z0)**gamma</small>
    </div>
    <div class="form-group col-md-3 offset-md-1" v-if="histOptions.cnorm === 'pow'">
        <label for="zero"> z0 </label>
        <input class="form-control"
          id="pow_zero" v-model.number="histOptions.pow_zero">
      </div>
      <div class="form-group col-md-3" v-if="histOptions.cnorm === 'pow'">
        <label for="gamma"> gamma </label>
        <input  class="form-control"
          id="pow_gamma" v-model.number="histOptions.pow_gamma">
    </div>
  </div>
  <div class="form-row ">
    <div class="form-group col-md-3">
      <label for="xmin"> xmin </label>
      <input class="form-control" id="xmin"
        v-model.number="histOptions.xmin">
    </div>
    <div class="form-group col-md-3">
      <label for="xmax"> xmax </label>
      <input class="form-control"
        id="xmax" v-model.number="histOptions.xmax">
    </div>
    <div class="form-group col-md-3">
      <label for="ymin"> ymin </label>
      <input class="form-control" id="xBins"
        v-model.number="histOptions.ymin">
    </div>
    <div class="form-group col-md-3">
      <label for="chooseX"> ymax </label>
      <input class="form-control"
        id="ymin" v-model.number="histOptions.ymin">
    </div>
  </div>
  <div class="form-row pb-3">
    <div class="form-check px-3">
      <input class="form-check-input" type="checkbox" v-model="histOptions.normhist" id="NormCheck">
      <label class="form-check-label" for="NormCheck">
        Normalize Hist
      </label>
    </div>
    <div class="form-check px-3">
      <input class="form-check-input" type="checkbox" v-model="histOptions.mask_zeros" id="MaskCheck">
      <label class="form-check-label" for="MaskCheck">
        Mask Zeros
      </label>
    </div>
    <div class="form-check px-3">
      <input class="form-check-input" type="checkbox" v-model="histOptions.clip" id="ClipValues">
      <label class="form-check-label" for="ClipValues">
        Clip Values
      </label>
    </div>
  </div>
  </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as types from '@/store/types'
export default {
  data () {
    return {
      refreshPlot: 0,
      simID: 1,
      histOptions: {
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
        interpolation: 'bicubic'
      }
    }
  },
  methods: {
    ...mapActions({
      addSim: types.OPEN_SIMULATION
    }),
    submitted () {
      this.isSubmitted = true
    }
  },
  computed: {
    ...mapGetters({
      simMap: types.GET_SIM_MAP,
      simArr: types.GET_SIM_ARR,
      simUpdated: types.GET_SIM_UPDATED
    }),
    mySim () {
      const tmpArr = this.simArr.filter(id => id === this.simID)
      if (tmpArr.length === 0) {
        return {data: {cmaps: ['viridis'], prtls: {ions: {quantities: ['x']}}}}
      } else {
        return this.simMap.get(tmpArr[0])
      }
    },
    simNames () {
      var tmpArr = []
      this.simArr.forEach((el) =>
        tmpArr.push(this.simMap.get(el).info.name)
      )
      return tmpArr
    },
    cmapOpts () {
      return this.mySim.data.cmaps
    },
    prtlTypes () {
      return Object.keys(this.mySim.data.prtls)
    },
    prtlQuants () {
      return this.mySim.data.prtls['ions'].quantities
    }
  }
}
</script>

<style>

</style>
