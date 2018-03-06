import Vue from 'vue'
import Router from 'vue-router'
import SplashPage from '@/components/SplashPage'
import sidebar from '@/components/sidebar'
import sidebarToggle from '@/components/sidebarToggle'
import Prtl2DHist from '@/components/PrtlHists/Prtl2DHistForm'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SplashPage',
      component: SplashPage
    },
    {
      path: '/image',
      name: 'Prtl2DHist',
      component: Prtl2DHist
    },
    {
      path: '/',
      name: 'sidebar',
      component: sidebar
    },
    {
      path: '/',
      name: 'sidebarToggle',
      component: sidebarToggle
    }
  ]
})
