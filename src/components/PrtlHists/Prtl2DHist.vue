<template>
  <iseult-image-graph :histOpts="histOptions" :myRefresh="refreshPlot" />
</template>

<script>
import ImageGraph from '@/components/GraphHelpers/ImageGraph'
import { mapGetters, mapActions } from 'vuex'
import * as types from '@/store/types'
export default {
  // data () {
  //  return {
  //  }
  // },
  methods: {
    ...mapActions({
      addSim: types.OPEN_SIMULATION
    }),
    submitted () {
      this.isSubmitted = true
    }
  },
  computed: {
    ...mapGetters({
      simObj: types.GET_GRAPH_STATE
    }),
    mySim () {
      if (this.simObj.length === 0) {
        return {data: {cmaps: ['viridis'], prtls: {ions: {quantities: ['x']}}}}
      } else {
        return this.simObj.find(el => el.info.simID === this.simID)
      }
    },
    cmapOpts () {
      return this.mySim.data.cmaps
    },
    prtlQuants () {
      return this.mySim.data.prtls['ions'].quantities
    }
  },
  /* mounted:
    this.$store.state.dispatch(types.AJAX_SIMULATION,
      { simID: 0,
        name: 'TestData',
        serverID: 0,
        serverURL: 'http://localhost:5000',
        simType: 'tristan-mp',
        outdir: './test_output'}), */
  components: {
    iseultImageGraph: ImageGraph
  }
}
</script>

<style src="bulma/css/bulma.css">

</style>
