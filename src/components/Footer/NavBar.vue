<template>
<span class="align-middle" id="MyNavBar" >
  <font-awesome-icon class="clickable" :icon="homeIcon" />
  <font-awesome-icon class="clickable" :icon="undoIcon" />
  <font-awesome-icon class="clickable" :icon="redoIcon" />
  <font-awesome-icon class="clickable" :icon="arrowsIcon" />
  <font-awesome-icon class="clickable" :icon="searchIcon" @click="setNavSate('zoom-in')"/>
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
import { mapActions } from 'vuex'

export default {
  computed: {
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
      setNavState: types.SET_NAVBAR_STATE
    })
  }
}
</script>

<style scoped>
/*.clickable {cursor: pointer;}*/
#MyNavBar{
  opacity:0.1;
  user-select: none;
}

</style>
