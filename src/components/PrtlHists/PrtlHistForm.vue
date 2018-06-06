<template>
  <div>
  <form>
    <div class="form-row ">
    <div class="form-group col-md-4">
      <label for="chooseSimulation">
        Simulation:
      </label>
      <select class="form-control"
        id="chooseSimulation"
        v-model="simID"
        @change="updatePlot({sim: simID})">
        <option v-for="(item, key) in simArr" :key="item" :value="item">
          {{ simNames[key] }}
        </option>
      </select>
    </div>
    <div class="form-group col-md-4">
      <label for="chooseColorMap">Colormap</label>
      <select class="form-control" id="chooseCmap"
              v-model="histOptions.cmap" @change="updatePlot({key:'cmap'})">
        <option v-for="item in cmapOpts" :key="item">
          {{ item }}
        </option>
      </select>
    </div>
    <div class="form-group col-md-4">
      <label for="chooseInterpolation">Interpolation</label>
      <select class="form-control" id="chooseInterpolation"
              v-model="histOptions.interpolation" @change="updatePlot({key:'interpolation'})">
        <option> bicubic </option>
        <option> nearest </option>
      </select>
    </div>
  </div>
  <div class="form-group form-row">
      <label for="choosePrtl" class="col-form-label col-sm-3">
        Particle:
      </label>
      <select class="form-control col-sm-3"
        id="particle"
        v-model="histOptions.prtl_type"
        @change="updatePlot({key: 'prtl_type', keepView: ''})">
        <option v-for="item in prtlTypes" :key="item"> {{ item }} </option>
      </select>
    </div>
    <div class="form-group form-row">
      <label for="chooseX" class="col-form-label col-sm-1" >
        x:
      </label>
      <select class="form-control col-sm-2"
        id="xval"
        v-model="histOptions.xval"
        @change="updatePlot({key:'xval', keepView:'y0y1'})">
        <option v-for="item in prtlQuants" :key="item"> {{ item }} </option>
      </select>
      <label for="chooseY" class="col-form-label col-sm-1 offset-sm-1"> y:</label>
      <select
        class="form-control col-sm-2"
        id="yval"
        v-model="histOptions.yval"
        @change="updatePlot({key:'yval', keepView:'x0x1'})">
        <option v-for="item in prtlQuants" :key="item"> {{ item }} </option>
      </select>
      <label for="chooseWeights" class="col-form-label col-sm-2  offset-sm-1"> weights</label>
      <select class="form-control col-sm-2" id="weights"
        v-model="histOptions.weights" @change="updatePlot({key:'weights'})">
        <option> </option>
        <option v-for="item in prtlQuants" :key="item"> {{ item }} </option>
      </select>
    </div>
  <div class="form-row ">
    <div class="form-group col-md-3">
      <label for="vMin"> vmin </label>
      <input class="form-control" id="vMin"
        v-model.number="histOptions.vmin" @change="updatePlot({key:'vmin'})">
    </div>
    <div class="form-group col-md-3">
      <label for="vMax"> vmax </label>
      <input class="form-control"
        id="vMax" v-model.number="histOptions.vmax" @change="updatePlot({key:'vmax'})">
    </div>
    <div class="form-group col-md-3">
      <label for="xbins"> xbins </label>
      <input type="number" step="1" class="form-control" id="xBins"
        v-model.number="histOptions.xbins" @change="updatePlot({key: 'xbins'})">
    </div>
    <div class="form-group col-md-3">
      <label for="ybins"> ybins </label>
      <input type="number" step="1" class="form-control"
        id="ybins" v-model.number="histOptions.ybins" @change="updatePlot({key:'ybins'})">
    </div>
  </div>
  <div class="form-row ">
    <div class="form-group col-md-5">
      <label for="cnorm"> Color Norm </label>
      <select class="form-control" id="cnorm"
        v-model="histOptions.cnorm" @change="updatePlot({key:'cnorm'})">
        <option> log </option>
        <option> linear </option>
        <option> pow </option>
      </select>
      <small id="powHelp" class="form-text text-muted" v-if="histOptions.cnorm === 'pow'">sign(z-z0)*abs(z-z0)**gamma</small>
    </div>
    <div class="form-group col-md-3 offset-md-1" v-if="histOptions.cnorm === 'pow'">
        <label for="zero"> z0 </label>
        <input class="form-control"
          id="pow_zero" v-model.number="histOptions.pow_zero" @change="updatePlot({key: 'pow_zero'})">
      </div>
      <div class="form-group col-md-3" v-if="histOptions.cnorm === 'pow'">
        <label for="gamma"> gamma </label>
        <input  class="form-control"
          id="pow_gamma" v-model.number="histOptions.pow_gamma" @change="updatePlot({key: 'pow_gamma'})">
    </div>
  </div>
  <div class="form-row ">
    <div class="form-group col-md-3">
      <label for="xmin"> xmin </label>
      <input class="form-control" id="xmin"
        v-model.number="histOptions.xmin" @change="updatePlot({key: 'xmin', keepView: 'x1y0y1'})">
    </div>
    <div class="form-group col-md-3">
      <label for="xmax"> xmax </label>
      <input class="form-control"
        id="xmax" v-model.number="histOptions.xmax" @change="updatePlot({key: 'xmax', keepView: 'x0y0y1'})">
    </div>
    <div class="form-group col-md-3">
      <label for="ymin"> ymin </label>
      <input class="form-control" id="xBins"
        v-model.number="histOptions.ymin" @change="updatePlot({key:'ymin', keepView:'x0x1y1'})">
    </div>
    <div class="form-group col-md-3">
      <label for="chooseX"> ymax </label>
      <input class="form-control"
        id="ymin" v-model.number="histOptions.ymax" @change="updatePlot({key:'ymax', keepView:'x0x1y0'})">
    </div>
  </div>
  <div class="form-row ">
    <div class="form-group col-md-12">
      <label for="BoolString"> Boolean String </label>
      <input class="form-control"
        id="ymin" v-model="histOptions.boolstr" @change="updatePlot({key:'boolstr'})">
      <small id="boolStrHelp" class="form-text text-muted" >e.g. [x.ge.40]AND[x.le.60]</small>
      </div>

  </div>
  <div class="form-row pb-3">
    <div class="form-check px-3">
      <input
        class="form-check-input"
        type="checkbox"
        v-model="histOptions.normhist"
        id="NormCheck" @change="updatePlot({key:'normhist'})">
      <label class="form-check-label" for="NormCheck">
        Normalize Hist
      </label>
    </div>
    <div class="form-check px-3">
      <input
        class="form-check-input"
        type="checkbox"
        v-model="histOptions.mask_zeros"
        @change="updatePlot({key: 'mask_zeros'})"
        id="MaskCheck">
      <label class="form-check-label" for="MaskCheck">
        Mask Zeros
      </label>
    </div>
    <div class="form-check px-3">
      <input
        class="form-check-input"
        type="checkbox"
        v-model="histOptions.clip"
        @change="updatePlot({key: 'clip'})"
        id="ClipValues">
      <label class="form-check-label" for="ClipValues">
        Clip Values
      </label>
    </div>
  </div>
  <!--<div class="form-row pb-3">
    <div class="form-check px-3">
      <input
        class="form-check-input"
        type="checkbox"
        v-model="histOptions.aspect"
        id="ApsectCheck" @change="updatePlot({key:'aspect'})">
      <label class="form-check-label" for="AspectCheck">
        Aspect = 1
      </label>
    </div>
  </div> -->
  </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as types from '@/store/types'
export default {
  data () {
    return {
      simID: 1,
      histOptions: {}
    }
  },
  props: ['chartId'],
  methods: {
    ...mapActions({
      addSim: types.OPEN_SIMULATION,
      toggleGraph: types.TOGGLE_UPDATE,
      updateChartOptions: types.UPDATE_CHART
    }),
    updatePlot (payload) {
      // WE NEED TO ADD SOME HANDLERS FOR CHANGING SIM
      const tmpObj = {keepView: 'x0x1y0y1'}
      if (payload.hasOwnProperty('keepView')) {
        tmpObj.keepView = payload.keepView
      }
      if (payload.hasOwnProperty('sim')) {
        tmpObj.sim = payload.sim
      }
      if (payload.hasOwnProperty('key')) {
        tmpObj.key = payload.key
        tmpObj.val = this.histOptions[payload.key]
      }
      tmpObj.chartID = this.chartId
      this.updateChartOptions(tmpObj)
      this.toggleGraph({ids: [this.chartId]})
    },
    submitted () {
      this.isSubmitted = true
    }
  },
  computed: {
    ...mapGetters({
      simMap: types.GET_SIM_MAP,
      simArr: types.GET_SIM_ARR,
      chartMap: types.GET_GRAPH_STATE_MAP
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
  },
  created: function () {
    this.histOptions = JSON.parse(JSON.stringify(this.chartMap.get(this.chartId).dataOptions))
    this.simID = this.chartMap.get(this.chartId).sims[0]
  }
}
</script>

<style>

</style>
