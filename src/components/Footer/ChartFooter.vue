<template>
<div id="footer">
  <sidebar-toggle/>
  <span class="align-middle" id="MyNavBar" >
    <font-awesome-icon class="clickable" :icon="homeIcon" />
    <font-awesome-icon class="clickable" :icon="undoIcon" />
    <font-awesome-icon class="clickable" :icon="redoIcon" />
    <font-awesome-icon class="clickable" :icon="arrowsIcon" />
    <font-awesome-icon class="clickable" :icon="searchIcon" />
  </span>

</div>
</template>

<script>
import SidebarToggle from '@/components/Footer/sidebarToggle.vue'
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
    SidebarToggle,
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
#footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 70px;
  background: white smoke;
  line-height: 2;
  text-align: center;
  font-size: 30px;
  box-shadow: 0 0 5px #00214B
}
</style>
