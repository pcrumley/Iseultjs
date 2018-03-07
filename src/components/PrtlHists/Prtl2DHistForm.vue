<template>
  <div>
    <iseult-image-graph :histOpts="histOptions"/>
  </div>
</template>

<script>
import ImageGraph from '@/components/GraphHelpers/ImageGraph'
import axios from 'axios'
export default {
  data () {
    return {
      cbarOpts: ['viridis'],
      prtlObj: {},
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
          vm.cbarOpts = response.data
          console.log(vm.cbarOpts)
        })
        .catch(function (error) {
          vm.cbarOpts=['viridis']
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
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
