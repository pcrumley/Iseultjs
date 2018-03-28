<template>
  <div>
    <form>
      <div class="form-row">
      <div class="form-group col-md-6">
        <label for="chooseColorMap"> Simulation: </label>
        <select class="form-control" id="chooseSubplotType" v-model="simID">
          <option v-for="(item, key) in simArr" :key="item" :value="item">
            {{ simNames[key] }}
          </option>
        </select>
      </div>
      <div class="form-group col-md-6">
        <label for="chooseColorMap">Colormap</label>
        <select class="form-control" id="chooseCmap"
                v-model="histOptions.cmap">
          <option v-for="item in cmapOpts" :key="item">
            {{ item }}
          </option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group col-md-4">
        <label for="choosePrtl"> Particle </label>
        <select class="form-control" id="particle"
          v-model="histOptions.prtl_type">
          <option v-for="item in prtlTypes" :key="item"> {{ item }} </option>
        </select>
      </div>
      <div class="form-group col-md-4">
        <label for="chooseX"> x-value </label>
        <select class="form-control" id="xval"
          v-model="histOptions.xval">
          <option v-for="item in prtlQuants" :key="item"> {{ item }} </option>
        </select>
      </div>
      <div class="form-group col-md-4">
        <label for="chooseY"> y-value </label>
        <select class="form-control" id="yval"
          v-model="histOptions.yval">
          <option v-for="item in prtlQuants" :key="item"> {{ item }} </option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group col-md-4 offset-md-4">
        <label for="xbins"> xBins </label>
        <input type="number" step="1" class="form-control" id="xBins"
          v-model.number="histOptions.xbins">
      </div>
      <div class="form-group col-md-4">
        <label for="chooseX"> yBins </label>
        <input type="number" step="1" class="form-control"
          id="xval" v-model.number="histOptions.ybins">
      </div>
    </div>
    </form>
    <div class="control">
      <button class="button is-primary"  @click="refreshPlot+=1">Refresh</button>
      <button class="button is-primary"  @click="addSim({ simID: 0,
          name: 'TestData',
          serverID: 0,
          serverURL: 'http://localhost:5000',
          simType: 'tristan-mp',
          outdir: './test_output'})">AddSim</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as types from '@/store/types'
export default {
  data () {
    return {
      refreshPlot: 0,
      simID: 0,
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
      simArr: types.GET_SIM_ARR
    }),
    mySim () {
      try {
        return this.simMap.get(this.simID)
      } catch (typeError) {
        return {data: {cmaps: ['viridis'], prtls: {ions: {quantities: ['x']}}}}
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
