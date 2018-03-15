<template>
  <!--
  THE VUE COMPONENT THAT MANAGES EACH CHART
  -->
  <div>
    <component v-for="(item, key) in chartArr" :key="key" :is="item[1]" :chartID="item[0]">
    </component>
  </div>
</template>

<script>
import TwoDimPrtlHist from '@/components/PrtlHists/Prtl2DHist'
import * as types from '@/store/types'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      graphMap: types.GET_GRAPH_STATE_MAP
    }),
    chartArr () {
      var tmpArr = []
      for (var [key, value] of this.graphMap.entries()) {
        tmpArr.push([key, value.chartType])
      }
      return tmpArr
    }
  },
  components: {
    twoDPrtlHist: TwoDimPrtlHist
  }
}
</script>

<style>

</style>
