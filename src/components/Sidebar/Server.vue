<template>
  <!--
  THE VUE COMPONENT THAT MANAGES EACH CHART
  -->
  <div>
  <div>
    <component v-for="(item, key) in chartArr" :key="key" :serverID="item[0]">
    </component>
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
      graphMap: types.GET_SERVER_MAP
    }),
    serverArr () {
      var tmpArr = []
      for (var key in this.serverArr.entries()) {
        tmpArr.push([key])
      }
      return tmpArr
    }
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
