<template>

  <div class="border-right" :class="$style.sidebar" v-if="open">
    <ul class="nav nav-pills justify-content-center my-3">
      <li class="nav-item">
        <button type="button"
          class="btn mx-3"
          :class = "{'btn-primary': curView === 0, 'btn-outline-secondary': curView !== 0}"
          @click="curView=0">Servers</button>
      </li>
      <li class="nav-item">
        <button type="button"
          class="btn mx-3"
          :class = "{'btn-primary': curView === 1, 'btn-outline-secondary': curView !== 1}"
          @click="curView=1">Simulations</button>
      </li>
      <li class="nav-item">
        <button type="button"
          class="btn mx-3"
          :class = "{'btn-primary': curView === 2, 'btn-outline-secondary': curView !== 2}"
          @click="curView=2">Subplots</button>
      </li>
      <li>
        <router-link :to="{name: 'Help'}">
        <a class="nav-link">Help</a>
        </router-link>

      </li>
    </ul>
    <hr class="mx-4">
    <component :is="components[curView]" />
  </div>
</template>

<script>
import {TweenMax, Power4} from 'gsap'
import * as types from '@/store/types'
import { mapGetters } from 'vuex'
import servers from '@/components/Sidebar/Servers/ServerPanel'
import simulations from '@/components/Sidebar/Sims/SimulationPanel'
import subplots from '@/components/Sidebar/SubplotPanel'

export default {
  name: 'sidebar',
  data () {
    return {
      curView: 0,
      components: ['servers', 'simulations', 'subplots']
    }
  },
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
    const dX = this.open ? 0 : -this.$el.offsetWidth
    TweenMax.to(this.$el, 0.6, {
      x: dX,
      ease: Power4.easeOut
    })
  },
  components: {
    servers,
    simulations,
    subplots
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
      background-color: var(--secondary-color);
  }
</style>
