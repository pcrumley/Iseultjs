<template>
  <!--
  <iseult-image-graph
    :width="width"
    :height="height"
    :xLabel="xLabel"
    :xScale="'scaleLinear'"
    :xDomain="xDomain"
    :yLabel="yLabel"
    :yScale="'scaleLinear'"
    :yDomain="yDomain"
    :cbarLabel="cbarLabel"
    :cbarWidth="cbarWidth"
    :cbarPNG="cbarPNG"
    :cbarScale="cbarScale"
    :cbarDomaim="cbarDomain"
    :margin="margin"/>
  -->
  <div>
    <h2> hey, I'm chart #  {{ chartID }} </h2>
    <!--<p> here's my viewState<p> </p> {{ myViewState }}
    <p> here's mySim: </p><p> {{ mySim }} </p> -->
    <p> here's where my chart data lives: </p><p> {{imgURL}} </p>
    <p> here's where my cbar lives: </p><p> {{cbarURL}} </p>
    <p> here's where my cbar label: </p><p> {{cbarLabel}} </p>

  </div>
</template>

<script>
import ImageGraph from '@/components/GraphHelpers/ImageGraph'
import { mapGetters } from 'vuex'
import * as types from '@/store/types'
import axios from 'axios'
import _ from 'lodash'

export default {
  name: 'TwoDimPrtlHist',
  data () {
    return {
      xScale: 'scaleLinear',
      xDomain: [0, 1],
      yScale: 'scaleLinear',
      yDomain: [0, 1],
      cbarDomain: [0, 1],
      imgURLSimPart: '',
      imgURLOptsPart: '',
      cmap: ''
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
    cbarLabel () {
      return this.mySim.data.prtls[this.myViewState.dataOptions.prtl_type].histLabel
    },
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
  },
  created: function () {
    this.renderImgURLSimPart()
    this.renderImgURLOptsPart()
  },
  components: {
    iseultImageGraph: ImageGraph
  }
}
</script>

<style>

</style>
