<template>
  <div class="container" :style="{ width:width+'px', height:height+'px' }">
    <!-- The div will hold 1 figure with 3 axis objects, one html canvas &
      three labels -->

  <svg :style="{ width:width+'px', height:height+'px'}">
    <!-- The svg is where we'll draw our vector elements using d3.js -->
    <!-- The x-axis -->
    <iseult-axis :orient="'axisBottom'"
                :scaleType="'scaleLinear'"
                :range="[0,imgX]"
                :domain="xDomain"
                :height="imgY"
                :width="imgX"
                :margin="margin">
    </iseult-axis>
    <!-- The y-axis -->
    <iseult-axis :orient="'axisLeft'"
                 :scaleType="'scaleLinear'"
                 :range="[this.imgY, 0]"
                 :domain="yDomain"
                 :height="imgY"
                 :width="imgX"
                 :margin="margin">
    </iseult-axis>

    <!-- The colorbar-axis -->
    <iseult-axis :orient="'axisRight'"
                 :scaleType="cbarScale"
                 :range="[this.imgY, 0]"
                 :domain="cbarDomain"
                 :height="imgY"
                 :width="imgX"
                 :margin="margin">
    </iseult-axis>
  </svg>
  <iseult-image-canvas :imgObj="mainImgObj"></iseult-image-canvas>
  <!--<iseult-image-canvas :imgX="cbarWidth" :imgY="imgY" :top="margin.top + 'px'" :left="cbarLeft+'px'" :imgData="cbarPNG"></iseult-image-canvas>-->
  <axis-label :orient="'labelLeft'" :text="yLabel" :figWidth="width" :figHeight="height" :figMargin="margin"/>
  <axis-label :orient="'labelBottom'" :text="xLabel" :figWidth="width" :figHeight="height" :figMargin="margin"/>
  <axis-label :orient="'labelRight'" :text="histLabel" :figWidth="width" :figHeight="height" :figMargin="margin"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as types from '@/store/types'
import axios from 'axios'
import ImageCanvas from '@/components/GraphHelpers/ImageCanvas.vue'
import iseultAxis from '@/components/GraphHelpers/IseultAxis.vue'
import axisLabel from '@/components/GraphHelpers/AxisLabel.vue'

// import _ from 'lodash'

export default {
  name: 'TwoDimPrtlHist',
  data () {
    return {
      imgURLSimPart: '',
      imgURLOptsPart: '',
      cmap: '',
      width: 800,
      height: 400,
      yLabel: '',
      xLabel: '',
      mainImgObj: {},
      xDomain: [],
      yDomain: [],
      cbarDomain: [],
      cbarScale: 'scaleLog',
      cbarImgObj: {},
      histLabel: '',
      cbarWidth: 20,
      cbarPNG: '',
      cache: new Map(),
      didIUpdate: 1,
      margin: {
        top: 20,
        right: 60,
        bottom: 70,
        left: 70,
        hspace: 50
      }
    }
  },
  props: [
    'chartID'
  ],
  computed: {
    ...mapGetters({
      simMap: types.GET_SIM_MAP,
      graphMap: types.GET_GRAPH_STATE_MAP,
      simUpdated: types.GET_SIM_UPDATED,
      chartUpdated: types.GET_CHART_UPDATED

    }),
    mySim () {
      if (this.simMap.has(this.myViewState.sims[0])) {
        return this.simMap.get(this.myViewState.sims[0])
      } else {
        // just a placeholder
        return {}
      }
    },
    myViewState () {
      if (this.graphMap.has(this.chartID)) {
        return this.graphMap.get(this.chartID)
      } else {
        return {}
      }
    },
    imgX () {
      // return this.width - this.right-this.left
      return this.myViewState.renderOptions.tot_width - this.myViewState.renderOptions.margin.right - this.myViewState.renderOptions.margin.left - this.myViewState.renderOptions.margin.hspace
    },
    imgY () {
      return this.myViewState.renderOptions.tot_height - this.myViewState.renderOptions.margin.top - this.myViewState.renderOptions.margin.bottom
    },
    cbarLeft () {
      return this.myViewState.renderOptions.tot_width - this.myViewState.renderOptions.margin.right - this.myViewState.cbarWidth
    },
    cbarURL () {
      return this.mySim.info.serverURL + '/api/colorbar/' +
        '?px=' + this.myViewState.renderOptions.cbarWidth +
        '&py=' + this.imgY +
        '&cmap=' + this.cmap
    },
    imgURL () {
      return this.imgURLSimPart + this.imgURLOptsPart + '&px=' + this.imgX + '&py=' + this.imgY
    }
  },
  watch: {
    simUpdated: function (newSimID) {
      if (this.myViewState.sims[0] === Math.abs(newSimID)) {
        this.renderImgURLSimPart()
      }
    },
    chartUpdated: function (newChartID) {
      if (this.chartID === Math.abs(newChartID)) {
        this.renderImgURLOptsPart()
        const tmpPrtlType = this.myViewState.dataOptions['prtl_type']
        this.yLabel = this.mySim.data.prtls[tmpPrtlType].axisLabels[this.mySim.data.prtls[tmpPrtlType].quantities.indexOf(this.myViewState.dataOptions.yval)]
        this.xLabel = this.mySim.data.prtls[tmpPrtlType].axisLabels[this.mySim.data['prtls'][tmpPrtlType].quantities.indexOf(this.myViewState.dataOptions.xval)]
        this.histLabel = this.mySim.data['prtls'][tmpPrtlType]['histLabel']
        this.cbarScale = (this.myViewState.dataOptions['cnorm'] === 'log') ? 'scaleLog' : 'scaleLinear'
      }
    },
    imgURL (newURL) {
      if (this.cache.has(this.mySim.i)) {
        if (this.cache.get(this.mySim.i).url === newURL) {
          this.updatePlot()
        } else {
          this.getImg()
        }
      } else {
        this.getImg()
      }
    }
  },
  methods: {
    renderImgURLSimPart: function () {
      this.imgURLSimPart = this.mySim.info.serverURL + '/api/2dhist/imgs/?' +
        'sim_type=' + this.mySim.info.simType +
        '&outdir=' + this.mySim.info.outdir +
        '&n=' + this.mySim.data.fileArray[this.mySim.i]
    },
    updatePlot: function () {
      this.mainImgObj = this.cache.get(this.mySim.i).mainImgObj
      this.xDomain = this.cache.get(this.mySim.i).xDomain
      this.yDomain = this.cache.get(this.mySim.i).yDomain
      this.cbarDomain = this.cache.get(this.mySim.i).cbarDomain
      this.didIUpdate *= -1
    },
    renderImgURLOptsPart: function () {
      if (this.myViewState.dataOptions.cmap !== this.cmap) {
        this.cmap = this.myViewState.dataOptions.cmap
      }
      this.imgURLOptsPart = '&'
      for (var key in this.myViewState.dataOptions) {
        this.imgURLOptsPart += key + '=' + this.myViewState.dataOptions[key] + '&'
      }
      return this.imgURLOptsPart
    },
    getImg: // _.debounce(
      function () {
        var vm = this
        axios.get(vm.imgURL)
          .then(function (response) {
            vm.cache.set(vm.mySim.i, {
              mainImgObj: {
                imgX: vm.imgX,
                imgY: vm.imgY,
                left: vm.margin.left,
                top: vm.margin.top,
                imgData: response.data.imgString},
              xDomain: [response.data.xmin, response.data.xmax],
              yDomain: [response.data.ymin, response.data.ymax],
              cbarDomain: [response.data.vmin, response.data.vmax]
            })
            vm.getColorBar()
            vm.cache.get(vm.mySim.i).url = vm.imgURL
            vm.updatePlot()
          })
          .catch(function (error) {
            // vm.imgString = ''
            console.log(error)
          })
      }, // ,
    //  20
    // ),
    getColorBar () {
      var vm = this
      axios.get(vm.cbarURL)
        .then(function (response) {
          vm.cache.get(vm.mySim.i)['cbarPNG'] = response.data.cbarString
        })
        .catch(function (error) {
          vm.cache.get(vm.mySim.i)['cbarPNG'] = ''
          console.log(error)
        })
    }
  },
  mounted: function () {
    this.renderImgURLSimPart()
    this.renderImgURLOptsPart()
    const tmpPrtlType = this.myViewState.dataOptions['prtl_type']
    this.yLabel = this.mySim.data.prtls[tmpPrtlType].axisLabels[this.mySim.data.prtls[tmpPrtlType].quantities.indexOf(this.myViewState.dataOptions.yval)]
    this.xLabel = this.mySim.data.prtls[tmpPrtlType].axisLabels[this.mySim.data['prtls'][tmpPrtlType].quantities.indexOf(this.myViewState.dataOptions.xval)]
    this.histLabel = this.mySim.data['prtls'][tmpPrtlType]['histLabel']
  },
  components: {
    'iseultImageCanvas': ImageCanvas,
    iseultAxis,
    axisLabel
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
