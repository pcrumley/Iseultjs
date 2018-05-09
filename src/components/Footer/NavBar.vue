<template>
<span class="align-middle" id="MyNavBar" >
  <font-awesome-icon class="clickable"  size="sm" :icon="homeIcon" @click="goHome"/>
  <!--<font-awesome-icon class="clickable" :icon="undoIcon" />-->
  <!--<font-awesome-icon class="clickable" :icon="redoIcon" />-->
  <!--<font-awesome-icon class="clickable" :icon="arrowsIcon" /-->
  <span class="clickable p-1 px-2" :class="{active: zoomClicked}"  @click="setNavState('zoom-in')">
  <font-awesome-icon  size="sm" :icon="searchIcon"/>
  </span>
</span>
</template>
<script>
import faHome from '@fortawesome/fontawesome-free-solid/faHome'
import faUndo from '@fortawesome/fontawesome-free-solid/faUndoAlt'
import faRedo from '@fortawesome/fontawesome-free-solid/faRedoAlt'
import faArrows from '@fortawesome/fontawesome-free-solid/faArrowsAlt'
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
    homeIcon () {
      return faHome
    },
    undoIcon () {
      return faUndo
    },
    redoIcon () {
      return faRedo
    },
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
.clickable {cursor: pointer;}
#MyNavBar{
  color: var(--primary-color);
  opacity: 1;
  user-select: none;
}
.active{
  background-color:  var(--secondary-color);
  outline: 1px solid black;
}
</style>
