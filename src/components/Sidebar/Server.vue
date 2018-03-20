<template>
  <!--
  THE VUE COMPONENT THAT MANAGES EACH CHART
  -->
  <div>
  </div>
</template>

<script>
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
  }
}
</script>

<style>

</style>
