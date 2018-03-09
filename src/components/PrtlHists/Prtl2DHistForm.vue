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
            <option v-for="item in prtlObj[histOptions['prtl_type']].quantities" :key="item"> {{ item }} </option>
          </select>
        </div>
      </div>
      <div class="field">
        <label class="label">y-value</label>
        <div class="select control">
          <select id="yval"
                    v-model="histOptions.yval">
              <option v-for="item in prtlObj[histOptions['prtl_type']].quantities" :key="item"> {{ item }} </option>
          </select>
        </div>
      </div>
      <div class="field">
        <label class="label">particle</label>
        <div class="select control">
          <select id="prtl_type"
                    v-model="histOptions.prtl_type">
              <option v-for="(item, key) in prtlObj" :key="key"> {{ key }} </option>
          </select>
        </div>
      </div>

    </div>
    <div class="control">
      <button class="button is-primary"  @click="refreshPlot+=1">Refresh</button>
    </div>

  </div>
</template>

<script>
import ImageGraph from '@/components/GraphHelpers/ImageGraph'
import axios from 'axios'
export default {
  data () {
    return {
      prtlObj: {ions: {quantities: ['x']}},
      refreshPlot: 0,
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
    submitted () {
      this.isSubmitted = true
    }
  },
  computed: {
    cmapOpts () {
      return this.$store.state.cmaps
    }
  },
  mounted:
    function () {
      this.$store.dispatch('loadCmaps')
      var vm = this
      axios.get('http://localhost:5000/api/prtl_quants/?sim_type=tristan-mp')
        .then(function (response) {
          vm.prtlObj = response.data
        })
        .catch(function (error) {
          console.log(error)
          vm.cbarOpts = ['viridis']
        })
    },
  components: {
    iseultImageGraph: ImageGraph
  }
}
</script>

<style src="bulma/css/bulma.css">

</style>
