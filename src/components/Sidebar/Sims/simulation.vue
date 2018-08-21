<template>
  <!--
  THE VUE COMPONENT THAT MANAGES THE SIMULATION STATE
  -->
  <div class="card my-2 ">
  <div class="card-header text-left clickable" @click="isActive = !isActive">
    <span>{{ mySim.info.name }}@{{ mySim.info.serverName }}</span>
    <div class="float-right" ><font-awesome-icon :icon="icon" /></div>
  </div>
  <div class="card-body" v-if="isActive" >
    <!--<h5 class="card-title"> URL: {{ myServer.url }}</h5>-->
    <p class="card-text text-left">{{mySim}}</p>
    <button class="btn btn-danger float-right" @click="removeSim({id: simID})">Remove</button>
  </div>
</div>
</template>

<script>
import * as types from '@/store/types'
import { mapGetters, mapActions } from 'vuex'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import faMinus from '@fortawesome/fontawesome-free-solid/faMinus'

export default {
  data () {
    return {
      isActive: false
    }
  },
  props: ['simID'],
  methods: {
    ...mapActions({
      removeSim: types.DEL_SIMULATION
    })
  },
  computed: {
    ...mapGetters({
      simMap: types.GET_SIM_MAP
    }),
    mySim () {
      return this.simMap.get(this.simID)
    },
    icon () {
      if (this.isActive) {
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
