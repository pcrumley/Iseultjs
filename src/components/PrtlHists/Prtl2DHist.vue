<template>
  <div class="absolute" :style="{ width:width+'px', height:height+'px' }" @mousedown="mouseIsDown" @mousemove="mouseIsMoving" @mouseup="mouseIsUp" @mouseleave="mouseLeft">
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
    <rect v-if="showZoomRect" :x = "rectObj.left" :y = "rectObj.top" :width="rectObj.width" :height="rectObj.height" fill-opacity =".4" style="fill:#d5d8dc ;stroke-width:1px;stroke:rgb(0,0,0);" />
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
    <rect :x="margin.left" :y ="margin.top" :width = "imgX" :height="imgY" fill-opacity ="0" style="stroke-width:1px;stroke:rgb(0,0,0);"/>
    <rect :x="imgX + margin.left + margin.hspace - cbarWidth" :y ="margin.top" :width = "cbarWidth" :height="imgY" fill-opacity ="0" style="stroke-width:1px;stroke:rgb(0,0,0);"/>
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
      cnormStr: '',
      width: 800,
      height: 400,
      yLabel: '',
      xLabel: '',
      rectX1: 0,
      mySim: '',
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
      return this.width - this.myViewState.renderOptions.margin.right - this.myViewState.renderOptions.margin.left - this.myViewState.renderOptions.margin.hspace
    },
    imgY () {
      return this.height - this.myViewState.renderOptions.margin.top - this.myViewState.renderOptions.margin.bottom
    },
    cbarLeft () {
      return this.width - this.myViewState.renderOptions.margin.right - this.myViewState.cbarWidth
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
      var tmpStr = ''
      if (this.mySim.hasOwnProperty('info')) {
        tmpStr += this.mySim.info.serverURL + '/api/colorbar/' +
        '?px=' + this.myViewState.renderOptions.cbarWidth +
        '&py=' + this.imgY +
        '&cmap=' + this.cmap
      }
      return tmpStr + this.cnormStr
    },
    imgURL () {
      return this.imgURLSimPart + this.imgURLOptsPart + '&px=' + this.imgX + '&py=' + this.imgY
    },
    showZoomRect () {
      return this.myMouseIsDown && this.navbarState === 'zoom-in'
    },
    rectObj () {
      return {left: Math.min(this.rectX1, this.rectX2),
        top: Math.min(this.rectY1, this.rectY2),
        width: Math.abs(this.rectX1 - this.rectX2),
        height: Math.abs(this.rectY1 - this.rectY2)}
    }
  },
  watch: {
    simUpdated: function (newSimArr) {
      if (newSimArr.includes(this.myViewState.sims[0])) {
        this.mySim = this.simMap.get(this.myViewState.sims[0])
        this.renderImgURLSimPart()
      }
    },
    cbarURL: function () {
      this.getColorBar()
    },
    chartsUpdated: function (newChartArr) {
      if (newChartArr.includes(this.chartID)) {
        if (this.width !== this.myViewState.renderOptions.tot_width) {
          this.width = this.myViewState.renderOptions.tot_width
        }
        if (this.height !== this.myViewState.renderOptions.tot_height) {
          this.height = this.myViewState.renderOptions.tot_height
        }
        this.renderImgURLOptsPart()
        const tmpPrtlType = this.myViewState.dataOptions['prtl_type']
        this.yLabel = this.mySim.data.prtls[tmpPrtlType].axisLabels[this.mySim.data.prtls[tmpPrtlType].quantities.indexOf(this.myViewState.dataOptions.yval)]
        this.xLabel = this.mySim.data.prtls[tmpPrtlType].axisLabels[this.mySim.data['prtls'][tmpPrtlType].quantities.indexOf(this.myViewState.dataOptions.xval)]
        this.histLabel = this.mySim.data['prtls'][tmpPrtlType]['histLabel']
        this.cbarScaleType = (this.myViewState.dataOptions['cnorm'] === 'log') ? 'scaleLog' : 'scaleLinear'
      }
    },
    imgURL (newURL) {
      if (this.imgURLOptsPart !== '') {
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
        '&outdir=' + this.mySim.info.outdir.replace(/\//g, '%2F') +
        '&n=' + this.mySim.data.fileArray[this.mySim.i] +
        '&i=' + this.mySim.i
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
      var tmpcnormStr = '&cnorm=' + this.myViewState.dataOptions['cnorm'] +
        '&pow_zero=' + this.myViewState.dataOptions['pow_zero'] +
        '&pow_gamma=' + this.myViewState.dataOptions['pow_gamma']
      if (tmpcnormStr !== this.cnormStr) {
        this.cnormStr = tmpcnormStr
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
      if (this.navbarState === 'zoom-in' || this.navbarState === 'pan') {
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
      if (this.myMouseIsDown) {
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
      if (this.myMouseIsDown) {
        if (this.navbarState === 'zoom-in') {
          // calculate xmin in data space.
          var xmin = Math.min(this.rectX1, this.rectX2)
          var xmax = Math.max(this.rectX1, this.rectX2)
          var ymin = Math.max(this.rectY1, this.rectY2)
          var ymax = Math.min(this.rectY1, this.rectY2)
          if ((xmin !== xmax) && (ymin !== ymax)) {
            xmin = (xmin === this.margin.left) ? this.myViewState.curView[0] : this.xScale.invert(xmin - this.margin.left)
            xmax = (xmax === this.margin.left + this.imgX) ? this.myViewState.curView[1] : this.xScale.invert(xmax - this.margin.left)
            ymin = (ymin === this.margin.top + this.imgY) ? this.myViewState.curView[2] : this.yScale.invert(ymin - this.margin.top)
            ymax = (ymax === this.margin.top) ? this.myViewState.curView[3] : this.yScale.invert(ymax - this.margin.top)
            this.setView({id: this.chartID, view: [xmin, xmax, ymin, ymax]})
          }
        } else if (this.navbarState === 'pan') {
          var delX = this.xScale.invert(this.rectX2 - this.margin.left) - this.xScale.invert(this.rectX1 - this.margin.left)
          var delY = this.yScale.invert(this.rectY2 - this.margin.top) - this.yScale.invert(this.rectY1 - this.margin.top)
          // console.log(this.xDomain)
          // console.log(this.yDomain)
          this.setView({id: this.chartID,
            view: [this.xDomain[0] - delX, this.xDomain[1] - delX, this.yDomain[0] - delY, this.yDomain[1] - delY]})
        }
      }
      this.myMouseIsDown = false
    },
    getImg: // _.debounce(
      function () {
        var vm = this
        axios.get(vm.imgURL)
          .then(function (response) {
            vm.cache.set(response.data.i, {
              mainImgObj: {
                imgX: response.data.imgX,
                imgY: response.data.imgY,
                left: vm.margin.left,
                top: vm.margin.top,
                imgData: response.data.imgString},
              xDomain: [response.data.xmin, response.data.xmax],
              yDomain: [response.data.ymin, response.data.ymax],
              cbarDomain: [response.data.vmin, response.data.vmax]
            })
            // vm.getColorBar()
            vm.cache.get(response.data.i).url = response.data.url
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
    this.mySim = JSON.parse(JSON.stringify(this.simMap.get(this.myViewState.sims[0])))

    const tmpPrtlType = this.myViewState.dataOptions['prtl_type']
    this.yLabel = this.mySim.data.prtls[tmpPrtlType].axisLabels[this.mySim.data.prtls[tmpPrtlType].quantities.indexOf(this.myViewState.dataOptions.yval)]
    this.xLabel = this.mySim.data.prtls[tmpPrtlType].axisLabels[this.mySim.data['prtls'][tmpPrtlType].quantities.indexOf(this.myViewState.dataOptions.xval)]
    this.histLabel = this.mySim.data['prtls'][tmpPrtlType]['histLabel']
    this.renderImgURLSimPart()
    this.$nextTick(function () {
      var pStyle = document.getElementById('VueGrid' + this.chartID.toString()).getAttribute('style')
      var pHeight = pStyle.slice(pStyle.search(/height/g))
      pHeight = parseInt(pHeight.slice(pHeight.search(/:/g) + 1, pHeight.search(/;/g) - 2))
      var pWidth = pStyle.slice(pStyle.search(/width/g))
      pWidth = parseInt(pWidth.slice(pWidth.search(/:/g) + 1, pWidth.search(/;/g) - 2))

      this.$store.commit(types.MUTATE_RENDER_OPTS, {chartID: this.chartID, wVal: pWidth, hVal: pHeight})
      this.$store.commit(types.MARK_UPDATE, {ids: [this.chartID]})
    })
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
div.absolute {
position: absolute;
margin: auto;
}

svg {
  position: inherit;
  user-select: none;
}
</style>
