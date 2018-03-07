<template>
  <!--<div> -->
  <div>
  <div class="relative" :style="{ width:width+'px', height:height+'px' }">
  <!-- The div will hold 1 figure with 3 axis objects, one html canvas &
       three labels -->
  <svg :style="{ width:width+'px', height:height+'px' }">
    <!-- The svg is where we'll draw our vector elements using d3.js -->
    <!-- The x-axis -->
    <iseult-axis :orient="axisX.orient"
                 :scaleType="axisX.scaleType"
                 :range="axisX.range"
                 :domain="axisX.domain"
                 :height="imgY"
                 :width="imgX"
                 :margin="margin">
    </iseult-axis>
    <!-- The y-axis -->
    <iseult-axis :orient="axisY.orient"
                 :scaleType="axisY.scaleType"
                 :range="axisY.range"
                 :domain="axisY.domain"
                 :height="imgY"
                 :width="imgX"
                 :margin="margin">
    </iseult-axis>
    <!-- The colorbar-axis -->
    <iseult-axis :orient="axisColorbar.orient"
                 :scaleType="axisColorbar.scaleType"
                 :range="axisColorbar.range"
                 :domain="axisColorbar.domain"
                 :height="imgY"
                 :width="imgX"
                 :margin="margin">
    </iseult-axis>

  </svg>

  <iseult-image-canvas :imgX="imgX" :imgY="imgY" :top="margin.top + 'px'" :left="margin.left+'px'" :imgData="imgObj.pngData"></iseult-image-canvas>
  <iseult-image-canvas :imgX="cbarWidth" :imgY="imgY" :top="margin.top + 'px'" :left="cbarObj.left+'px'" :imgData="cbarPNG"></iseult-image-canvas>

  <axis-label :orient="'labelLeft'" :text="'p_x'" :figWidth="width" :figHeight="height" :figMargin="margin"/>
  <axis-label :orient="'labelBottom'" :text="'x'" :figWidth="width" :figHeight="height" :figMargin="margin"/>
  </div>

  <p>Input the for flask server
    <input v-model="imgText  ">
  </p>
  <p> {{  cbarPNG }} </p>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import ImageCanvas from './ImageCanvas.vue'
import iseultAxis from './IseultAxis.vue'
import axisLabel from './AxisLabel.vue'
export default {
  name: 'ImageGraph',
  props: ['histOpts'],
  data () {
    return {
      imgText:'',
      margin: {
        top: 20,
        right: 60,
        bottom: 70,
        left: 70,
        hspace: 50
      },
      xLabel: 'x \\space \\space [c/\\omega_{pe}]',
      cbarPNG: '',
      cbarWidth: 20,
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
    imgSrc () {
      var imgstr = 'http://localhost:5000/api/2dhist/imgs/?'
      for (var key in this.histOpts) {
        imgstr += key + '=' + this.histOpts[key] + '&'
      }
      return imgstr
    },
    width () {
      return window.innerWidth
    },
    height () {
      return 800
    },
    cbarObj () {
      return {
        width: 20,
        height: this.imgY,
        top: this.margin.top,
        left: this.width - this.margin.right - 20,
        url: 'http://localhost:5000/api/colorbar/' +
             '?px=20&py=' + this.imgY
      }
    },
    imgX () {
      // return this.width - this.right-this.left
      return this.width - this.margin.right - this.margin.left - this.margin.hspace
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
        scaleType: 'scaleLog',
        range: [this.imgY, 0],
        domain: [0, 1],
        orient: 'axisRight',
        cmap: ''
      }
    }
  },
  components: {
    'iseultImageCanvas': ImageCanvas,
    iseultAxis,
    axisLabel
  },
  watch: {
    imgText: function (newSrc, oldSrc) {
      this.getImg()
    }
  },
  methods: {
    getImg: _.debounce(
      function () {
        var vm = this
        axios.get(vm.imgSrc + '&px=' + this.imgX + '&py=' + this.imgY +'&outdir=./test_output' +'&n=3')
          .then(function (response) {
            vm.imgObj.pngData = response.data.imgString
            vm.imgObj.cmap = response.data.cmap
            vm.axisX.domain = [response.data.xmin, response.data.xmax]
            vm.axisY.domain = [response.data.ymin, response.data.ymax]
            vm.axisColorbar.domain = [response.data.vmin, response.data.vmax]
            vm.getColorBar()
          })
          .catch(function (error) {
            vm.imgString = ''
            console.log(error)
          })
      },
      500
    ),
    getColorBar () {
      var vm = this
      axios.get(vm.cbarObj.url)
        .then(function (response) {
          vm.cbarPNG = response.data.cbarString
        })
        .catch(function (error) {
          vm.imgString = ''
          console.log(error)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.relative {
    position: relative;
  margin: auto;
}
</style>
