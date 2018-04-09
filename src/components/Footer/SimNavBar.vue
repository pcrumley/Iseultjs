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
  {{ simN }} {{ curInd }}
  <font-awesome-icon class="clickable" :icon="stepBackIcon" />
  <font-awesome-icon class="clickable" :icon="playIcon" />
  <font-awesome-icon class="clickable" :icon="stepForwardsIcon" />
  <input class="align-middle  "
    type="range"
    min="10"
    max="2000"
  >
</span>
</template>
<script>
import faStepBackward from '@fortawesome/fontawesome-free-solid/faStepBackward'
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay'
import faStepForward from '@fortawesome/fontawesome-free-solid/faStepForward'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { mapGetters } from 'vuex'
import * as types from '@/store/types'

export default {
  data () {
    return {
      simID: 0,
      simN: 0 // the value of N file of sim.
    }
  },
  computed: {
    ...mapGetters({
      simMap: types.GET_SIM_MAP,
      simArr: types.GET_SIM_ARR
    }),
    mySim () {
      const tmpArr = this.simArr.filter(id => id === this.simID)
      if (tmpArr.Length === 0) {
        return {}
      } else {
        return this.simMap.get(tmpArr[0])
      }
    },
    curInd () {
      try {
        return this.mySim.i
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
    curInd: function (newInd, oldInd) {
      try {
        this.simN = this.mySim.data.fileArray[newInd]
      } catch (e) {
        this.simN = 0
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
#SimNavBar{
  user-select: none;
}

</style>
