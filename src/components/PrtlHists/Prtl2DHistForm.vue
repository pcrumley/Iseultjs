<template>
  <div>
    <iseult-image-graph :histOpts="histOptions" :myRefresh="refreshPlot" />
    <hr>
    <div class="field is-grouped is-grouped-multiline">
      <div class="field">
        <label class="label">Colormap</label>
        <div class="select control">
          <select id="cmap"
                  v-model="histOptions.cmap">>
            <option v-for="item in cmapOpts" :key="item"> {{ item }} </option>
          </select>
        </div>
      </div>
      <div class="field">
        <label class="label">x-value</label>
        <div class="select control">
          <select id="xval"
          v-model="histOptions.xval">
            <option v-for="item in prtlQuants" :key="item"> {{ item }} </option>
          </select>
        </div>
      </div>
      <div class="field">
        <label class="label">y-value</label>
        <div class="select control">
          <select id="yval"
                    v-model="histOptions.yval">
              <option v-for="item in prtlQuants" :key="item"> {{ item }} </option>
          </select>
        </div>
      </div>
      <div class="field">
        <label class="label">particle</label>
        <div class="select control">
          <select id="prtl_type"
                    v-model="histOptions.prtl_type">
              <option v-for="(item, key) in mySim.data.prtls" :key="key"> {{ key }} </option>
          </select>
        </div>
      </div>

    </div>
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
import ImageGraph from '@/components/GraphHelpers/ImageGraph'
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
      simObj: types.GET_SIMULATIONS
    }),
    mySim () {
      if (this.simObj.length === 0) {
        return {data: {cmaps: ['viridis'], prtls: {ions: {quantities: ['x']}}}}
      } else {
        return this.simObj.find(el => el.info.simID === this.simID)
      }
    },
    cmapOpts () {
      return this.mySim.data.cmaps
    },
    prtlQuants () {
      return this.mySim.data.prtls['ions'].quantities
    }
  },
  components: {
    iseultImageGraph: ImageGraph
  }
}
</script>

<style scoped src="bulma/css/bulma.css">

</style>
