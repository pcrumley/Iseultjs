<template>
  <!--<div> -->
  <div class="container" :style="{ width:width+'px', height:height+'px' }">
  <!-- The div will hold 1 figure with 3 axis objects, one html canvas &
       three labels -->
  <svg :style="{ width:width+'px', height:height+'px'}">
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
  <iseult-image-canvas :imgX="cbarWidth" :imgY="imgY" :top="margin.top + 'px'" :left="cbarLeft+'px'" :imgData="cbarPNG"></iseult-image-canvas>

  <axis-label :orient="'labelLeft'" :text="'p_x'" :figWidth="width" :figHeight="height" :figMargin="margin"/>
  <axis-label :orient="'labelBottom'" :text="'x'" :figWidth="width" :figHeight="height" :figMargin="margin"/>
  <axis-label :orient="'labelRight'" :text="'\\log{f_i(p)}'" :figWidth="width" :figHeight="height" :figMargin="margin"/>
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
  props: [
    'width',
    'height',
    'xLabel',
    'xScale',
    'xDomain',
    'yLabel',
    'yScale',
    'yDomain',
    'cbarLabel',
    'cbarWidth',
    'cbarPNG',
    'cbarScale',
    'cbarDomain',
    'margin'],
  computed: {
    cbarLeft () {
      return this.width - this.margin.right - this.cbarWidth
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
    myRefresh: function (newSrc, oldSrc) {
      this.getImg()
    }
  },
  methods: {
    getImg: _.debounce(
      function () {
        var vm = this
        axios.get(vm.imgSrc + '&px=' + this.imgX + '&py=' + this.imgY +
                  '&outdir=' + this.$store.state.outdir + '&n=' + this.$store.state.n)
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
      1
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
div.container {
  position: relative;
  margin: auto;
}
</style>
