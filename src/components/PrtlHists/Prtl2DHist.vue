<template>
  <div class="relative" :style="{ width:width+'px', height:height+'px' }" @mousedown.stop="mouseIsDown" @mousemove.stop="mouseIsMoving" @mouseup.stop="mouseIsUp" @mouseleave="mouseLeft">
    <!-- The div will hold 1 figure with 3 axis objects, one html canvas &
      three labels -->
  <iseult-image-canvas :imgObj="mainImgObj"></iseult-image-canvas>
  <iseult-image-canvas :imgObj="cbarObj" ></iseult-image-canvas>

  <svg :style="{ width:width+'px', height:height+'px'}" ><!-- @mouseup="myMouseIsDown=false">-->
    <!-- The svg is where we'll draw our vector elements using d3.js -->
    <!-- The x-axis -->
    <iseult-axis :orient="'axisBottom'"
                :scale="xScale"
                :height="imgY"
                :width="imgX"
                :margin="margin">
    </iseult-axis>
    <rect v-if='myMouseIsDown' :x = "rectObj.left" :y = "rectObj.top" :width="rectObj.width" :height="rectObj.height" fill-opacity =".4" style="fill:#d5d8dc ;stroke-width:1px;stroke:rgb(0,0,0);" />
    <!-- The y-axis -->
    <iseult-axis :orient="'axisLeft'"
                 :scale="yScale"
                 :height="imgY"
                 :width="imgX"
                 :margin="margin">
    </iseult-axis>

    <!-- The colorbar-axis -->
    <iseult-axis :orient="'axisRight'"
                 :scale="cbarScale"
                 :height="imgY"
                 :width="imgX"
                 :margin="margin">
    </iseult-axis>
  </svg>
  <axis-label :orient="'labelLeft'" :text="yLabel" :figWidth="width" :figHeight="height" :figMargin="margin"/>
  <axis-label :orient="'labelBottom'" :text="xLabel" :figWidth="width" :figHeight="height" :figMargin="margin"/>
  <axis-label :orient="'labelRight'" :text="histLabel" :figWidth="width" :figHeight="height" :figMargin="margin"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as types from '@/store/types'
import axios from 'axios'
import * as d3 from 'd3'
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
      rectX1: 0,
      rectX2: 0,
      rectY1: 0,
      rectY2: 0,
      myMouseIsDown: false,
      mainImgObj: {},
      xDomain: [],
      yDomain: [],
      cbarDomain: [],
      cbarScaleType: 'scaleLog',
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
      chartsUpdated: types.GET_UPDATED_CHARTS,
      navbarState: types.GET_NAVBAR_STATE
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
    dataOptions () {
      // data options minus xmin, xmax, ymin, ymax
      return Object.keys(this.myViewState.dataOptions).filter(e =>
        (e !== 'xmin' &&
         e !== 'xmax' &&
         e !== 'ymin' &&
         e !== 'ymax'))
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
    cbarObj () {
      return {
        imgX: this.cbarWidth,
        imgY: this.imgY,
        left: this.width - this.margin.right - this.cbarWidth,
        top: this.margin.top,
        imgData: this.cbarPNG
      }
    },
    xScale () {
      return d3['scaleLinear']()
        .range([0, this.imgX])
        .domain(this.xDomain)
    },
    yScale () {
      return d3['scaleLinear']()
        .range([this.imgY, 0])
        .domain(this.yDomain)
    },
    cbarScale () {
      return d3[this.cbarScaleType]()
        .range([this.imgY, 0])
        .domain(this.cbarDomain)
    },
    cbarURL () {
      console.log(this.mySim.info.serverURL + '/api/colorbar/' +
        '?px=' + this.myViewState.renderOptions.cbarWidth +
        '&py=' + this.imgY +
        '&cmap=' + this.cmap)
      return this.mySim.info.serverURL + '/api/colorbar/' +
        '?px=' + this.myViewState.renderOptions.cbarWidth +
        '&py=' + this.imgY +
        '&cmap=' + this.cmap
    },
    imgURL () {
      return this.imgURLSimPart + this.imgURLOptsPart + '&px=' + this.imgX + '&py=' + this.imgY
    },
    rectObj () {
      return {left: Math.min(this.rectX1, this.rectX2),
        top: Math.min(this.rectY1, this.rectY2),
        width: Math.abs(this.rectX1 - this.rectX2),
        height: Math.abs(this.rectY1 - this.rectY2)}
    }
  },
  watch: {
    simUpdated: function (newSimID) {
      if (this.myViewState.sims[0] === Math.abs(newSimID)) {
        this.renderImgURLSimPart()
      }
    },
    cbarURL: function () {
      this.getColorBar()
    },
    chartsUpdated: function (newChartArr) {
      if (newChartArr.includes(this.chartID)) {
        this.renderImgURLOptsPart()
        const tmpPrtlType = this.myViewState.dataOptions['prtl_type']
        this.yLabel = this.mySim.data.prtls[tmpPrtlType].axisLabels[this.mySim.data.prtls[tmpPrtlType].quantities.indexOf(this.myViewState.dataOptions.yval)]
        this.xLabel = this.mySim.data.prtls[tmpPrtlType].axisLabels[this.mySim.data['prtls'][tmpPrtlType].quantities.indexOf(this.myViewState.dataOptions.xval)]
        this.histLabel = this.mySim.data['prtls'][tmpPrtlType]['histLabel']
        this.cbarScaleType = (this.myViewState.dataOptions['cnorm'] === 'log') ? 'scaleLog' : 'scaleLinear'
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
    ...mapActions({
      updateChartOptions: types.UPDATE_CHART,
      setView: types.SET_CUR_VIEW
    }),
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
      var i
      this.imgURLOptsPart = '&'
      for (i = 0; i < this.dataOptions.length; i++) {
        this.imgURLOptsPart += this.dataOptions[i] + '=' + this.myViewState.dataOptions[this.dataOptions[i]] + '&'
      }
      this.imgURLOptsPart += 'xmin=' + this.myViewState.curView[0] + '&'
      this.imgURLOptsPart += 'xmax=' + this.myViewState.curView[1] + '&'
      this.imgURLOptsPart += 'ymin=' + this.myViewState.curView[2] + '&'
      this.imgURLOptsPart += 'ymax=' + this.myViewState.curView[3] + '&'
      return this.imgURLOptsPart
    },
    mouseIsDown (event) {
      if (this.navbarState === 'zoom-in') {
        // clientX/Y gives the coordinates relative to the viewport in CSS pixels.
        // console.log(event.clientX) // x coordinate
        const bbox = this.$el.getBoundingClientRect()
        this.rectY1 = (event.clientY - bbox.top >= this.margin.top) ? Math.min(event.clientY - bbox.top, this.margin.top + this.imgY) : this.margin.top
        this.rectX1 = (event.clientX - bbox.left >= this.margin.left) ? Math.min(event.clientX - bbox.left, this.margin.left + this.imgX) : this.margin.left
        this.rectY2 = this.rectY1
        this.rectX2 = this.rectX1
        this.myMouseIsDown = true
      }
    },
    mouseIsMoving (event) {
      if (this.navbarState === 'zoom-in' && this.myMouseIsDown === true) {
        const bbox = this.$el.getBoundingClientRect()
        this.rectY2 = (event.clientY - bbox.top >= this.margin.top) ? Math.min(event.clientY - bbox.top, this.margin.top + this.imgY) : this.margin.top
        this.rectX2 = (event.clientX - bbox.left >= this.margin.left) ? Math.min(event.clientX - bbox.left, this.margin.left + this.imgX) : this.margin.left
      }
    },
    mouseLeft (event) {
      if (this.myMouseIsDown) {
        this.mouseIsUp(event)
      }
    },
    mouseIsUp (event) {
      // clientX/Y gives the coordinates relative to the viewport in CSS pixels.
      // console.log(event.clientX) // x coordinate
      if (this.navbarState === 'zoom-in' && this.myMouseIsDown === true) {
        // calculate xmin in data space.
        var xmin = Math.min(this.rectX1, this.rectX2)
        var xmax = Math.max(this.rectX1, this.rectX2)
        var ymin = Math.max(this.rectY1, this.rectY2)
        var ymax = Math.min(this.rectY1, this.rectY2)

        xmin = (xmin === this.margin.left) ? this.myViewState.curView[0] : this.xScale.invert(xmin - this.margin.left)
        xmax = (xmax === this.margin.left + this.imgX) ? this.myViewState.curView[1] : this.xScale.invert(xmax - this.margin.left)
        ymax = (ymax === this.margin.top) ? this.myViewState.curView[2] : this.yScale.invert(ymax - this.margin.top)
        ymin = (ymin === this.margin.top + this.imgY) ? this.myViewState.curView[3] : this.yScale.invert(ymin - this.margin.top)
        this.setView({id: this.chartID, view: [xmin, xmax, ymin, ymax]})
        this.myMouseIsDown = false
      }
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
            // vm.getColorBar()
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
          vm.cbarPNG = response.data.cbarString
        })
        .catch(function (error) {
          vm.cbarPNG = ''
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
div.relative {
position: relative;
margin: auto;
}

svg {
  position: inherit;
}
</style>
