<template>
<span class="align-middle" id="MyNavBar" >
  <font-awesome-icon class="clickable" :icon="homeIcon" />
  <font-awesome-icon class="clickable" :icon="undoIcon" />
  <font-awesome-icon class="clickable" :icon="redoIcon" />
  <font-awesome-icon class="clickable" :icon="arrowsIcon" />
  <font-awesome-icon class="clickable" :icon="searchIcon" />
</span>
</template>
<script>
import faHome from '@fortawesome/fontawesome-free-solid/faHome'
import faUndo from '@fortawesome/fontawesome-free-solid/faUndoAlt'
import faRedo from '@fortawesome/fontawesome-free-solid/faRedoAlt'
import faArrows from '@fortawesome/fontawesome-free-solid/faArrowsAlt'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
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
