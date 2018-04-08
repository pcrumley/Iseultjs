<template>
  <!--
  THE VUE COMPONENT THAT MANAGES EACH CHART
  -->
  <div>
  <div>
    GRAPHS HERE--- FIX!
    <!--
    <component v-for="(item, key) in chartArr" :key="key" :is="" :chartID="item[0]">
    </component>
    -->
  </div>
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
      graphMap: types.GET_GRAPH_STATE_MAP,
      chartArr: types.GET_CHART_ARR
    })
  },
  components: {
    twoDPrtlHist: TwoDimPrtlHist,
    Sidebar,
    ChartFooter
  }
}
</script>

<style>

</style>
