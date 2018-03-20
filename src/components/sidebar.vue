<template>
  <div :class="$style.sidebar" v-if="open">
    {{ serverMap }}
  </div>
</template>

<script>
import {TweenMax, Power4} from 'gsap'
import * as types from '@/store/types'
import { mapGetters } from 'vuex'

export default {
  name: 'sidebar',
  /*
  mounted () {
    TweenMax.set(this.$el, {
      x: -this.$el.offsetWidth
    })
  },
  */
  computed: {
    ...mapGetters({
      serverMap: types.GET_SERVER_MAP
    }),
    open () {
      return this.$store.state.ui.sidebarOpen
    }
  },
  watch: {
    open: function (open) {
      const dX = open ? 0 : -this.$el.offsetWidth
      TweenMax.to(this.$el, 0.6, {
        x: dX,
        ease: Power4.easeOut
      })
    }
  },
  mounted: function () {
    this.$store.dispatch('toggleSidebar')
  }
}
</script>

<style module>
  .sidebar{
    position: fixed;
    left: 0;
    top: 0;
    width: 500px;
    height: 100vh;
    max-width: 90vw;
    background-color: var(--accent-color);
  }
</style>
