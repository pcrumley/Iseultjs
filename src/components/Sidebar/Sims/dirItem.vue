<template>
  <li class="list-group-item dir-item">
    <span class="ml-4">
      <font-awesome-icon :icon="folderIcon"/>
    </span>
      <slot>
      </slot>
  </li>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faFolder from '@fortawesome/fontawesome-free-solid/faFolder'

export default {
  data () {
    return {
      active: false
    }
  },
  computed: {
    folderIcon () {
      return faFolder
    }
  },
  components: {
    FontAwesomeIcon
  }
}
</script>

<style scoped>
.hoverable:hover {
  background-color: #E8E8E8;
}
li.dir-item{
  cursor: pointer;
  user-select: none;
}
</style>
