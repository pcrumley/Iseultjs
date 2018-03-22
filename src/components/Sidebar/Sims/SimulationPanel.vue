<template>
  <!--
  THE VUE COMPONENT THAT MANAGES EACH CHART
  -->
  <div class="mx-4 text-center">
    <pic-sim v-for="(item, key) in simArr" :key="key" :simID="item">
    </pic-sim>

  </div>

</template>

<script>
import simulation from '@/components/Sidebar/Sims/simulation'
import AddServer from '@/components/Sidebar/Servers/AddServer'
import * as types from '@/store/types'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      simArr: types.GET_SIM_ARR
    })
  },
  components: {
    picSim: simulation,
    AddServer
  }
}
</script>

<style>
</style>
