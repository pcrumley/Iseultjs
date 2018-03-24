<template>
  <!--
  THE VUE COMPONENT THAT MANAGES EACH CHART
  -->
  <div class="card my-2 ">
  <div class="card-header text-left clickable" @click="active = !active">
    <span>{{ myServer.name }}</span>
    <div class="float-right" ><font-awesome-icon :icon="icon" /></div>
  </div>
  <div class="card-body" v-if="active" >
    <!--<h5 class="card-title"> URL: {{ myServer.url }}</h5>-->
    <p class="card-text text-left">URL: {{ myServer.url }}</p>
    <p class="card-text text-left">Available Sim Types:
      <span v-for="(item, key) in myServer.simTypes" :key=key > {{ item }} </span>
    </p>
    <p class="card-text text-left">Base Directory: {{ myServer.serverDir }}</p>
    <button class="btn btn-danger float-right" @click="removeServer({id: serverID})">Remove</button>
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
  props: ['serverID'],
  methods: {
    ...mapActions({
      removeServer: types.DEL_SERVER
    })
  },
  computed: {
    ...mapGetters({
      serverMap: types.GET_SERVER_MAP
    }),
    myServer () {
      return this.serverMap.get(this.serverID)
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
