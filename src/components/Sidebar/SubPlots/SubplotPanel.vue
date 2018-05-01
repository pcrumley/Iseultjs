<template>
  <!--
  THE SIDEBAR PANEL THAT LAYS OUT THE SERVER COMPONENTS
  -->
  <div class="mx-4 text-center">
    <subplot v-for="(item, key) in chartArr" :key="key" :chartID="item">
    </subplot>
    <add-subplot/>
  </div>

</template>

<script>
import subplot from '@/components/Sidebar/SubPlots/Subplot'
import AddSubplot from '@/components/Sidebar/SubPlots/AddSubplot'
import * as types from '@/store/types'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      chartArr: types.GET_CHART_ARR,
      chartMap: types.GET_GRAPH_STATE_MAP
    })
  },
  components: {
    subplot,
    AddSubplot
  }
}
</script>

<style>
</style>
