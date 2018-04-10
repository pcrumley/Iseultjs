<template>
<span class="align-middle py-0" id="SimNavBar" >
  Sim:
  <form class="form-inline" style="display: inline">
    <select class="form-control" id="chooseSims" v-model="simID">
    <option v-for="(item, key) in simArr" :key="item" :value="item">
      {{ simNames[key] }}
    </option>
    </select>
  </form>
  {{ simN }} {{mySim.i}}
  <font-awesome-icon class="clickable" :icon="stepBackIcon" />
  <font-awesome-icon class="clickable" :icon="playIcon" />
  <font-awesome-icon class="clickable" :icon="stepForwardsIcon" />
  <input class="align-middle  "
    type="range"
    min="0"
    :max="maxInd"
    v-model.number="curInd"
  >
</span>
</template>
<script>
import faStepBackward from '@fortawesome/fontawesome-free-solid/faStepBackward'
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay'
import faStepForward from '@fortawesome/fontawesome-free-solid/faStepForward'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { mapGetters, mapActions } from 'vuex'
import * as types from '@/store/types'

export default {
  data () {
    return {
      simID: 1,
      curInd: 0
    }
  },
  computed: {
    ...mapGetters({
      simMap: types.GET_SIM_MAP,
      simArr: types.GET_SIM_ARR,
      simUpdated: types.GET_SIM_UPDATED
    }),
    mySim () {
      const tmpArr = this.simArr.filter(id => id === this.simID)
      if (tmpArr.length === 0) {
        return {}
      } else {
        return this.simMap.get(tmpArr[0])
      }
    },
    simN () {
      try {
        return this.mySim.data.fileArray[this.curInd]
      } catch (e) {
        return 0
      }
    },
    maxInd () {
      try {
        return this.mySim.data.fileArray.length - 1
      } catch (typeError) {
        return 0
      }
    },
    simNames () {
      var tmpArr = []
      this.simArr.forEach((el) =>
        tmpArr.push(this.simMap.get(el).info.name)
      )
      return tmpArr
    },
    stepBackIcon () {
      return faStepBackward
    },
    playIcon () {
      return faPlay
    },
    stepForwardsIcon () {
      return faStepForward
    }
  },
  watch: {
    mySim: function (newSim) {
      this.curInd = newSim.i
    },
    curInd: function (newInd, oldInd) {
      this.changeTStep({id: this.simID, ind: newInd})
    }
  },
  methods: {
    ...mapActions({
      changeTStep: types.CHANGE_SIM_TSTEP
    })
  },
  components: {
    FontAwesomeIcon
  }
}
</script>

<style scoped>

.clickable {cursor: pointer;}
#SimNavBar{
  user-select: none;
}

</style>
