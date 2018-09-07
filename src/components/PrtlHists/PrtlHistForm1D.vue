<template>
  <div>
  <div id="MyLineFlex">
  <span> Add a histogram: </span>
  <ul class="flex-container wrap">
    <li class="flex-item clickable"
      v-for="(item, index) in myLineArr"
      @click="activeIndex=index"
      :key="index"
      :style="{ background: index === activeIndex ? item.color : 'white',
                color: index === activeIndex ? 'white' : item.color,
                borderColor: item.color}" >
      {{ item.name }}
    </li>
    <li v-if="myLineArr.length < defaultValues.length"
      class="flex-item clickable"
      @click="addLine()"
      :style="{background: 'gainsboro',
                color: 'white',
                borderColor: 'gainsboro'}">
        +
    </li>

  </ul>
  </div>
  <form>
    <div class="form-row ">
      <div class="form-group col-md-4">
        <label for="Line name:">
        Name:
        </label>
        <input v-model="myLineArr[activeIndex].name">
      </div>
    </div>
    <div class="form-row ">
      <div class="form-group col-md-4">
        <label for="chooseSimulation">
          Simulation:
        </label>
        <select class="form-control"
          id="chooseSimulation"
          v-model="myLineArr[activeIndex].sim"
          @change="updateLines({})">
          <option v-for="(item, key) in simArr" :key="item" :value="item">
            {{ simNames[key] }}
          </option>
        </select>
      </div>
      <div class="form-group col-md-4">
        <label for="choosePrtl">
          Particle:
        </label>
        <select class="form-control"
          id="particle"
          v-model="myLineArr[activeIndex].prtl_type"
          @change="updateLines({})">
          <option v-for="item in prtlTypes" :key="item"> {{ item }} </option>
        </select>
      </div>
      <div class="form-group col-md-4">
        <label for="choosePrtl">
          xval:
        </label>
        <select class="form-control"
          id="xVal"
          v-model="myLineArr[activeIndex].xval"
          @change="updateLines({keepView: 'y0y1'})">
          <option v-for="item in prtlQuants" :key="item"> {{ item }} </option>
        </select>
      </div>
    </div>
    <div class="form-row ">
      <div class="form-group col-md-3">
        <label for="vMin"> xvalmin </label>
        <input class="form-control" id="xvalMin"
        v-model.number="myLineArr[activeIndex].xvalmin" @change="updateLines({keepView: 'x0y0y1'})">
      </div>
      <div class="form-group col-md-3">
        <label for="xMax"> xvalmax </label>
        <input class="form-control"  id="xvalMax"
        v-model.number="myLineArr[activeIndex].xvalmax" @change="updateLines({keepView: 'x0y0y1'})">
      </div>
      <div class="form-group col-md-3">
        <label for="xbins"> xbins </label>
        <input type="number" step="1" class="form-control" id="xBins"
        v-model.number="myLineArr[activeIndex].xbins" @change="updateLines({keepView: 'x0x1y0y1'})">
      </div>
      <div class="form-group col-md-3">
        <label for="ChooseWeights"> Weights </label>
        <select class="form-control" id="weights"
        v-model="myLineArr[activeIndex].weights"
        @change="updateLines({keepView: 'x0x1y0y1'})">
          <option> </option>
          <option v-for="item in prtlQuants" :key="item"> {{ item }} </option>
        </select>

      </div>

    </div>
    <div class="form-row pb-3">
      <div class="form-check px-3">
        <input
          class="form-check-input"
          type="checkbox">
          <!--v-model="histOptions.normhist"
          id="NormCheck" @change="updatePlot({key:'normhist'})">-->
        <label class="form-check-label" for="NormCheck">
          Normalize Hist
        </label>
      </div>
      <div class="form-check px-3">
        <input
          class="form-check-input"
          type="checkbox">
          <!--v-model="histOptions.mask_zeros"
          @change="updatePlot({key: 'mask_zeros'})"
          id="MaskCheck">-->
        <label class="form-check-label" for="MaskCheck">
          logscale x
        </label>
      </div>
      <div class="form-check px-3">
        <input
          class="form-check-input"
          type="checkbox">
          <!--v-model="histOptions.clip"
          @change="updatePlot({key: 'clip'})"
          id="ClipValues">-->
        <label class="form-check-label" for="ClipValues">
          logscale y
        </label>
      </div>
    </div>
    <div class="form-row ">
      <div class="col-md-6">
      <button type="button" class="btn btn-light" @click="showColors=!showColors">Change Color</button>
      </div>
      <ul v-if="showColors" class="color-wrapper wrap">
        <li class="color-patch clickable"
          v-for="(val, index) in defaultValues"
          @click="changeColor(index)"
          :key="index"
          :style="{ background: val.color,
                    borderColor: val.color}" >
        </li>
      </ul>

    </div>
    <div v-if="myLineArr.length>1"
      class="form-row ">
      <button type="button"
        class="btn btn-lg btn-danger"
        @click="removeLine(activeIndex)">
        Remove line
        </button>
    </div>
  </form>
  </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
import * as types from '@/store/types'

export default {
  data () {
    return {
      defaultValues: [
        {name: 'Line 1', color: '#4e79a7'},
        {name: 'Line 2', color: '#f28e2b'},
        {name: 'Line 3', color: '#e15759'},
        {name: 'Line 4', color: '#76b6b2'},
        {name: 'Line 5', color: '#59a14f'},
        {name: 'Line 6', color: '#edc948'},
        {name: 'Line 7', color: '#b07aa1'},
        {name: 'Line 8', color: '#ff9da7'},
        {name: 'Line 9', color: '#9c755f'},
        {name: 'Line 10', color: '#bab0ac'}
      ],
      myLineArr: [],
      activeIndex: 0,
      curLine: {},
      showColors: false
    }
  },
  props: ['chartId'],
  methods: {
    ...mapActions({
      toggleGraph: types.TOGGLE_UPDATE,
      updateChartOptions: types.UPDATE_CHART
    }),
    updateLines (payload) {
      console.log(payload)
      if (payload.hasOwnProperty('keepView')) {
        this.updateChartOptions({
          chartID: this.chartId,
          keepView: payload.keepView,
          key: 'lineArr',
          val: JSON.parse(JSON.stringify(this.myLineArr))
        })
      } else {
        this.updateChartOptions({
          chartID: this.chartId,
          keepView: 'x0x1y0y1',
          key: 'lineArr',
          val: JSON.parse(JSON.stringify(this.myLineArr))
        })
      }
      this.toggleGraph({ids: [this.chartId]})
    },
    addLine () {
      var tmpLine = JSON.parse(JSON.stringify(this.myLineArr[this.myLineArr.length - 1]))
      tmpLine.name = this.defaultValues[this.myLineArr.length].name
      tmpLine.color = this.defaultValues[this.myLineArr.length].color
      this.myLineArr.push(tmpLine)
      this.activeIndex = this.myLineArr.length - 1
      this.updateLines({})
    },
    removeLine (ind) {
      this.myLineArr.splice(ind, 1)
      this.activeIndex = (ind < this.myLineArr.length - 1) ? ind : this.myLineArr.length - 1
      this.updateLines({})
    },
    changeColor (ind) {
      this.myLineArr[this.activeIndex].color = this.defaultValues[ind].color
      this.updateLines({})
    }
  },
  computed: {
    ...mapGetters({
      simMap: types.GET_SIM_MAP,
      simArr: types.GET_SIM_ARR,
      chartMap: types.GET_GRAPH_STATE_MAP
    }),
    simNames () {
      var tmpArr = []
      this.simArr.forEach((el) =>
        tmpArr.push(this.simMap.get(el).info.name)
      )
      return tmpArr
    },
    mySim () {
      const tmpArr = this.simArr.filter(id => id === this.myLineArr[this.activeIndex].sim)
      if (tmpArr.length === 0) {
        return {data: {cmaps: ['viridis'], prtls: {ions: {quantities: ['x']}}}}
      } else {
        return this.simMap.get(tmpArr[0])
      }
    },
    prtlTypes () {
      return Object.keys(this.mySim.data.prtls)
    },
    prtlQuants () {
      return this.mySim.data.prtls[this.myLineArr[this.activeIndex].prtl_type].quantities
    }
  },
  created: function () {
    this.myLineArr = JSON.parse(JSON.stringify(this.chartMap.get(this.chartId).dataOptions.lineArr))
    // this.simID = this.chartMap.get(this.chartId).sims[0]
  }
  /*
  },
  props: ['chartId'],
  methods: {
    ...mapActions({
      addSim: types.OPEN_SIMULATION,
      toggleGraph: types.TOGGLE_UPDATE,
      updateChartOptions: types.UPDATE_CHART
    }),
    updatePlot (payload) {
      // WE NEED TO ADD SOME HANDLERS FOR CHANGING SIM
      const tmpObj = {keepView: 'x0x1y0y1'}
      if (payload.hasOwnProperty('keepView')) {
        tmpObj.keepView = payload.keepView
      }
      if (payload.hasOwnProperty('sim')) {
        tmpObj.sim = payload.sim
      }
      if (payload.hasOwnProperty('key')) {
        tmpObj.key = payload.key
        tmpObj.val = this.histOptions[payload.key]
      }
      tmpObj.chartID = this.chartId
      this.updateChartOptions(tmpObj)
      this.toggleGraph({ids: [this.chartId]})
    },
    submitted () {
      this.isSubmitted = true
    }
  },
  computed: {
    ...mapGetters({
      simMap: types.GET_SIM_MAP,
      simArr: types.GET_SIM_ARR,
      chartMap: types.GET_GRAPH_STATE_MAP
    }),
    mySim () {
      const tmpArr = this.simArr.filter(id => id === this.simID)
      if (tmpArr.length === 0) {
        return {data: {cmaps: ['viridis'], prtls: {ions: {quantities: ['x']}}}}
      } else {
        return this.simMap.get(tmpArr[0])
      }
    },
    simNames () {
      var tmpArr = []
      this.simArr.forEach((el) =>
        tmpArr.push(this.simMap.get(el).info.name)
      )
      return tmpArr
    },
    cmapOpts () {
      return this.mySim.data.cmaps
    },
    prtlTypes () {
      return Object.keys(this.mySim.data.prtls)
    },
    prtlQuants () {
      return this.mySim.data.prtls['ions'].quantities
    }
  },
  created: function () {
    this.histOptions = JSON.parse(JSON.stringify(this.chartMap.get(this.chartId).dataOptions))
    this.simID = this.chartMap.get(this.chartId).sims[0]
  }
*/
}
</script>

<style scoped>
#MyLineFlex{
  padding: 25px 0px 50px  0px;
}
.flex-container {
  padding: 0;
  margin: 0;
  list-style: none;
  border: 1px solid silver;
  display: flex;
  flex-wrap: wrap;
  /*height: 150px;*/
}
.color-wrapper {
  padding: 0;
  margin: 5px 0px 25px  0px;
  list-style: none;
  border: 1px solid silver;
  display: flex;
  flex-wrap: wrap;
  /*height: 150px;*/
}
.wrap {
  overflow-y: auto;
}
.clickable {
  cursor: pointer;
}
.flex-item {
  color: white;
  padding: 5px 10px 5px 10px;
  min-width: 60px;
  height: 50px;
  margin: 10px;
  border-style: solid;
  border-width: 5px;
  /*line-height: 20px;*/
  font-weight: bold;
  font-size: 1.25em;
  text-align: center;
}
.color-patch {
  color: white;
  padding: 10px 10px 10px 10px;
  min-width: 20px;
  height: 30px;
  margin: 10px;
  border-style: solid;
  border-width: 5px;
  /*line-height: 20px;*/
  font-weight: bold;
  font-size: 1.25em;
  text-align: center;
}
</style>
