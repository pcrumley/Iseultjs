<template>
  <div>
  <button v-if="!active" button type="button" class="btn btn-success btn-lg btn-block" @click="openAddSubplotPanel">Add new chart</button>
  <div class="card my-2 " v-if="active">
  <div class="card-header text-left">
    Add new chart
  </div>
  <div class="card-body text-left" >
    <form>
      <div class="form-row form-group">
        <label for="chooseSubplotType" class='col-form-label col-sm-5'> Choose Chart Type: </label>
        <select class="form-control col-sm-5" id="chooseSubplotType" v-model="subplotType">
          <option v-for="(item, key) in chartTypeArr" :key="item" :value="key">
            {{ chartTypeArr[key] }}
          </option>
        </select>
      </div>
    </form>
    <component :is="subplotOptsComponent" :chart-id="nextChartID">
    </component>
    <div class="mx-auto text-right">
      <button type="button"
        class="btn btn-lg btn-danger"
        @click="active=false">
        Cancel
        </button>

    <button type="button"
      class="btn btn-lg btn-success"
      @click="wrappedAddSubplot">
        Add Chart
    </button>
  </div>
</div>
</div>
</div>
</template>

<script>
import prtlHistForm from '@/components/PrtlHists/PrtlHistForm'
import prtlHistForm1D from '@/components/PrtlHists/PrtlHistForm1D'
import * as types from '@/store/types'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SplashPage',
  data () {
    return {
      active: false,
      subplotType: 0
    }
  },
  computed: {
    ...mapGetters({
      chartTypeArr: types.AVAIL_CHART_TYPES,
      nextChartID: types.GET_NEXT_CHART_ID,
      simArr: types.GET_SIM_ARR
    }),
    subplotOptsComponent () {
      if (this.chartTypeArr[this.subplotType] === '2D Prtl Histogram') {
        return prtlHistForm
      } else if (this.chartTypeArr[this.subplotType] === '1D Prtl Histogram') {
        return prtlHistForm1D
      } else {
        return 0
      }
    }
  },
  watch: {
    subplotType: function () {
      this.changeChartType({
        chartID: this.nextChartID,
        chartType: this.chartTypeArr[this.subplotType],
        simID: this.simArr[0]
      })
    }
  },
  methods: {
    ...mapActions({
      addGraph: types.ADD_GRAPH,
      openGraph: types.OPEN_GRAPH,
      changeChartType: types.CHANGE_CHART_TYPE
    }),
    openAddSubplotPanel () {
      this.openGraph({
        chartType: '2D Prtl Histogram',
        simID: this.simArr[0]})

      this.active = true
      // this.openGraph({chartType: this.chartTypeArr[this.subplotType]})
    },
    wrappedAddSubplot () {
      this.active = false
      this.addGraph({id: this.nextChartID, chartType: this.chartTypeArr[this.subplotType]})
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
label {
  text-align: left;
}
.has-failure {
  border: 2px solid red;
}
.has-success {
  border: 2px solid green;
}

</style>
