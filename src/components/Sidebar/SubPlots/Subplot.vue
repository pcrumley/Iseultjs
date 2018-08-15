<template>
  <!--
  THE VUE COMPONENT THAT MANAGES EACH SUBPLOT
  -->
  <div class="card my-2 ">
  <div class="card-header text-left clickable" @click="active = !active">
    <span>Subplot {{ chartID }}</span>
    <div class="float-right" ><font-awesome-icon :icon="icon" /></div>
  </div>
  <div class="card-body" v-if="active" >
    <component :is="subplotOptsComponent" :chart-id="chartID">
    </component>
    <button class="btn btn-danger float-right" @click="removeChart">Remove</button>
  </div>
  </div>
</template>

<script>
import * as types from '@/store/types'
import { mapGetters, mapActions } from 'vuex'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import faMinus from '@fortawesome/fontawesome-free-solid/faMinus'
import prtlHistForm from '@/components/PrtlHists/PrtlHistForm'
import prtlHistForm1D from '@/components/PrtlHists/PrtlHistForm1D'

export default {
  data () {
    return {
      active: false
    }
  },
  props: ['chartID'],
  methods: {
    ...mapActions({
      delGraph: types.DEL_GRAPH
    }),
    removeChart: function () {
      this.delGraph({id: this.chartID})
      this.active = false
    }
  },
  computed: {
    ...mapGetters({
      chartMap: types.GET_GRAPH_STATE_MAP
    }),

    subplotOptsComponent () {
      if (this.chartMap.get(this.chartID)['chartType'] === '2D Prtl Histogram') {
        return prtlHistForm
      } else if (this.chartMap.get(this.chartID)['chartType'] === '1D Prtl Histogram') {
        return prtlHistForm1D
      }
    },

    myChart () {
      return this.chartMap.get(this.chartID)
    },
    icon () {
      if (this.active) {
        return faMinus
      } else {
        return faPlus
      }
    }
  },
  components: {
    FontAwesomeIcon
  }

}
</script>

<style scoped>
.clickable {cursor: pointer;}
div.card-header:hover {
  background-color: #E8E8E8;
}
</style>
