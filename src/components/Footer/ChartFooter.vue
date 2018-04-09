<template>
<div id="footer">
  <sidebar-toggle/>
  <iseult-nav-bar/>
  <sim-nav-bar/>
</div>
</template>

<script>
import SidebarToggle from '@/components/Footer/sidebarToggle.vue'
import NavBar from '@/components/Footer/NavBar.vue'
import SimNavBar from '@/components/Footer/SimNavBar.vue'
export default {
  components: {
    SidebarToggle,
    SimNavBar,
    IseultNavBar: NavBar
  }
}
</script>
<style scoped>
/*.clickable {cursor: pointer;}*/
#MyNavBar{
  opacity:0.1;
  user-select: none;
}
#toggleSpacer{
  width:70px;
}
#footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 70px;
  background: whiteSmoke  ;
  line-height: 2;
  text-align: center;
  font-size: 30px;
  box-shadow: 0 0 5px #00214B
}
</style>
