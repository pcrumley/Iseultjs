<template>
  <div class="absolute" :style="{ width:width+'px', height:height+'px' }" @mousedown="mouseIsDown" @mousemove="mouseIsMoving" @mouseup="mouseIsUp" @mouseleave="mouseLeft">
    <!-- The div will hold 1 figure with 3 axis objects, one html canvas &
      three labels -->
  <iseult-image-canvas :imgObj="mainImgObj"></iseult-image-canvas>
  <iseult-image-canvas :imgObj="cbarObj" ></iseult-image-canvas>
  <svg :id="svgID" :style="{ width:width+'px', height:height+'px'}" ><!-- @mouseup="myMouseIsDown=false">-->
    <!-- The svg is where we'll draw our vector elements using d3.js -->
    <!-- The x-axis -->
    <iseult-axis :orient="'axisBottom'"
                :scale="xScale"
                :height="imgY"
                :width="imgX"
                :margin="margin">
    </iseult-axis>
    <rect v-if="showZoomRect" :x = "rectObj.left" :y = "rectObj.top" :width="rectObj.width" :height="rectObj.height" fill-opacity =".4" style="fill:#d5d8dc ;stroke-width:1px;stroke:rgb(0,0,0);" />
    <path v-if="showPolygon" :d="pathString" fill-opacity =".3" style="fill:#d5d8dc ;stroke-width:2px;stroke:rgb(0,0,0);" />
    <path v-if="closePolygon" :d="closeString" stroke-dasharray="3,3" style="stroke-width:2px;stroke:rgb(0,0,0);" />

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
  <axis-label :orient="'labelLeft'" :text="yLabel" :figWidth="width" :figHeight="height" :figMargin="margin" :useTex="true"/>
  <axis-label :orient="'labelBottom'" :text="xLabel" :figWidth="width" :figHeight="height" :figMargin="margin" :useTex="true"/>
  <axis-label :orient="'labelRight'" :text="histLabel" :figWidth="width" :figHeight="height" :figMargin="margin" :useTex="true"/>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as types from '@/store/types'
import * as d3 from 'd3'
import ImageCanvas from '@/components/GraphHelpers/ImageCanvas.vue'
import iseultAxis from '@/components/GraphHelpers/IseultAxis.vue'
import axisLabel from '@/components/GraphHelpers/AxisLabel.vue'

// import _ from 'lodash'

export default {
  name: '2DImage',
  data () {
    return {
      width: 800,
      height: 400,
      yLabel: '',
      xLabel: '',
      pathString: '',
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
      navbarState: types.GET_NAVBAR_STATE
    }),
    svgID () {
      return 'svg' + this.chartID
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
    showZoomRect () {
      return this.myMouseIsDown && this.navbarState === 'zoom-in'
    },
    showPolygon () {
      return this.myMouseIsDown && this.navbarState === 'lasso'
    },
    closePolygon () {
      var pathArr = this.pathString.slice(1).split(' ')
      var radius = Math.pow(parseFloat(pathArr[0]) - parseFloat(pathArr.slice(-2)[0]), 2) +
        Math.pow(parseFloat(pathArr[1]) - parseFloat(pathArr.slice(-1)[0]), 2)
      return (Math.sqrt(radius) < 50 && this.showPolygon)
    },
    closeString () {
      if (this.closePolygon) {
        var pathArr = this.pathString.split(' ')
        return pathArr[0] + ' ' + pathArr[1] + ' ' + pathArr.slice(-2)[0] + ' ' + pathArr.slice(-2)[1]
      } else {
        return ''
      }
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
        this.mySim = JSON.parse(JSON.stringify(this.simMap.get(this.myViewState.sims[0])))
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
      setView: types.SET_CUR_VIEW,
      setLasso: types.SET_LASSO_REGION
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
      } else {
        if (this.navbarState === 'lasso') {
          this.myMouseIsDown = true
          const bbox = this.$el.getBoundingClientRect()
          this.pathString = 'M' +
          String((event.clientX - bbox.left >= this.margin.left) ? Math.min(event.clientX - bbox.left, this.margin.left + this.imgX) : this.margin.left) +
          ' ' +
          String((event.clientY - bbox.top >= this.margin.top) ? Math.min(event.clientY - bbox.top, this.margin.top + this.imgY) : this.margin.top)
        }
      }
    },
    mouseIsMoving (event) {
      if (this.myMouseIsDown) {
        if (this.navbarState === 'zoom-in' || this.navbarState === 'pan') {
          const bbox = this.$el.getBoundingClientRect()
          this.rectY2 = (event.clientY - bbox.top >= this.margin.top) ? Math.min(event.clientY - bbox.top, this.margin.top + this.imgY) : this.margin.top
          this.rectX2 = (event.clientX - bbox.left >= this.margin.left) ? Math.min(event.clientX - bbox.left, this.margin.left + this.imgX) : this.margin.left
        } else {
          if (this.navbarState === 'lasso') {
            /* Let's save the path data */
            const bbox = this.$el.getBoundingClientRect()
            this.pathString += ' ' +
              String((event.clientX - bbox.left >= this.margin.left) ? Math.min(event.clientX - bbox.left, this.margin.left + this.imgX) : this.margin.left) +
              ' ' +
              String((event.clientY - bbox.top >= this.margin.top) ? Math.min(event.clientY - bbox.top, this.margin.top + this.imgY) : this.margin.top)
          }
        }
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
        } else if (this.navbarState === 'lasso' && this.closePolygon) {
          // create an array of the points in DATA SPACE!
          var pathArr = this.pathString.slice(1).split(' ')
          var xStr = ''
          var yStr = ''
          var i
          for (i = 0; i < pathArr.length; i++) {
            if (i % 2 === 0) {
              // It is an x-data point
              xStr += this.xScale.invert(parseFloat(pathArr[i]) - this.margin.left) + ','
            } else {
              yStr += this.yScale.invert(parseFloat(pathArr[i]) - this.margin.top) + ','
            }
          }
          // CLOSE THE POLYGON
          xStr += this.xScale.invert(parseFloat(pathArr[0]) - this.margin.left)
          yStr += this.yScale.invert(parseFloat(pathArr[1]) - this.margin.top)
          // PUSH THE LASSO-ED REGION TO THE SIMULATION
          this.setLasso({id: this.myViewState.sims[0],
            lassoType: this.myViewState.dataOptions['prtl_type'],
            lasso: {
              x: xStr,
              y: yStr,
              xVal: this.myViewState.dataOptions['xval'],
              yVal: this.myViewState.dataOptions['yval']
            }
          })
        }
      }
      this.myMouseIsDown = false
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
