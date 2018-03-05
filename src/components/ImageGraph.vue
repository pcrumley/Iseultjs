<template>
  <!--<div> -->
  <div>
  <div class="relative" :style="{ width:width+'px', height:height+'px' }">
  <svg :style="{ width:width+'px', height:height+'px' }">

    <iseult-axis :orient="axisX.orient"
                 :scaleType="axisX.scaleType"
                 :range="axisX.range"
                 :domain="axisX.domain"
                 :height="imgY"
                 :width="imgX"
                 :margin="margin">
    </iseult-axis>
    <iseult-axis :orient="axisY.orient"
                 :scaleType="axisY.scaleType"
                 :range="axisY.range"
                 :domain="axisY.domain"
                 :height="imgY"
                 :width="imgX"
                 :margin="margin">
    </iseult-axis>
  </svg>

  <iseult-image-canvas :imgX="imgX" :imgY="imgY" :top="margin.top + 'px'" :left="margin.left+'px'" :imgData="imgObj.pngData"></iseult-image-canvas>
  <span class="axisLabel">
  <katex mathstr='p_x'/>
  </span>

  </div>

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
import iseultAxis from './IseultAxis.vue'
import katex from './Katex.vue'
export default {
  name: 'ImageGraph',
  data () {
    return {
      width: 900,
      height: 500,
      margin: {
        top: 20,
        right: 10,
        bottom: 50,
        left: 70
      },
      xLabel: 'x \\space \\space [c/\\omega_{pe}]',
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
    imgX () {
      // return this.width - this.right-this.left
      return this.width - this.margin.right - this.margin.left
    },
    imgY () {
      // return this.width - this.right-this.left
      return this.height - this.margin.top - this.margin.bottom
    },
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
        range: [this.imgY, 0],
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
    katex
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
  border: 3px solid #73AD21;
    margin: auto;
}
span.axisLabel {
  position: absolute;
  top: 450px;
  font-size: 20px;
}
</style>
