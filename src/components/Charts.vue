<template>
  <!--
  THE VUE COMPONENT THAT MANAGES EACH CHART
  -->
  <div>
  <component v-for="(item, key) in chartArr" :key="key" :is="subplotComponent(item)" :chartID="item">
  </component>
  <sidebar/>
  <chart-footer/>
  </div>
</template>

<script>
import TwoDimPrtlHist from '@/components/PrtlHists/Prtl2DHist'
import * as types from '@/store/types'
import { mapGetters } from 'vuex'
import Sidebar from '@/components/Sidebar/sidebar.vue'
import ChartFooter from '@/components/Footer/ChartFooter.vue'
export default {
  computed: {
    ...mapGetters({
      chartMap: types.GET_GRAPH_STATE_MAP,
      chartArr: types.GET_CHART_ARR
    })
  },
  methods: {
    subplotComponent (id) {
      if (this.chartMap.get(id)['chartType'] === '2D Histograms') {
        return TwoDimPrtlHist
      } else {
        return 0
      }
    }
  },
  components: {
    Sidebar,
    ChartFooter
  }
}
</script>

<style>

</style>
