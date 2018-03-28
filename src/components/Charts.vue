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
  <sidebar-toggle/>
  </div>
</template>

<script>
import TwoDimPrtlHist from '@/components/PrtlHists/Prtl2DHist'
import * as types from '@/store/types'
import { mapGetters } from 'vuex'
import Sidebar from '@/components/Sidebar/sidebar.vue'
import SidebarToggle from '@/components/Sidebar/sidebarToggle.vue'

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
    SidebarToggle
  }
}
</script>

<style>

</style>
