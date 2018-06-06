<template>
<span class="align-middle" id="MyNavBar" >
  <span class="clickable py-1 px-1"  @click="goHome">
    <font-awesome-icon  size="sm" :icon="homeIcon"/>
  </span>
  <!--<font-awesome-icon class="clickable" :icon="undoIcon" />-->
  <!--<font-awesome-icon class="clickable" :icon="redoIcon" />-->
  <span class="clickable px-1 py-1" :class="{active: gridClicked}"  @click="setNavState('resize-grid')">
  <font-awesome-icon size="sm" :icon="gridIcon"/>
  </span>
  <span class="clickable px-1 py-1" :class="{active: panClicked}"  @click="setNavState('pan')">
  <font-awesome-icon size="sm" :icon="arrowsIcon"/>
  </span>
  <span class="clickable px-1 py-1" :class="{active: zoomClicked}"  @click="setNavState('zoom-in')">
  <font-awesome-icon  size="sm" :icon="searchIcon"/>
  </span>
  <span class="clickable px-1 py-1" :class="{active: lassoClicked}"  @click="setNavState('lasso')">
  <!--<font-awesome-icon  size="sm" :icon="searchIcon"/>-->
  lasso
  </span>
</span>
</template>
<script>
import faHome from '@fortawesome/fontawesome-free-solid/faHome'
// import faUndo from '@fortawesome/fontawesome-free-solid/faUndoAlt'
// import faRedo from '@fortawesome/fontawesome-free-solid/faRedoAlt'
import faArrows from '@fortawesome/fontawesome-free-solid/faArrowsAlt'
import faTh from '@fortawesome/fontawesome-free-solid/faTh'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearchPlus'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import * as types from '@/store/types'
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      navbarState: types.GET_NAVBAR_STATE
    }),
    zoomClicked () {
      return this.navbarState === 'zoom-in'
    },
    panClicked () {
      return this.navbarState === 'pan'
    },
    gridClicked () {
      return this.navbarState === 'resize-grid'
    },
    lassoClicked () {
      return this.navbarState === 'lasso'
    },
    homeIcon () {
      return faHome
    },
    gridIcon () {
      return faTh
    },
    // undoIcon () {
    //  return faUndo
    // },
    // redoIcon () {
    //  return faRedo
    // },
    arrowsIcon () {
      return faArrows
    },
    searchIcon () {
      return faSearch
    }
  },
  components: {
    FontAwesomeIcon
  },
  methods: {
    ...mapActions({
      setNavState: types.SET_NAVBAR_STATE,
      goHome: types.GO_HOME
    })
  }
}
</script>

<style scoped>
.clickable {cursor: pointer;
  border: 1px solid transparent;
}
#MyNavBar{
  color: var(--primary-color);
  opacity: 1;
  user-select: none;
}
.active{
  background-color: #2c3e50;
  color: whiteSmoke;
  border: 1px solid #2c3e50;
  border-radius: 3px
}
</style>
