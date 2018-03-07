<template>
  <div>
    <iseult-image-graph :histOpts="histOptions" :myRefresh="refreshPlot"/>
  <hr>
  <select id="cmap"
          v-model="histOptions.cmap">
    <option v-for="item in cmapOpts"> {{ item }} </option>
  </select>
  <select id="xval"
          v-model="histOptions.xval">
    <option v-for="item in prtlObj[histOptions['prtl_type']].quantities"> {{ item }} </option>
  </select>

  <p>
  {{ histOptions }}
  </p>
  <button @click="refreshPlot+=1">Refresh</button>
  </div>

</template>

<script>
import ImageGraph from '@/components/GraphHelpers/ImageGraph'
import axios from 'axios'
export default {
  data () {
    return {
      cmapOpts: ['viridis'],
      prtlObj: {},
      refreshPlot: 0,
      histOptions: {
        // outdir:
        // sim_type
        // n
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
        vmax:'',
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
  mounted:
    function () {
      var vm = this
      axios.get('http://127.0.0.1:5000/api/cmaps/')
        .then(function (response) {
          vm.cmapOpts = response.data
        })
        .catch(function (error) {
          vm.cmapOpts=['viridis']
        })
      axios.get('http://127.0.0.1:5000/api/prtl_quants/?sim_type=tristan-mp')
        .then(function (response) {
          vm.prtlObj = response.data
          for (var key in vm.prtlObj){
            console.log(key)
          }
        })
        .catch(function (error) {
          vm.cbarOpts = ['viridis']
        })
  },
  components: {
    iseultImageGraph: ImageGraph,
  }
}
</script>

<style>
</style>
