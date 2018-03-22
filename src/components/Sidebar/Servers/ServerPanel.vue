<template>
  <!--
  THE VUE COMPONENT THAT MANAGES EACH CHART
  -->
  <div class="mx-4 text-center">
    <server v-for="(item, key) in serverArr" :key="key" :serverID="item">
    </server>
    <add-server/>
  </div>

</template>

<script>
import server from '@/components/Sidebar/Servers/server'
import AddServer from '@/components/Sidebar/Servers/AddServer'
import * as types from '@/store/types'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      serverArr: types.GET_SERVER_ARR
    })
  },
  components: {
    server,
    AddServer
  }
}
</script>

<style>
</style>
