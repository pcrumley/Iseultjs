<template>
  <!--<div> -->
  <div>
  <div class="relative">
  <svg style="width:500px;height:500px">

    <iseult-axis :orient="axisX.orient"
                 :scaleType="axisX.scaleType"
                 :range="axisX.range"
                 :domain="axisX.domain"
                 :height="imgX"
                 :width="imgY">
    </iseult-axis>
    <iseult-axis :orient="axisY.orient"
                 :scaleType="axisY.scaleType"
                 :range="axisY.range"
                 :domain="axisY.domain"
                 :height="imgX"
                 :width="imgY">
    </iseult-axis>
  </svg>
  <iseult-image-canvas :imgX="imgX" :imgY="imgY" :top="10" :left="50" :imgData="imgObj.pngData"></iseult-image-canvas>
  </div>
  <p>Input the for flask server
    <input v-model="imgSrc">
  </p>
  <p> {{  axisX.range }} </p>
  <katex :mathstr="xLabel"> </katex>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import ImageCanvas from './ImageCanvas.vue'
import iseultAxis from './IseultAxis.vue'
import latexText from './LatexText.vue'
export default {
  name: 'ImageGraph',
  data () {
    return {
      imgX: 400, // For the svg element containing an image graph & a colorbar
      imgY: 400, // For the svg element containing an image graph & a colorbar
      xLabel: 'p',
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
        range: [0, this.imgX],
        domain: [0, 1],
        orient: 'axisBottom'
      }
    },
    axisY () {
      return {
        scaleType: 'scaleLinear',
        range: [0, this.imgY],
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
    iseultAxis,
    'katex': latexText
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
        axios.get(vm.imgSrc + '&px=' + this.imgX + '&py=' + this.imgY)
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
div.relative {
    position: relative;
    width: 500px;
    height: 500px;
    border: 3px solid #73AD21;
    margin: auto;
}
span.katex-html {
  display: block;
}
</style>
