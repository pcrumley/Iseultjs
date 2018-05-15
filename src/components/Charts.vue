<template>
  <!--
  THE VUE COMPONENT THAT MANAGES EACH CHART
  -->
  <div>
    <grid-layout
             @layout-updated="layoutUpdatedEvent"
             :layout="layout"
             :col-num="12"
             :row-height="100"
             :is-draggable="resizeActive"
             :is-resizable="resizeActive"
             :vertical-compact="true"
             :use-css-transforms="true"
>
    <grid-item v-for="item in layout"
               v-bind:id="'VueGrid'+item.i"
               :x="item.x"
               :y="item.y"
               :w="item.w"
               :h="item.h"
               :i="item.i"
               :key="item.i"
               @resized="resizedEvent"

    >
        <!--@resize="resizeEvent"-->
        <!--@move="moveEvent"-->
        <!--@resized="resizedEvent"-->
        <!--@moved="movedEvent"-->
        <component :is="subplotComponent(parseInt(item.i))" :chartID="parseInt(item.i)"> ><!-- :height="heightArr[i]"> -->
        </component>
    </grid-item>
</grid-layout>
  <sidebar/>
  <chart-footer/>
  </div>
</template>

<script>
import TwoDimPrtlHist from '@/components/PrtlHists/Prtl2DHist'
import * as types from '@/store/types'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { GridLayout, GridItem } from 'vue-grid-layout'
import Sidebar from '@/components/Sidebar/sidebar.vue'
import ChartFooter from '@/components/Footer/ChartFooter.vue'
export default {

  data () {
    return {
      layout: [],
      wWidth: 0
    }
  },
  computed: {
    ...mapGetters({
      chartMap: types.GET_GRAPH_STATE_MAP,
      chartArr: types.GET_CHART_ARR,
      navbarState: types.GET_NAVBAR_STATE
    }),
    resizeActive () {
      return this.navbarState === 'resize-grid'
    },
    layoutFromStore: {
      get () {
        return this.$store.getters[types.GET_CHART_LAYOUT]
      },
      set (newLayout) {
        this.$store.commit(types.UPDATE_LAYOUT, newLayout)
      }
    }
  },
  methods: {
    subplotComponent (id) {
      if (this.chartMap.get(id)['chartType'] === '2D Histograms') {
        return TwoDimPrtlHist
      } else {
        return 0
      }
    },
    resizedEvent: function (i, newH, newW, newHPx, newWPx) {
      this.$store.commit(types.MUTATE_RENDER_OPTS, {chartID: parseInt(i), wVal: newWPx, hVal: newHPx})
      this.$store.commit(types.MARK_UPDATE, {ids: [parseInt(i)]})
    },
    resized: function () {
      var i
      for (i = 0; i < this.chartArr.length; i++) {
        const bbox = document.getElementById('VueGrid' + this.chartArr[i].toString()).getBoundingClientRect()

        this.$store.commit(types.MUTATE_RENDER_OPTS, {chartID: this.chartArr[i], wVal: bbox.width, hVal: bbox.height})
      }
      this.$store.commit(types.MARK_UPDATE, {ids: JSON.parse(JSON.stringify(this.chartArr))})
    },
    layoutUpdatedEvent: function (newLayout) {
      let filtered
      filtered = newLayout.map((item) => { return { x: item.x, y: item.y, w: item.w, h: item.h, i: item.i } })
      this.$store.commit(types.UPDATE_LAYOUT, filtered)
    }
  },
  created () {
    this.layout = JSON.parse(JSON.stringify(this.layoutFromStore))
  },
  mounted () {
    let that = this
    this.$nextTick(function () {
      window.addEventListener('resize', function (e) {
        // that.wHeight = window.innerHeight
        that.wWidth = window.innerWidth
      })
    })
    this.debouncedResize = _.debounce(this.resized, 200)
    // init
    // this.getWindowSize(that)
  },
  beforeDestroy () {
  // Unregister the event listener before destroying this Vue instance
    window.removeEventListener('resize', this.onResize)
  },
  watch: {
    wWidth (val) {
      this.debouncedResize()
    },
    layoutFromStore (val) {
      if (val) {
        this.layout = JSON.parse(JSON.stringify(this.layoutFromStore))
      }
    }
  },
  components: {
    Sidebar,
    ChartFooter,
    GridLayout,
    GridItem
  }
}
</script>

<style>

</style>
