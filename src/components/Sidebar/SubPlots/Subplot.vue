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
    {{ myChart }}
    <!--<h5 class="card-title"> URL: {{ myServer.url }}</h5>-->
    <!--<button class="btn btn-danger float-right" @click="removeServer({id: serverID})">Remove</button>-->
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
      active: false
    }
  },
  props: ['chartID'],
  methods: {
    ...mapActions({
      removeServer: types.DEL_SERVER
    })
  },
  computed: {
    ...mapGetters({
      chartMap: types.GET_GRAPH_STATE_MAP
    }),
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
