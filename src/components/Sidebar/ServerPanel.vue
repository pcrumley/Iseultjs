<template>
  <!--
  THE VUE COMPONENT THAT MANAGES EACH CHART
  -->
    <div>
      <!--<server v-for="(item, key) in chartArr" :key="key" :serverID="item[0]">
      </server> -->
      SERVER PANEL NOT YET IMPLEMENTED
    </div>

</template>

<script>
import server from '@/components/Sidebar/server'
import * as types from '@/store/types'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      graphMap: types.GET_SERVER_MAP
    }),
    serverArr () {
      var tmpArr = []
      for (var key in this.serverArr.entries()) {
        tmpArr.push([key])
      }
      return tmpArr
    }
  },
  components: {
    server
  }
}
</script>

<style>

</style>
