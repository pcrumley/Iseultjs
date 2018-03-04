<template>
  <div>

  <iseult-image-canvas :px="px" :py="py" :imgData="imgObj.pngData"></iseult-image-canvas>
  <svg style="width:500px;height:500px">
    <iseult-axis :orient="axisX.orient"
                 :scaleType="axisX.scaleType"
                 :range="axisX.range"
                 :domain="axisX.domain"
                 :height="px"
                 :width="py">
    </iseult-axis>

  </svg>
  <p>Input the for flask server
    <input v-model="imgSrc">
  </p>

  <p> {{  axisX.range }} </p>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import ImageCanvas from './ImageCanvas.vue'
import IseultAxis from './IseultAxis.vue'
export default {
  name: 'ImageGraph',
  data () {
    return {
      px: 400, // For the svg element containing an image graph & a colorbar
      py: 400, // For the svg element containing an image graph & a colorbar

      imgSrc: 'http://127.0.0.1:5000/api/2dhist/imgs/?sim_type=tristan-mp&outdir=test_output/&n=1&prtl_type=ions&xval=x&yval=px&cnorm=log&xmin=150',
      imgObj: {
        'pngData': '',
        'xmin': '',
        'xmax': '',
        'ymin': '',
        'ymax': '',
        'vmin': '',
        'vmax': '',
        'cmap': ''
      },

      xScale: '',
      xAxis: '',
      yScale: '',
      vScale: ''
    }
  },
  computed: {
    axisX () {
      return {
        scaleType: 'scaleLinear',
        range: [0, this.px],
        domain: [0, 1],
        orient: 'axisBottom'
      }
    },
    axisY () {
      return {
        scaleType: 'scaleLinear',
        range: [0, this.py],
        domain: [0, 1],
        orient: 'axisLeft'
      }
    },
    axisColorbar () {
      return {
        scaleType: 'scaleLinear',
        range: [0, 1],
        domain: [0, 1],
        orient: 'axisRight',
        cmap: ''
      }
    }
  },
  components: {
    'iseultImageCanvas': ImageCanvas,
    'iseultAxis': IseultAxis
  },
  watch: {
    imgSrc: function (newSrc, oldSrc) {
      this.getImg()
    }
  },
  methods: {
    getImg: _.debounce(
      function () {
        var vm = this
        axios.get(vm.imgSrc + '&px=' + this.px + '&py=' + this.py)
          .then(function (response) {
            vm.imgObj.pngData = response.data.imgString
            vm.imgObj.cmap = response.data.cmap
            vm.axisX.domain = [response.data.xmin, response.data.xmax]
            vm.axisY.domain = [response.data.ymin, response.data.ymax]
            vm.axisColorbar.domain = [response.data.cmin, response.data.cmax]
          })
          .catch(function (error) {
            vm.imgString = ''
            console.log(error)
          })
      },
      500
    )
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  </style>
