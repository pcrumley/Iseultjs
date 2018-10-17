<template>
  <div>
  <div id="MyLineFlex">
  <span> Add a 1D moment: </span>
  <ul class="flex-container wrap">
    <li class="flex-item clickable"
      v-for="(item, index) in lineArr"
      @click="activeIndex=index"
      :key="index"
      :style="{ background: index === activeIndex ? item.color : 'white',
                color: index === activeIndex ? 'white' : item.color,
                borderColor: item.color}" >
      {{ item.name }}
    </li>
    <li class="flex-item clickable"
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
        <input v-model="curLine.name" @change="changeName()">
      </div>
    </div>
    <div class="form-row ">
      <div class="form-group col-md-4">
        <label for="chooseSimulation">
          Simulation:
        </label>
        <select class="form-control"
          id="chooseSimulation"
          v-model="curLine.sim"
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
          v-model="curLine.prtl_type"
          @change="updateLines({})">
          <option v-for="item in prtlTypes" :key="item"> {{ item }} </option>
        </select>
      </div>
    </div>
    <div class="form-row ">
      <div class="form-group col-md-4">
        <label for="chooseXval">
          xval:
        </label>
        <select class="form-control"
          id="xVal"
          v-model="curLine.xval"
          @change="updateLines({keepView: 'y0y1'})">
          <option v-for="item in prtlQuants" :key="item"> {{ item }} </option>
        </select>
      </div>
      <div class="form-group col-md-4">
        <label for="chooseYval">
          yval:
        </label>
        <select class="form-control"
          id="xVal"
          v-model="curLine.yval"
          @change="updateLines({keepView: 'x0x1'})">
          <option v-for="item in prtlQuants" :key="item"> {{ item }} </option>
        </select>
      </div>
    </div>
    <div class="form-row ">
      <div class="form-group col-md-3">
        <label for="vMin"> xvalmin </label>
        <input class="form-control" id="xvalMin"
        v-model.number="curLine.xvalmin" @change="updateLines({keepView: 'x0y0y1'})">
      </div>
      <div class="form-group col-md-3">
        <label for="xMax"> xvalmax </label>
        <input class="form-control"  id="xvalMax"
        v-model.number="curLine.xvalmax" @change="updateLines({keepView: 'x0y0y1'})">
      </div>
      <div class="form-group col-md-3">
        <label for="xbins"> xbins </label>
        <input type="number" step="1" class="form-control" id="xBins"
        v-model.number="curLine.xbins" @change="updateLines({keepView: 'x0x1y0y1'})">
      </div>
      <div class="form-group col-md-3">
        <label for="ChooseWeights"> Weights </label>
        <select class="form-control" id="weights"
        v-model="curLine.weights"
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
          type="checkbox"
          v-model="normHist"
          id="NormCheck"
          @change="updatePlot({key:'normhist', val:normHist})">
        <label class="form-check-label" for="NormCheck">
          Normalize Hist
        </label>
      </div>
      <div class="form-check px-3">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="xlog"
          @change="updatePlot({key:'xscale', val: xlog ? 'log': 'linear'})"
          >
        <label class="form-check-label" for="MaskCheck">
          logscale x
        </label>
      </div>
      <div class="form-check px-3">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="ylog"
          @change="updatePlot({key:'yscale', val: ylog ? 'log': 'linear'})"
        >
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
          v-for="(val, index) in colors"
          @click="changeColor(index)"
          :key="index"
          :style="{ background: val,
                    borderColor: val}" >
        </li>
      </ul>

    </div>
    <div v-if="lineArr.length>1"
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
      colors: [
        '#4e79a7',
        '#f28e2b',
        '#e15759',
        '#76b6b2',
        '#59a14f',
        '#edc948',
        '#b07aa1',
        '#ff9da7',
        '#9c755f',
        '#bab0ac'
      ],
      curLine: {
        name: 'Line 1',
        color: '#4e79a7',
        prtl_type: 'ions',
        xval: 'x',
        yval: 'px',
        weights: '',
        boolstr: '',
        xbins: 50,
        xvalmin: '',
        xvalmax: ''
      },
      lineArr: [{
        name: 'Line 1',
        color: '#4e79a7',
        key: 0
      }],
      myLineMap: new Map(),
      activeIndex: 0,
      maxKey: 0,
      xlog: false,
      normHist: false,
      ylog: false,
      showColors: false
    }
  },
  props: ['chartId'],
  methods: {
    ...mapActions({
      toggleGraph: types.TOGGLE_UPDATE,
      updateChartOptions: types.UPDATE_CHART
    }),
    changeName () {
      this.updateLines({})
      this.refreshLineArr()
    },
    refreshLineArr () {
      this.lineArr = []
      this.myLineMap.forEach((val, key) => {
        this.maxKey = Math.max(key, this.maxKey)
        this.lineArr.push({
          key: key,
          name: val.name,
          color: val.color
        })
      })
    },
    updateLines (payload) {
      var tmpObj = {}
      Object.entries(this.curLine)
        .forEach(x => { tmpObj[x[0]] = x[1] })
      this.myLineMap.set(this.activeKey, tmpObj)
      if (payload.hasOwnProperty('keepView')) {
        this.updateChartOptions({
          chartID: this.chartId,
          keepView: payload.keepView,
          key: 'lineMap',
          val: this.myLineMap
        })
      } else {
        this.updateChartOptions({
          chartID: this.chartId,
          keepView: 'x0x1y0y1',
          key: 'lineMap',
          val: this.myLineMap
        })
      }
      this.toggleGraph({ids: [this.chartId]})
    },
    updatePlot (payload) {
      if (payload.hasOwnProperty('keepView')) {
        this.updateChartOptions({
          chartID: this.chartId,
          keepView: payload.keepView,
          key: payload.key,
          val: payload.val
        })
      } else {
        this.updateChartOptions({
          chartID: this.chartId,
          keepView: 'x0x1y0y1',
          key: payload.key,
          val: payload.val
        })
      }
      this.toggleGraph({ids: [this.chartId]})
    },
    addLine () {
      var tmpLine = JSON.parse(JSON.stringify(this.myLineMap.get(this.myLineMap.keys().next().value)))
      this.maxKey += 1
      tmpLine.name = `Line ${this.maxKey + 1}`
      tmpLine.color = this.colors[this.maxKey % this.colors.length]
      this.myLineMap.set(this.maxKey, tmpLine)
      this.refreshLineArr()
      this.activeIndex = this.lineArr.length - 1
      this.curLine = {}
      Object.entries(this.myLineMap.get(this.activeKey))
        .forEach(x => { this.curLine[x[0]] = x[1] })
      this.updateLines({})
    },
    removeLine (ind) {
      this.myLineMap.delete(this.activeKey)
      this.refreshLineArr()
      this.activeIndex = (ind < this.lineArr.length - 1) ? ind : this.lineArr.length - 1
      this.curLine = {}
      Object.entries(this.myLineMap.get(this.lineArr[this.activeIndex].key))
        .forEach(x => { this.curLine[x[0]] = x[1] })
      this.updateLines({})
    },
    changeColor (ind) {
      this.myLineMap.get(this.activeKey).color = this.colors[ind]
      this.curLine.color = this.colors[ind]
      this.refreshLineArr()
      this.updateLines({})
    }
  },
  watch: {
    activeKey: function () {
      this.curLine = {}
      Object.entries(this.myLineMap.get(this.activeKey))
        .forEach(x => { this.curLine[x[0]] = x[1] })
    }
  },
  computed: {
    ...mapGetters({
      simMap: types.GET_SIM_MAP,
      simArr: types.GET_SIM_ARR,
      chartMap: types.GET_GRAPH_STATE_MAP
    }),
    activeKey () {
      return this.lineArr[this.activeIndex].key
    },
    simNames () {
      var tmpArr = []
      this.simArr.forEach((el) =>
        tmpArr.push(this.simMap.get(el).info.name)
      )
      return tmpArr
    },
    mySim () {
      const tmpArr = this.simArr.filter(id => id === this.curLine.sim)
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
      return this.mySim.data.prtls[this.curLine.prtl_type].quantities
    }
  },
  created: function () {
    this.chartMap.get(this.chartId).dataOptions.lineMap.forEach((val, key) => {
      this.myLineMap.set(key, JSON.parse(JSON.stringify(val)))
    })
    this.refreshLineArr()
    this.activeIndex = this.lineArr.length - 1
    this.curLine = {}
    Object.entries(this.myLineMap.get(this.activeKey))
      .forEach(x => { this.curLine[x[0]] = x[1] })
    this.normHist = this.chartMap.get(this.chartId).dataOptions.normhist
    this.xlog = this.chartMap.get(this.chartId).dataOptions.xscale === 'log'
    this.Ylog = this.chartMap.get(this.chartId).dataOptions.yscale === 'log'
  }
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
